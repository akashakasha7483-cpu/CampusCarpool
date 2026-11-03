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
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING CAMPUSCARPOOL COMPREHENSIVE BACKEND API TEST ---');
  let tokenDriver = '';
  let tokenPassenger = '';
  let rideId = '';
  let requestId = '';

  // 1. Health Check & Privacy Verification
  const health = await request('GET', '/api/health');
  console.log('[1/12] Health Check:', health.status, health.data.project);
  if (health.status !== 200) throw new Error('Health check failed');
  if (health.data.student !== undefined) {
    throw new Error('Privacy check failed: Health endpoint must not expose student name or student ID!');
  }
  if (!health.data.database || health.data.database.connected !== true) {
    throw new Error('Health check failed: Database not connected');
  }
  console.log('       Privacy Verification: PASSED (No student name or student ID in /api/health)');

  // 2. Register Driver
  const uniqueSuffix = Date.now();
  const driverEmail = `driver.${uniqueSuffix}@college.edu`;
  const regDriver = await request('POST', '/api/auth/register', {
    name: 'Campus Driver',
    email: driverEmail,
    password: 'password123',
    studentId: `DRV-${uniqueSuffix.toString().slice(-4)}`,
    department: 'Information Technology',
    phone: '9876543210',
    vehicleInfo: {
      vehicleType: 'Car',
      model: 'Honda City',
      registrationNumber: 'KA-01-MJ-2026',
    },
    bio: 'College student commuting daily via Silk Board and HSR Layout.',
  });
  console.log('[2/12] Register Driver:', regDriver.status, regDriver.data.message);
  if (regDriver.status !== 201) throw new Error('Driver registration failed');
  tokenDriver = regDriver.data.token;

  // 3. Register Passenger (Priya S)
  const passengerEmail = `priya.${uniqueSuffix}@college.edu`;
  const regPassenger = await request('POST', '/api/auth/register', {
    name: 'Priya Sharma',
    email: passengerEmail,
    password: 'password123',
    studentId: '2102508999',
    department: 'Computer Science',
    phone: '9876500000',
    bio: 'CS student looking for regular morning ride.',
  });
  console.log('[3/12] Register Passenger:', regPassenger.status, regPassenger.data.message);
  if (regPassenger.status !== 201) throw new Error('Passenger registration failed');
  tokenPassenger = regPassenger.data.token;

  // 4. Login Driver
  const loginRes = await request('POST', '/api/auth/login', {
    email: driverEmail,
    password: 'password123',
  });
  console.log('[4/12] Login Driver:', loginRes.status, loginRes.data.user.name);
  if (loginRes.status !== 200) throw new Error('Driver login failed');

  // 5. Post Ride as Driver
  const ridePost = await request(
    'POST',
    '/api/rides',
    {
      source: 'Silk Board Junction',
      destination: 'Campus Main Gate',
      waypoints: ['HSR Layout 5th Sector', 'Koramangala Sony World Signal'],
      date: '2026-11-05',
      time: '08:30',
      seatsTotal: 3,
      pricePerSeat: 35,
      vehicleType: 'Car',
      vehicleModel: 'Honda City',
      notes: 'Ac car, leaving sharp at 8:30 AM.',
    },
    tokenDriver
  );
  console.log('[5/12] Post Ride:', ridePost.status, ridePost.data.message, 'Available seats:', ridePost.data.ride.availableSeats);
  if (ridePost.status !== 201) throw new Error('Post ride failed');
  rideId = ridePost.data.ride._id;

  // 6. Search Rides with Intelligent Approximate Matching (Search waypoint "Koramangala")
  const searchRes = await request(
    'GET',
    `/api/rides/search?source=Koramangala&destination=Campus&time=08:35&minSeats=1`,
    null,
    tokenPassenger
  );
  console.log('[6/12] Search & Intelligent Matching: Found', searchRes.data.count, 'rides');
  const matchedRide = searchRes.data.rides[0];
  console.log('       Compatibility Score:', matchedRide.compatibility.score + '%', `(${matchedRide.compatibility.level})`);
  console.log('       Match reasons:', matchedRide.compatibility.reasons);
  if (!matchedRide || matchedRide.compatibility.score < 50) {
    throw new Error('Intelligent route matching failed');
  }

  // 7. Passenger sends seat request (2 seats)
  const reqRes = await request(
    'POST',
    '/api/requests',
    {
      rideId,
      seatsRequested: 2,
      pickupNote: 'Can you pick me up at Sony World Koramangala?',
    },
    tokenPassenger
  );
  console.log('[7/12] Send Seat Request:', reqRes.status, reqRes.data.message);
  if (reqRes.status !== 201) throw new Error('Seat request failed');
  requestId = reqRes.data.request._id;

  // 8. Prevent Duplicate Request Test
  const dupReq = await request(
    'POST',
    '/api/requests',
    {
      rideId,
      seatsRequested: 1,
    },
    tokenPassenger
  );
  console.log('[8/12] Prevent Duplicate Request Test:', dupReq.status, dupReq.data.message);
  if (dupReq.status !== 400) throw new Error('Duplicate request prevention failed');

  // 9. Driver inspects received requests
  const receivedRes = await request('GET', '/api/requests/received', null, tokenDriver);
  console.log('[9/12] Driver Received Requests:', receivedRes.status, 'Total requests:', receivedRes.data.count);
  if (receivedRes.status !== 200 || receivedRes.data.count < 1) throw new Error('Get received requests failed');

  // 10. Driver Accepts seat request (Automatic seat decrement)
  const acceptRes = await request(
    'PATCH',
    `/api/requests/${requestId}/accept`,
    { responseMessage: 'Accepted! See you at Sony World.' },
    tokenDriver
  );
  console.log('[10/12] Accept Seat Request:', acceptRes.status, acceptRes.data.message);
  console.log('        Updated Available Seats on Ride:', acceptRes.data.availableSeats);
  if (acceptRes.status !== 200 || acceptRes.data.availableSeats !== 1) {
    throw new Error('Seat update on acceptance failed');
  }

  // 11. Overbooking Prevention Test (Try to request 3 seats when only 1 is left)
  const anotherPassengerEmail = `rahul.${uniqueSuffix}@college.edu`;
  const regRahul = await request('POST', '/api/auth/register', {
    name: 'Rahul V',
    email: anotherPassengerEmail,
    password: 'password123',
    studentId: '2102508111',
  });
  const overbookReq = await request(
    'POST',
    '/api/requests',
    {
      rideId,
      seatsRequested: 3, // Only 1 left!
    },
    regRahul.data.token
  );
  console.log('[11/12] Overbooking Prevention Test:', overbookReq.status, overbookReq.data.message);
  if (overbookReq.status !== 400) throw new Error('Overbooking prevention failed');

  // 12. Passenger checks My Requests & Driver checks My Rides
  const myReqs = await request('GET', '/api/requests/my-requests', null, tokenPassenger);
  const myRides = await request('GET', '/api/rides/my-rides', null, tokenDriver);
  console.log('[12/12] My Requests & My Rides Check: Passenger has', myReqs.data.count, 'request(s), Driver has', myRides.data.count, 'ride(s)');
  console.log('--- ALL BACKEND TESTS PASSED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('TEST SUITE ERROR:', err);
  process.exit(1);
});

