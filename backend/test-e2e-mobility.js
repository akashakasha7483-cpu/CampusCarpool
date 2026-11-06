/**
 * CampusCarpool End-to-End Mobility Lifecycle Test Suite
 * Tests full multi-user driver & passenger workflows without mock data:
 * 1. Health & privacy audit (no PII exposure on public endpoints)
 * 2. Driver registration & garage vehicle profile configuration
 * 3. Passenger registration & department assignment
 * 4. Multi-stop corridor publication (Silk Board -> HSR -> Campus)
 * 5. Passenger corridor search with intelligent bi-gram route matching
 * 6. Passenger atomic seat reservation request
 * 7. Duplicate reservation prevention
 * 8. Driver dispatch workstation received request review
 * 9. Driver request acceptance & atomic seat decrement verification
 * 10. Passenger boarding pass inspection & revealed driver phone verification
 * 11. Overbooking prevention check (attempting to book beyond capacity fails with HTTP 400)
 * 12. Driver ride cancellation cascading verification
 */

const http = require('http');

const BASE_URL = process.env.TEST_API_URL || 'http://127.0.0.1:5000';

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

async function runE2ETests() {
  console.log('================================================================');
  console.log('  CAMPUSCARPOOL FULL END-TO-END MOBILITY LIFECYCLE TEST SUITE   ');
  console.log('================================================================\n');

  let tokenDriver = '';
  let tokenPassenger = '';
  let rideId = '';
  let requestId = '';
  const uniqueId = Date.now();

  // -------------------------------------------------------------------------
  // STAGE 1: Health Check & Privacy Verification
  // -------------------------------------------------------------------------
  console.log('[STAGE 1/12] Verifying System Health & Privacy Guardrails...');
  const healthRes = await request('GET', '/api/health');
  if (healthRes.status !== 200) {
    throw new Error(`Health check failed with HTTP ${healthRes.status}`);
  }
  if (!healthRes.data.database || !healthRes.data.database.connected) {
    throw new Error('Database is not connected in health response');
  }
  if (healthRes.data.student !== undefined || healthRes.data.studentId !== undefined) {
    throw new Error('Privacy Violation: PII detected in public /api/health endpoint');
  }
  console.log('  -> Health: OK (Status 200, MongoDB Connected, Zero PII leaked)\n');

  // -------------------------------------------------------------------------
  // STAGE 2: Driver Registration & Garage Profile Setup
  // -------------------------------------------------------------------------
  console.log('[STAGE 2/12] Registering Driver & Configuring Garage Vehicle Profile...');
  const driverEmail = `e2e.driver.${uniqueId}@college.edu`;
  const driverPhone = '9876543210';
  const regDriverRes = await request('POST', '/api/auth/register', {
    name: 'E2E Alex Driver',
    email: driverEmail,
    password: 'SecurePassword123!',
    studentId: `DRV-${uniqueId.toString().slice(-4)}`,
    department: 'Robotics & Automation',
    phone: driverPhone,
    bio: 'Daily campus commuter with zero-emission EV.',
  });
  if (regDriverRes.status !== 201 || !regDriverRes.data.token) {
    throw new Error(`Driver registration failed: ${JSON.stringify(regDriverRes.data)}`);
  }
  tokenDriver = regDriverRes.data.token;

  // Update garage vehicle info
  const profileRes = await request(
    'PUT',
    '/api/auth/profile',
    {
      vehicleInfo: {
        vehicleType: 'Car',
        model: 'CyberSedan Neo EV',
        registrationNumber: `KA-01-E2E-${uniqueId.toString().slice(-3)}`,
      },
      bio: 'Verified daily commuter between Silk Board, HSR Layout, and Campus.',
    },
    tokenDriver
  );
  if (profileRes.status !== 200 || profileRes.data.user.vehicleInfo.model !== 'CyberSedan Neo EV') {
    throw new Error(`Driver profile garage update failed: ${JSON.stringify(profileRes.data)}`);
  }
  console.log(`  -> Driver Registered & Garage Configured: ${regDriverRes.data.user.name} (${profileRes.data.user.vehicleInfo.model})\n`);

  // -------------------------------------------------------------------------
  // STAGE 3: Passenger Registration
  // -------------------------------------------------------------------------
  console.log('[STAGE 3/12] Registering Verified Passenger...');
  const passengerEmail = `e2e.passenger.${uniqueId}@college.edu`;
  const passengerPhone = '9876501234';
  const regPassRes = await request('POST', '/api/auth/register', {
    name: 'E2E Maya Passenger',
    email: passengerEmail,
    password: 'SecurePassword123!',
    studentId: `PAS-${uniqueId.toString().slice(-4)}`,
    department: 'Data Science & AI',
    phone: passengerPhone,
    bio: 'CS Student looking for morning shared rides.',
  });
  if (regPassRes.status !== 201 || !regPassRes.data.token) {
    throw new Error(`Passenger registration failed: ${JSON.stringify(regPassRes.data)}`);
  }
  tokenPassenger = regPassRes.data.token;
  console.log(`  -> Passenger Registered: ${regPassRes.data.user.name} (${regPassRes.data.user.department})\n`);

  // -------------------------------------------------------------------------
  // STAGE 4: Driver Posts Multi-Stop Corridor
  // -------------------------------------------------------------------------
  console.log('[STAGE 4/12] Publishing Multi-Stop Commute Corridor...');
  const postRideRes = await request(
    'POST',
    '/api/rides',
    {
      source: 'Silk Board Junction',
      destination: 'Campus Main Gate',
      waypoints: ['HSR Layout 5th Sector', 'Agara Lake Junction'],
      date: '2026-11-10',
      time: '08:30',
      seatsTotal: 3,
      pricePerSeat: 40,
      vehicleType: 'Car',
      vehicleModel: 'CyberSedan Neo EV',
      notes: 'Futuristic electric commute. On-time departure with charging ports available.',
    },
    tokenDriver
  );
  if (postRideRes.status !== 201 || !postRideRes.data.ride) {
    throw new Error(`Corridor posting failed: ${JSON.stringify(postRideRes.data)}`);
  }
  rideId = postRideRes.data.ride._id;
  if (postRideRes.data.ride.availableSeats !== 3) {
    throw new Error(`Initial seats mismatch: expected 3, got ${postRideRes.data.ride.availableSeats}`);
  }
  console.log(`  -> Corridor Posted: ${postRideRes.data.ride.source} -> ${postRideRes.data.ride.destination} (Seats: ${postRideRes.data.ride.availableSeats})\n`);

  // -------------------------------------------------------------------------
  // STAGE 5: Passenger Intelligent Route Matching Search
  // -------------------------------------------------------------------------
  console.log('[STAGE 5/12] Searching Corridor via Intelligent Bi-gram Matching (Waypoint: HSR)...');
  const searchRes = await request(
    'GET',
    `/api/rides/search?source=HSR%20Layout&destination=Campus&time=08:30&minSeats=1`,
    null,
    tokenPassenger
  );
  if (searchRes.status !== 200 || !searchRes.data.rides || searchRes.data.rides.length === 0) {
    throw new Error(`Corridor search failed: ${JSON.stringify(searchRes.data)}`);
  }
  const targetRide = searchRes.data.rides.find((r) => r._id === rideId);
  if (!targetRide) {
    throw new Error('Posted ride not found in intelligent search results');
  }
  if (!targetRide.compatibility || targetRide.compatibility.score < 50) {
    throw new Error(`Insufficient compatibility match score: ${targetRide.compatibility?.score}`);
  }
  console.log(`  -> Intelligent Match Found: Score ${targetRide.compatibility.score}% (${targetRide.compatibility.level})`);
  console.log(`     Match Reasons: ${targetRide.compatibility.reasons.join(', ')}\n`);

  // -------------------------------------------------------------------------
  // STAGE 6: Passenger Sends Atomic Seat Request (2 Seats)
  // -------------------------------------------------------------------------
  console.log('[STAGE 6/12] Passenger Submitting Atomic Seat Request (2 seats)...');
  const seatReqRes = await request(
    'POST',
    '/api/requests',
    {
      rideId,
      seatsRequested: 2,
      pickupNote: 'Will wait at HSR 5th Sector Bus Shelter.',
    },
    tokenPassenger
  );
  if (seatReqRes.status !== 201 || !seatReqRes.data.request) {
    throw new Error(`Seat request submission failed: ${JSON.stringify(seatReqRes.data)}`);
  }
  requestId = seatReqRes.data.request._id;
  if (seatReqRes.data.request.status !== 'pending') {
    throw new Error(`Expected pending status, got: ${seatReqRes.data.request.status}`);
  }
  console.log(`  -> Request Submitted: ID ${requestId} (Seats requested: 2, Status: pending)\n`);

  // -------------------------------------------------------------------------
  // STAGE 7: Duplicate Request Prevention
  // -------------------------------------------------------------------------
  console.log('[STAGE 7/12] Testing Duplicate Reservation Prevention Guardrail...');
  const dupReqRes = await request(
    'POST',
    '/api/requests',
    {
      rideId,
      seatsRequested: 1,
      pickupNote: 'Attempting duplicate booking.',
    },
    tokenPassenger
  );
  if (dupReqRes.status !== 400) {
    throw new Error(`Duplicate request guardrail failed! Expected HTTP 400, got ${dupReqRes.status}`);
  }
  console.log(`  -> Duplicate Prevention Verified: HTTP 400 (${dupReqRes.data.message})\n`);

  // -------------------------------------------------------------------------
  // STAGE 8: Driver Dispatch Workstation Received Requests
  // -------------------------------------------------------------------------
  console.log('[STAGE 8/12] Driver Reviewing Pending Requests in Dispatch Console...');
  const receivedRes = await request('GET', '/api/requests/received', null, tokenDriver);
  if (receivedRes.status !== 200 || !Array.isArray(receivedRes.data.requests)) {
    throw new Error(`Failed to retrieve received requests: ${JSON.stringify(receivedRes.data)}`);
  }
  const pendingRequestInConsole = receivedRes.data.requests.find((r) => r._id === requestId);
  if (!pendingRequestInConsole) {
    throw new Error(`Submitted request ${requestId} not found in driver received requests`);
  }
  console.log(`  -> Request Located in Console: Passenger ${pendingRequestInConsole.passenger.name} (${pendingRequestInConsole.seatsRequested} seats)\n`);

  // -------------------------------------------------------------------------
  // STAGE 9: Driver Accepts Request with Atomic Seat Decrement
  // -------------------------------------------------------------------------
  console.log('[STAGE 9/12] Driver Accepting Booking Request (Triggering Atomic $inc Decrement)...');
  const acceptRes = await request(
    'PATCH',
    `/api/requests/${requestId}/accept`,
    {
      responseMessage: 'Booking confirmed! I will pick you up at HSR 5th Sector at 08:35 AM.',
    },
    tokenDriver
  );
  if (acceptRes.status !== 200) {
    throw new Error(`Accept request failed with HTTP ${acceptRes.status}: ${JSON.stringify(acceptRes.data)}`);
  }
  if (acceptRes.data.availableSeats !== 1) {
    throw new Error(`Atomic decrement failure: Expected 1 remaining seat, got ${acceptRes.data.availableSeats}`);
  }
  console.log(`  -> Booking Accepted! Remaining seats atomically updated: ${acceptRes.data.availableSeats}\n`);

  // -------------------------------------------------------------------------
  // STAGE 10: Passenger Boarding Pass & Secure Driver Contact Verification
  // -------------------------------------------------------------------------
  console.log('[STAGE 10/12] Passenger Verifying Digital Boarding Pass & Driver Phone Disclosure...');
  const myRequestsRes = await request('GET', '/api/requests/my-requests', null, tokenPassenger);
  if (myRequestsRes.status !== 200 || !Array.isArray(myRequestsRes.data.requests)) {
    throw new Error(`Failed to fetch passenger requests: ${JSON.stringify(myRequestsRes.data)}`);
  }
  const acceptedReq = myRequestsRes.data.requests.find((r) => r._id === requestId);
  if (!acceptedReq) {
    throw new Error('Accepted request not found in passenger requests');
  }
  if (acceptedReq.status !== 'accepted') {
    throw new Error(`Expected accepted status, got ${acceptedReq.status}`);
  }
  const revealedDriverPhone = acceptedReq.driver?.phone || acceptedReq.ride?.driver?.phone;
  if (!revealedDriverPhone || revealedDriverPhone !== driverPhone) {
    throw new Error(`Driver phone disclosure failed: expected ${driverPhone}, got ${revealedDriverPhone}`);
  }
  console.log(`  -> Boarding Pass Verified: Status 'accepted', Driver Phone revealed: ${revealedDriverPhone}\n`);

  // -------------------------------------------------------------------------
  // STAGE 11: Overbooking Prevention Verification
  // -------------------------------------------------------------------------
  console.log('[STAGE 11/12] Verifying Concurrency & Overbooking Prevention (Requesting 2 seats when 1 left)...');
  const thirdStudentEmail = `e2e.third.${uniqueId}@college.edu`;
  const regThirdRes = await request('POST', '/api/auth/register', {
    name: 'E2E Third Student',
    email: thirdStudentEmail,
    password: 'SecurePassword123!',
    studentId: `PAS3-${uniqueId.toString().slice(-4)}`,
    department: 'Civil Engineering',
  });
  if (regThirdRes.status !== 201 || !regThirdRes.data.token) {
    throw new Error(`Third student registration failed: ${JSON.stringify(regThirdRes.data)}`);
  }
  const tokenThird = regThirdRes.data.token;

  const overbookRes = await request(
    'POST',
    '/api/requests',
    {
      rideId,
      seatsRequested: 2, // Only 1 seat remains!
      pickupNote: 'Overbooking test request.',
    },
    tokenThird
  );
  if (overbookRes.status !== 400) {
    throw new Error(`Overbooking prevention failed! Expected HTTP 400, got ${overbookRes.status}`);
  }
  console.log(`  -> Overbooking Guardrail Confirmed: HTTP 400 (${overbookRes.data.message})\n`);

  // -------------------------------------------------------------------------
  // STAGE 12: Driver Ride Cancellation Cascading Verification
  // -------------------------------------------------------------------------
  console.log('[STAGE 12/12] Driver Cancelling Ride & Verifying Status Cascades...');
  const cancelRideRes = await request('PATCH', `/api/rides/${rideId}/cancel`, null, tokenDriver);
  if (cancelRideRes.status !== 200 || cancelRideRes.data.ride.status !== 'cancelled') {
    throw new Error(`Ride cancellation failed: ${JSON.stringify(cancelRideRes.data)}`);
  }

  // Verify ride is no longer in active search
  const postCancelSearch = await request('GET', `/api/rides/search?source=HSR&destination=Campus`, null, tokenPassenger);
  const foundCancelledRide = (postCancelSearch.data.rides || []).find((r) => r._id === rideId);
  if (foundCancelledRide) {
    throw new Error('Cancelled ride still returned in active search results');
  }
  console.log('  -> Ride Cancellation & Search Filtering Verified: Ride marked cancelled and excluded from active feed\n');

  console.log('================================================================');
  console.log('  SUCCESS: ALL 12 END-TO-END MOBILITY LIFECYCLE TESTS PASSED!   ');
  console.log('================================================================');
  process.exit(0);
}

runE2ETests().catch((err) => {
  console.error('\nE2E SUITE CRITICAL FAILURE:', err.message);
  if (err.stack) {
    console.error(err.stack);
  }
  process.exit(1);
});

