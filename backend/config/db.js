const mongoose = require('mongoose');
const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let mongodProcess = null;

// Find local mongod executable if installed on Windows or in PATH
function findMongodPath() {
  const commonWindowsPaths = [
    'C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\8.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe',
    'C:\\Program Files\\MongoDB\\Server\\6.0\\bin\\mongod.exe',
  ];

  for (const p of commonWindowsPaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  // Check if mongod is in PATH
  try {
    const stdout = execSync(process.platform === 'win32' ? 'where mongod' : 'which mongod', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    const firstLine = stdout.trim().split(/\r?\n/)[0];
    if (firstLine && fs.existsSync(firstLine)) {
      return firstLine;
    }
  } catch (err) {
    // Not in PATH
  }

  return null;
}

// Spawns local MongoDB daemon if not currently running
async function spawnLocalMongod(port = 27017) {
  const mongodBin = findMongodPath();
  if (!mongodBin) {
    return false;
  }

  const dataDir = path.resolve(__dirname, '..', 'data', 'db');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`[Database] Found local MongoDB binary at: ${mongodBin}`);
  console.log(`[Database] Starting MongoDB instance on port ${port}...`);

  try {
    mongodProcess = spawn(
      mongodBin,
      ['--dbpath', dataDir, '--port', String(port), '--bind_ip', '127.0.0.1'],
      { stdio: 'ignore', detached: false }
    );

    mongodProcess.on('error', (err) => {
      console.error('[Database] Failed to start local mongod process:', err.message);
    });

    // Allow 2.5 seconds for mongod to initialize listening socket
    await new Promise((resolve) => setTimeout(resolve, 2500));
    return true;
  } catch (err) {
    console.error('[Database] Error spawning mongod:', err.message);
    return false;
  }
}

// Connect to MongoDB using Mongoose
const connectDB = async () => {
  const mongoUri =
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/campuscarpool';
  console.log(`[Database] Connecting to MongoDB: ${mongoUri.replace(/:([^:@]+)@/, ':****@')}`);

  try {
    await mongoose.connect(mongoUri, {
      dbName: 'campuscarpool',
      serverSelectionTimeoutMS: 15000,
    });
    console.log(`[Database] MongoDB Connected Successfully: ${mongoose.connection.host} (Database: ${mongoose.connection.name})`);
  } catch (initialErr) {
    console.warn(`[Database] Direct connection to MongoDB failed: ${initialErr.message}`);

    // If local default host was attempted, try launching installed mongod
    if (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost')) {
      console.log('[Database] Attempting to launch local MongoDB server...');
      const started = await spawnLocalMongod(27017);
      if (started) {
        try {
          await mongoose.connect(mongoUri, {
            dbName: 'campuscarpool',
            serverSelectionTimeoutMS: 5000,
          });
          console.log(`[Database] MongoDB Connected Successfully after local start: ${mongoose.connection.host} (Database: ${mongoose.connection.name})`);
          return;
        } catch (retryErr) {
          console.error('[Database] Retry connection after spawn failed:', retryErr.message);
        }
      }
    }

    console.error('\n' + '='.repeat(70));
    console.error('[Database ERROR] Could not connect to MongoDB.');
    console.error('To configure your MongoDB database:');
    console.error('1. If running MongoDB locally, start the service or mongod.');
    console.error('2. Or create a free MongoDB Atlas cluster (cloud.mongodb.com)');
    console.error('3. Add your connection string in backend/.env:');
    console.error('   MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/campuscarpool');
    console.error('='.repeat(70) + '\n');
    throw initialErr;
  }
};

// Cleanup mongod on exit if spawned
process.on('SIGINT', () => {
  if (mongodProcess) {
    try {
      mongodProcess.kill();
    } catch (e) {}
  }
  process.exit(0);
});

module.exports = connectDB;

