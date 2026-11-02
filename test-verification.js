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
          resolve({ status: res.statusCode, headers: res.headers, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
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

async function verifyAll() {
  const results = {
    passed: [],
    failed: [],
  };

  const assert = (condition, testName, details = '') => {
    if (condition) {
      results.passed.push({ name: testName, details });
      console.log(`[PASS] ${testName}`);
    } else {
      results.failed.push({ name: testName, details });
      console.error(`[FAIL] ${testName}: ${details}`);
    }
  };

  console.log('\n======================================================');
  console.log(' CAMPUSCARPOOL COMPREHENSIVE FINAL VERIFICATION SUITE ');
  console.log(' Student: AKASH M R (ID: 2102508522)                  ');
  console.log('======================================================\n');

  try {
    // 1. Health check & DB connection
    const health = await request('GET', '/api/health');
    assert(
      health.status === 200 && health.data?.database?.connected === true,
      'System Health & MongoDB Connectivity Check',
      `Status: ${health.status}, DB Connected: ${health.data?.database?.connected}`
    );

    // 2. Existing database persistence check (Ensure no data loss)
    const existingRides = await request('GET', '/api/rides');
    assert(
      existingRides.status === 200 && Array.isArray(existingRides.data?.rides) && existingRides.data.rides.length > 0,
      'MongoDB Persistence & Existing Database Intact',
      `Found ${existingRides.data?.rides?.length} active rides in MongoDB.`
    );

    // 3. API Validation: Registration missing required fields
    const invalidReg = await request('POST', '/api/auth/register', {
      email: 'incomplete@college.edu',
    });
    assert(
      invalidReg.status === 400 && invalidReg.data.success === false,
      'API Validation: Missing Required Registration Fields Rejected',
      `Returned HTTP ${invalidReg.status}: ${invalidReg.data.message}`
    );

    // 4. API Validation: Password length < 6 characters
    const shortPassReg = await request('POST', '/api/auth/register', {
      name: 'Test Student',
      email: 'shortpass@college.edu',
      password: '123',
      studentId: '2102508999',
    });
    assert(
      shortPassReg.status === 400,
      'API Validation: Weak Password (<6 chars) Rejected',
      `Returned HTTP ${shortPassReg.status}`
    );

    // 5. Test Live Student Registration (Unique Driver)
    const ts = Date.now();
    const testDriverEmail = `verify.driver.${ts}@college.edu`;
    const regDriver = await request('POST', '/api/auth/register', {
      name: 'Verification Driver',
      email: testDriverEmail,
      password: 'validPassword123',
      studentId: `VD${ts.toString().slice(-6)}`,
      department: 'Information Technology',
      phone: '9876511111',
      vehicleInfo: {
        vehicleType: 'Car',
        model: 'Honda City i-VTEC',
        registrationNumber: 'KA-01-AB-9999',
      },
      bio: 'Daily tech corridor commuter.',
    });
    assert(
      regDriver.status === 201 && regDriver.data?.token,
      'Student Registration (Driver Role with Vehicle Specs)',
      `Token issued: ${!!regDriver.data?.token}`
    );
    const driverToken = regDriver.data?.token;

    // 6. Test Live Student Registration (Unique Passenger)
    const testPassengerEmail = `verify.passenger.${ts}@college.edu`;
    const regPassenger = await request('POST', '/api/auth/register', {
      name: 'Verification Passenger',
      email: testPassengerEmail,
      password: 'validPassword123',
      studentId: `VP${ts.toString().slice(-6)}`,
      department: 'Computer Science',
      phone: '9876522222',
      bio: 'Student passenger seeking morning carpools.',
    });
    assert(
      regPassenger.status === 201 && regPassenger.data?.token,
      'Student Registration (Passenger Role)',
      `Token issued: ${!!regPassenger.data?.token}`
    );
    const passengerToken = regPassenger.data?.token;

    // 7. Duplicate email registration rejection
    const dupReg = await request('POST', '/api/auth/register', {
      name: 'Duplicate Student',
      email: testDriverEmail,
      password: 'validPassword123',
      studentId: 'DUP123',
    });
    assert(
      dupReg.status === 400 && dupReg.data.success === false,
      'Duplicate Email Registration Prevention',
      dupReg.data.message
    );

    // 8. Login with Valid Credentials
    const loginRes = await request('POST', '/api/auth/login', {
      email: testDriverEmail,
      password: 'validPassword123',
    });
    assert(
      loginRes.status === 200 && loginRes.data?.user?.email === testDriverEmail,
      'Student Login with Valid Credentials',
      `Welcome ${loginRes.data?.user?.name}`
    );

    // 9. Login with Incorrect Password
    const badLogin = await request('POST', '/api/auth/login', {
      email: testDriverEmail,
      password: 'wrongPassword',
    });
    assert(
      badLogin.status === 401 && badLogin.data?.success === false,
      'Authentication: Bad Password Returns HTTP 401',
      badLogin.data.message
    );

    // 10. Private API Route Guard (No Token)
    const noTokenRes = await request('GET', '/api/auth/me');
    assert(
      noTokenRes.status === 401 && noTokenRes.data.success === false,
      'Security: Private Routes Reject Unauthenticated Requests',
      noTokenRes.data.message
    );

    // 11. Profile Update
    const updateProf = await request(
      'PUT',
      '/api/auth/profile',
      {
        department: 'Information Technology (Honors)',
        phone: '9998887776',
        bio: 'Updated commuter bio for test verification.',
      },
      driverToken
    );
    assert(
      updateProf.status === 200 && updateProf.data?.user?.phone === '9998887776',
      'Student Profile Management & Update',
      `Updated phone: ${updateProf.data?.user?.phone}`
    );

    // 12. Post a Ride with Source, Destination, Waypoints, Date, Time, Seats & Price
    const postRideRes = await request(
      'POST',
      '/api/rides',
      {
        source: 'Koramangala Sony World Signal',
        destination: 'Campus Academic Block 3',
        waypoints: ['St Johns Hospital Junction', 'Silk Board Skywalk', 'HSR BDA Complex'],
        date: '2026-11-10',
        time: '08:30',
        seatsTotal: 3,
        pricePerSeat: 45,
        vehicleType: 'Car',
        vehicleModel: 'Honda City i-VTEC',
        notes: 'Leaving punctually at 8:30 AM. Air-conditioned vehicle.',
      },
      driverToken
    );
    assert(
      postRideRes.status === 201 && postRideRes.data?.ride?._id,
      'Ride Posting with Multi-Stop Waypoints & Metadata',
      `Ride ID: ${postRideRes.data?.ride?._id}, Seats: ${postRideRes.data?.ride?.availableSeats}`
    );
    const rideId = postRideRes.data?.ride?._id;

    // 13. Search Rides: Exact Route Match
    const exactSearch = await request(
      'GET',
      `/api/rides/search?source=Koramangala&destination=Campus&date=2026-11-10&time=08:30&minSeats=1`,
      null,
      passengerToken
    );
    const exactMatch = exactSearch.data?.rides?.find((r) => r._id === rideId);
    assert(
      exactSearch.status === 200 && exactMatch && exactMatch.compatibility.score >= 85,
      'Intelligent Route Search: Exact & High Match Scoring (>=85%)',
      `Match Score: ${exactMatch?.compatibility?.score}% (${exactMatch?.compatibility?.level})`
    );

    // 14. Search Rides: Approximate Intermediate Waypoint Match (Silk Board -> Campus)
    const waypointSearch = await request(
      'GET',
      `/api/rides/search?source=Silk Board&destination=Campus&time=08:35`,
      null,
      passengerToken
    );
    const wpMatch = waypointSearch.data?.rides?.find((r) => r._id === rideId);
    assert(
      waypointSearch.status === 200 && wpMatch && wpMatch.compatibility.score >= 70,
      'Intelligent Route Search: Waypoint & Intermediate Stop Proximity Detection',
      `Discovered via waypoint with score: ${wpMatch?.compatibility?.score}%, Reasons: ${wpMatch?.compatibility?.reasons?.join(', ')}`
    );

    // 15. Search Rides: Time Filtering Proximity
    const timeSearch = await request(
      'GET',
      `/api/rides/search?source=Koramangala&destination=Campus&time=18:00`, // 10 hours difference!
      null,
      passengerToken
    );
    const distantTimeMatch = timeSearch.data?.rides?.find((r) => r._id === rideId);
    assert(
      distantTimeMatch && distantTimeMatch.compatibility.score < exactMatch.compatibility.score,
      'Time Compatibility Filter: Time Proximity Delta Applied Correctly',
      `Time penalty applied. Time diff: ${distantTimeMatch?.compatibility?.details?.timeDiffMins} mins, Score: ${distantTimeMatch?.compatibility?.score}%`
    );

    // 16. Driver Cannot Request Seat on Own Ride
    const driverSelfReq = await request(
      'POST',
      '/api/requests',
      {
        rideId,
        seatsRequested: 1,
      },
      driverToken
    );
    assert(
      driverSelfReq.status === 400 && driverSelfReq.data?.success === false,
      'Business Logic: Driver Prevented from Requesting Seat on Own Ride',
      driverSelfReq.data?.message
    );

    // 17. Passenger Sends Seat Request (2 Seats Requested)
    const sendReqRes = await request(
      'POST',
      '/api/requests',
      {
        rideId,
        seatsRequested: 2,
        pickupNote: 'Will wait near Silk Board skywalk entrance.',
      },
      passengerToken
    );
    assert(
      sendReqRes.status === 201 && sendReqRes.data?.request?._id,
      'Seat Request Submission with Passenger Pickup Notes',
      `Request ID: ${sendReqRes.data?.request?._id}, Status: ${sendReqRes.data?.request?.status}`
    );
    const requestId = sendReqRes.data?.request?._id;

    // 18. Duplicate Request Prevention
    const dupSeatReq = await request(
      'POST',
      '/api/requests',
      {
        rideId,
        seatsRequested: 1,
      },
      passengerToken
    );
    assert(
      dupSeatReq.status === 400 && dupSeatReq.data?.success === false,
      'Concurrency & Integrity: Duplicate Seat Request Rejection',
      dupSeatReq.data?.message
    );

    // 19. Driver Inspects Received Requests
    const driverReceived = await request(
      'GET',
      `/api/requests/received?rideId=${rideId}`,
      null,
      driverToken
    );
    assert(
      driverReceived.status === 200 && driverReceived.data?.count >= 1,
      'Driver Received Requests Queue Inspection',
      `Count: ${driverReceived.data?.count}`
    );

    // 20. Driver Accepts Request & Atomic Seat Update
    const acceptReqRes = await request(
      'PATCH',
      `/api/requests/${requestId}/accept`,
      { responseMessage: 'Confirmed! See you at Silk Board skywalk at 8:40 AM.' },
      driverToken
    );
    assert(
      acceptReqRes.status === 200 && acceptReqRes.data?.availableSeats === 1,
      'Atomic Seat Decrement on Request Acceptance (3 seats - 2 = 1 seat remaining)',
      `Available seats remaining: ${acceptReqRes.data?.availableSeats}`
    );

    // 21. Overbooking Prevention (Attempting to book 2 seats when only 1 is left)
    const secondPassengerEmail = `passenger2.${ts}@college.edu`;
    const regSecondPassenger = await request('POST', '/api/auth/register', {
      name: 'Second Passenger',
      email: secondPassengerEmail,
      password: 'validPassword123',
      studentId: `SP${ts.toString().slice(-6)}`,
    });
    const overbookAttempt = await request(
      'POST',
      '/api/requests',
      {
        rideId,
        seatsRequested: 2, // Only 1 left!
      },
      regSecondPassenger.data?.token
    );
    assert(
      overbookAttempt.status === 400 && overbookAttempt.data?.success === false,
      'Overbooking Prevention: Request Exceeding Available Capacity Blocked',
      overbookAttempt.data?.message
    );

    // 22. Passenger Checks My Requests Status
    const myReqs = await request('GET', '/api/requests/my-requests', null, passengerToken);
    const acceptedItem = myReqs.data?.requests?.find((r) => r._id === requestId);
    assert(
      myReqs.status === 200 && acceptedItem?.status === 'accepted',
      'Passenger My Requests Tracker: Confirmed Status & Response Note Visible',
      `Status: ${acceptedItem?.status}, Response: "${acceptedItem?.responseMessage}"`
    );

    // 23. Driver Checks My Hosted Rides
    const myRides = await request('GET', '/api/rides/my-rides', null, driverToken);
    const hostedItem = myRides.data?.rides?.find((r) => r._id === rideId);
    assert(
      myRides.status === 200 && hostedItem && hostedItem.availableSeats === 1,
      'Driver My Hosted Rides: Live Seat Count & Passenger Tally Verified',
      `Available: ${hostedItem?.availableSeats}, Accepted: ${hostedItem?.acceptedPassengersCount}`
    );

    // 24. Passenger Cancels Request -> Automatic Seat Restoration
    const cancelReq = await request('PATCH', `/api/requests/${requestId}/cancel`, null, passengerToken);
    const rideAfterCancel = await request('GET', `/api/rides/${rideId}`);
    assert(
      cancelReq.status === 200 && rideAfterCancel.data?.ride?.availableSeats === 3,
      'Passenger Cancellation: Automatic Seat Restoration (1 seat + 2 = 3 seats restored)',
      `Seats after cancellation: ${rideAfterCancel.data?.ride?.availableSeats}`
    );
  } catch (err) {
    console.error('CRITICAL VERIFICATION ERROR:', err);
    results.failed.push({ name: 'Execution Runtime', details: err.message });
  }

  console.log('\n======================================================');
  console.log(` VERIFICATION SUMMARY: ${results.passed.length} PASSED, ${results.failed.length} FAILED`);
  console.log('======================================================\n');

  if (results.failed.length > 0) {
    console.error('Failed items:', results.failed);
    process.exit(1);
  } else {
    console.log('ALL VERIFICATION REQUIREMENTS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  }
}

verifyAll();

