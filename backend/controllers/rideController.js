const Ride = require('../models/Ride');
const RideRequest = require('../models/RideRequest');
const { calculateRideCompatibility } = require('../utils/routeMatcher');

// @desc    Post a new ride
// @route   POST /api/rides
// @access  Private
const postRide = async (req, res, next) => {
  try {
    const {
      source,
      destination,
      waypoints,
      date,
      time,
      seatsTotal,
      pricePerSeat,
      vehicleType,
      vehicleModel,
      notes,
    } = req.body;

    if (!source || !destination || !date || !time || !seatsTotal) {
      return res.status(400).json({
        success: false,
        message: 'Please provide source, destination, date, time, and total seats.',
      });
    }

    const seats = parseInt(seatsTotal, 10);
    if (isNaN(seats) || seats < 1) {
      return res.status(400).json({
        success: false,
        message: 'Total seats must be a positive integer (at least 1).',
      });
    }

    // Process waypoints if provided as comma-separated string or array
    let parsedWaypoints = [];
    if (Array.isArray(waypoints)) {
      parsedWaypoints = waypoints.map((w) => w.trim()).filter(Boolean);
    } else if (typeof waypoints === 'string') {
      parsedWaypoints = waypoints.split(',').map((w) => w.trim()).filter(Boolean);
    }

    const ride = await Ride.create({
      driver: req.user._id,
      source: source.trim(),
      destination: destination.trim(),
      waypoints: parsedWaypoints,
      date: date.trim(),
      time: time.trim(),
      seatsTotal: seats,
      availableSeats: seats,
      pricePerSeat: pricePerSeat !== undefined ? parseFloat(pricePerSeat) : 30,
      vehicleType: vehicleType || (req.user.vehicleInfo && req.user.vehicleInfo.vehicleType) || 'Car',
      vehicleModel: vehicleModel || (req.user.vehicleInfo && req.user.vehicleInfo.model) || '',
      notes: notes ? notes.trim() : '',
      status: 'active',
    });

    const populatedRide = await Ride.findById(ride._id).populate(
      'driver',
      'name email studentId department phone rating vehicleInfo'
    );

    res.status(201).json({
      success: true,
      message: 'Ride posted successfully!',
      ride: populatedRide,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Find & search rides with intelligent route matching & compatibility score
// @route   GET /api/rides/search
// @access  Public or Private (Private preferred for student context)
const searchRides = async (req, res, next) => {
  try {
    const { source, destination, date, time, minSeats } = req.query;

    const requestedSeats = minSeats ? parseInt(minSeats, 10) : 1;

    // Filter base query for active rides with enough seats
    const query = {
      status: 'active',
      availableSeats: { $gte: requestedSeats },
    };

    if (date) {
      query.date = date.trim();
    }

    // Exclude current user's own rides only if explicitly requested
    if (req.user && req.query.excludeOwn === 'true') {
      query.driver = { $ne: req.user._id };
    }

    const rides = await Ride.find(query)
      .populate('driver', 'name email studentId department phone rating vehicleInfo')
      .sort({ date: 1, time: 1 });

    // Apply intelligent route matching and compatibility scoring
    const searchFilter = {
      source,
      destination,
      date,
      time,
      seats: requestedSeats,
    };

    const scoredRides = rides.map((rideDoc) => {
      const rideObj = rideDoc.toObject();
      const compatibility = calculateRideCompatibility(searchFilter, rideObj);
      return {
        ...rideObj,
        compatibility,
      };
    });

    // If search criteria were provided, filter out zero-score rides and sort by highest compatibility
    let results = scoredRides;
    if (source || destination || time) {
      results = scoredRides
        .filter((r) => r.compatibility.score > 0)
        .sort((a, b) => b.compatibility.score - a.compatibility.score);
    }

    res.status(200).json({
      success: true,
      count: results.length,
      rides: results,
      searchCriteria: searchFilter,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all active rides (feed)
// @route   GET /api/rides
// @access  Public
const getAllActiveRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({ status: 'active', availableSeats: { $gt: 0 } })
      .populate('driver', 'name email studentId department rating')
      .sort({ createdAt: -1 })
      .limit(30);

    res.status(200).json({
      success: true,
      count: rides.length,
      rides,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single ride details by ID (including confirmed passengers)
// @route   GET /api/rides/:id
// @access  Public / Private
const getRideById = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id).populate(
      'driver',
      'name email studentId department phone rating vehicleInfo'
    );

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    // Also fetch confirmed passengers from accepted requests
    const acceptedRequests = await RideRequest.find({
      ride: ride._id,
      status: 'accepted',
    }).populate('passenger', 'name email studentId department phone');

    res.status(200).json({
      success: true,
      ride,
      passengers: acceptedRequests.map((r) => ({
        ...r.passenger.toObject(),
        seatsBooked: r.seatsRequested,
        requestId: r._id,
      })),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rides posted by the current logged in student
// @route   GET /api/rides/my-rides
// @access  Private
const getMyRides = async (req, res, next) => {
  try {
    const rides = await Ride.find({ driver: req.user._id })
      .populate('driver', 'name email studentId department rating')
      .sort({ createdAt: -1 });

    // For each ride, count pending requests
    const ridesWithRequestStats = await Promise.all(
      rides.map(async (ride) => {
        const rideObj = ride.toObject();
        const pendingCount = await RideRequest.countDocuments({
          ride: ride._id,
          status: 'pending',
        });
        const acceptedCount = await RideRequest.countDocuments({
          ride: ride._id,
          status: 'accepted',
        });
        return {
          ...rideObj,
          pendingRequestsCount: pendingCount,
          acceptedPassengersCount: acceptedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: ridesWithRequestStats.length,
      rides: ridesWithRequestStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel or delete a ride
// @route   PATCH /api/rides/:id/cancel
// @access  Private (Driver only)
const cancelRide = async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this ride. Only the driver can cancel.',
      });
    }

    ride.status = 'cancelled';
    await ride.save();

    // Mark pending requests as rejected/cancelled
    await RideRequest.updateMany(
      { ride: ride._id, status: 'pending' },
      { status: 'cancelled', responseMessage: 'Ride was cancelled by the driver.' }
    );

    res.status(200).json({
      success: true,
      message: 'Ride has been cancelled.',
      ride,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postRide,
  searchRides,
  getAllActiveRides,
  getRideById,
  getMyRides,
  cancelRide,
};

