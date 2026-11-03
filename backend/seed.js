const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Ride = require('./models/Ride');
const RideRequest = require('./models/RideRequest');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany({});
    await Ride.deleteMany({});
    await RideRequest.deleteMany({});

    console.log('[Seed] Creating demo student accounts...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Primary Demo Driver
    const primaryDriver = await User.create({
      name: 'Campus Driver',
      email: 'driver@college.edu',
      password: passwordHash,
      studentId: 'DRV-2026-001',
      department: 'Information Technology',
      phone: '9876543210',
      vehicleInfo: {
        vehicleType: 'Car',
        model: 'Honda City',
        registrationNumber: 'KA-01-MJ-2026',
      },
      bio: 'College student commuting daily along Silk Board and HSR Layout.',
      rating: 4.9,
      ridesHosted: 8,
      ridesJoined: 2,
    });

    // 2. Fellow Student 1: Priya Sharma (Passenger)
    const priya = await User.create({
      name: 'Priya Sharma',
      email: 'priya@college.edu',
      password: passwordHash,
      studentId: '2102508101',
      department: 'Computer Science',
      phone: '9876501122',
      vehicleInfo: { vehicleType: 'None' },
      bio: 'CS 3rd year student looking for regular morning rides.',
      rating: 4.8,
      ridesHosted: 0,
      ridesJoined: 12,
    });

    // 3. Fellow Student 2: Rahul Verma (Driver)
    const rahul = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@college.edu',
      password: passwordHash,
      studentId: '2102508204',
      department: 'Electronics & Communication',
      phone: '9876503344',
      vehicleInfo: {
        vehicleType: 'Car',
        model: 'Hyundai i20',
        registrationNumber: 'KA-05-EV-4422',
      },
      bio: 'ECE student, commuting from Whitefield via Marathahalli.',
      rating: 4.7,
      ridesHosted: 5,
      ridesJoined: 3,
    });

    // 4. Fellow Student 3: Ananya Rao (Driver - Bike)
    const ananya = await User.create({
      name: 'Ananya Rao',
      email: 'ananya@college.edu',
      password: passwordHash,
      studentId: '2102508315',
      department: 'Information Technology',
      phone: '9876505566',
      vehicleInfo: {
        vehicleType: 'Bike',
        model: 'Royal Enfield Hunter 350',
        registrationNumber: 'KA-03-JK-9911',
      },
      bio: 'Quick commuter with spare pillion helmet.',
      rating: 4.9,
      ridesHosted: 14,
      ridesJoined: 1,
    });

    console.log('[Seed] Creating demo campus rides...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const dayAfterStr = dayAfter.toISOString().split('T')[0];

    // Ride 1 by Campus Driver (Silk Board -> Campus Main Gate via HSR & Koramangala)
    const ride1 = await Ride.create({
      driver: primaryDriver._id,
      source: 'Silk Board Junction',
      destination: 'Campus Main Gate',
      waypoints: ['HSR Layout 5th Sector', 'Koramangala Sony World Signal'],
      date: dateStr,
      time: '08:30',
      seatsTotal: 3,
      availableSeats: 2, // 1 booked
      pricePerSeat: 35,
      vehicleType: 'Car',
      vehicleModel: 'Honda City',
      notes: 'AC car, smooth commute. Leaving sharp at 8:30 AM.',
      status: 'active',
    });

    // Ride 2 by Rahul (Whitefield -> Campus Engineering Block)
    const ride2 = await Ride.create({
      driver: rahul._id,
      source: 'Whitefield TTMC',
      destination: 'Campus Engineering Block',
      waypoints: ['Marathahalli Bridge', 'HAL Main Gate', 'Indiranagar Metro'],
      date: dateStr,
      time: '08:45',
      seatsTotal: 4,
      availableSeats: 3,
      pricePerSeat: 40,
      vehicleType: 'Car',
      vehicleModel: 'Hyundai i20',
      notes: 'Leaving from Whitefield TTMC gate 1.',
      status: 'active',
    });

    // Ride 3 by Ananya (Indiranagar 100ft Road -> Campus via Domlur)
    const ride3 = await Ride.create({
      driver: ananya._id,
      source: 'Indiranagar 100ft Road',
      destination: 'Campus Main Gate',
      waypoints: ['Domlur Flyover', 'Koramangala Intermediate Ring Road'],
      date: dateStr,
      time: '08:50',
      seatsTotal: 1,
      availableSeats: 1,
      pricePerSeat: 25,
      vehicleType: 'Bike',
      vehicleModel: 'Hunter 350',
      notes: 'Extra ISI certified helmet provided. Pillion ride.',
      status: 'active',
    });

    // Ride 4 by Campus Driver (Evening return: Campus -> Silk Board)
    const ride4 = await Ride.create({
      driver: primaryDriver._id,
      source: 'Campus Main Gate',
      destination: 'Silk Board Junction',
      waypoints: ['Koramangala Water Tank', 'HSR BDA Complex'],
      date: dateStr,
      time: '17:15',
      seatsTotal: 3,
      availableSeats: 3,
      pricePerSeat: 35,
      vehicleType: 'Car',
      vehicleModel: 'Honda City',
      notes: 'Evening return after 5 PM classes.',
      status: 'active',
    });

    console.log('[Seed] Creating demo ride requests...');
    // Request 1: Priya booked 1 seat on Driver's ride (Accepted)
    await RideRequest.create({
      ride: ride1._id,
      passenger: priya._id,
      driver: primaryDriver._id,
      seatsRequested: 1,
      pickupNote: 'Can you pick me up near Sony World Koramangala?',
      status: 'accepted',
      responseMessage: 'Accepted! See you at Sony World at 8:40 AM.',
    });

    // Request 2: Priya requested 1 seat on Rahul's ride (Pending)
    await RideRequest.create({
      ride: ride2._id,
      passenger: priya._id,
      driver: rahul._id,
      seatsRequested: 1,
      pickupNote: 'Will wait at Marathahalli bridge bus stop.',
      status: 'pending',
    });

    console.log('\n======================================================');
    console.log(' Database Seeded Successfully with Academic Demo Data!');
    console.log(' Credentials:');
    console.log(' 1. Driver (Campus Driver - DRV-2026-001): driver@college.edu / password123');
    console.log(' 2. Passenger (Priya Sharma):         priya@college.edu / password123');
    console.log(' 3. Driver (Rahul Verma):            rahul@college.edu / password123');
    console.log(' 4. Driver (Ananya Rao):             ananya@college.edu / password123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed Error:', err);
    process.exit(1);
  }
};

seedData();

