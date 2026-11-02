const http = require('http');

const BASE_URL = 'http://127.0.0.1:5000';

function request(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { 'Content-Type': 'application/json' },
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test3DRoutes() {
  console.log('--- TESTING 3D GEOSPATIAL & VEHICLE MOBILITY INTEGRATION ---');

  // 1. Verify Active Rides Contain Valid Coordinates
  const ridesRes = await request('GET', '/api/rides');
  if (ridesRes.status !== 200 || !ridesRes.data.rides.length) {
    throw new Error('Could not fetch rides for 3D route check');
  }

  const ride = ridesRes.data.rides[0];
  console.log(`[1/4] Checking Coordinates for: ${ride.source} -> ${ride.destination}`);
  console.log(`      Source Coordinates: [${ride.sourceCoords}]`);
  console.log(`      Destination Coordinates: [${ride.destinationCoords}]`);
  console.log(`      Waypoints Coordinates Count: ${ride.waypointsCoords?.length || 0}`);

  if (!Array.isArray(ride.sourceCoords) || ride.sourceCoords.length !== 2) {
    throw new Error('Invalid source coordinates format');
  }
  if (!Array.isArray(ride.destinationCoords) || ride.destinationCoords.length !== 2) {
    throw new Error('Invalid destination coordinates format');
  }

  const [srcLng, srcLat] = ride.sourceCoords;
  if (srcLng < -180 || srcLng > 180 || srcLat < -90 || srcLat > 90) {
    throw new Error('Source coordinates outside valid geographic range');
  }
  console.log('[PASS] Geographic coordinates validated for 3D vector map');

  // 2. Login to test vehicle garage profile update
  const loginRes = await request('POST', '/api/auth/login', {
    email: 'akash@college.edu',
    password: 'password123',
  });
  if (loginRes.status !== 200) throw new Error('Could not log in as Akash');
  const token = loginRes.data.token;

  // 3. Update Garage Vehicle to Cyber Bike
  const updateBike = await request(
    'PUT',
    '/api/auth/profile',
    {
      vehicleInfo: {
        vehicleType: 'Bike',
        model: 'Royal Enfield Hunter 350',
        registrationNumber: 'KA-01-MJ-2026',
      },
    },
    token
  );
  if (updateBike.status !== 200 || updateBike.data.user.vehicleInfo.vehicleType !== 'Bike') {
    throw new Error('Garage Bike preference update failed');
  }
  console.log('[PASS] 3D Garage: Successfully updated vehicle preference to Cyber Bike');

  // 4. Update Garage Vehicle back to Cyber Car
  const updateCar = await request(
    'PUT',
    '/api/auth/profile',
    {
      vehicleInfo: {
        vehicleType: 'Car',
        model: 'Honda City i-VTEC',
        registrationNumber: 'KA-01-MJ-2026',
      },
    },
    token
  );
  if (updateCar.status !== 200 || updateCar.data.user.vehicleInfo.vehicleType !== 'Car') {
    throw new Error('Garage Car preference update failed');
  }
  console.log('[PASS] 3D Garage: Successfully restored vehicle preference to Cyber Car');

  console.log('--- ALL 3D MOBILITY & GEOSPATIAL CHECKS PASSED! ---');
  process.exit(0);
}

test3DRoutes().catch((err) => {
  console.error('3D ROUTE TEST ERROR:', err.message);
  process.exit(1);
});

