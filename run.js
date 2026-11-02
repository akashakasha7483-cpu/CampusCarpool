/**
 * CampusCarpool Unified Runner
 * Student: AKASH M R (ID: 2102508522)
 *
 * Launches Express Backend (Port 5000) and Vite Frontend (Port 5173) concurrently.
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('=================================================================');
console.log('              CAMPUSCARPOOL - COLLEGE ACADEMIC PROJECT            ');
console.log('                  Student Name: AKASH M R                         ');
console.log('                  Student ID:   2102508522                        ');
console.log('=================================================================\n');

const isWin = process.platform === 'win32';
const npmCmd = isWin ? 'npm.cmd' : 'npm';

console.log('[System] Launching Node.js Express Backend on http://localhost:5000 ...');
const backend = spawn(npmCmd, ['start'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  shell: true,
});

console.log('[System] Launching Vite React Frontend on http://localhost:5173 ...');
const frontend = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true,
});

function shutdown() {
  console.log('\n[System] Gracefully stopping CampusCarpool servers...');
  try {
    if (isWin) {
      spawn('taskkill', ['/pid', backend.pid, '/f', '/t']);
      spawn('taskkill', ['/pid', frontend.pid, '/f', '/t']);
    } else {
      backend.kill('SIGINT');
      frontend.kill('SIGINT');
    }
  } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

