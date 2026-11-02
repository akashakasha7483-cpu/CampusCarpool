const mongoose = require('mongoose');
const RideRequest = require('../models/RideRequest');
const Ride = require('../models/Ride');
const User = require('../models/User');

// @desc    Send a seat request to join a ride
// @route   POST /api/requests
// @access  Private (Passenger)
const sendSeatRequest = async (req, res, next) => {
  try {
    const { rideId, seatsRequested, pickupNote } = req.body;

    if (!rideId) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID is required to request a seat.',
      });
    }

    const requestedCount = seatsRequested ? parseInt(seatsRequested, 10) : 1;
    if (isNaN(requestedCount) || requestedCount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Requested seats must be at least 1.',
      });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found.',
      });
    }

    // Driver cannot request their own ride
    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book a seat on your own posted ride.',
      });
    }

    // Check ride status
    if (ride.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: `This ride is ${ride.status} and cannot accept new bookings.`,
      });
    }

    // Check seat availability
    if (ride.availableSeats < requestedCount) {
      return res.status(400).json({
        success: false,
        message: `Only ${ride.availableSeats} seat(s) available on this ride.`,
      });
    }

    // Prevent duplicate active requests
    const existingRequest = await RideRequest.findOne({
      ride: ride._id,
      passenger: req.user._id,
      status: { $in: ['pending', 'accepted'] },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${existingRequest.status} request for this ride.`,
      });
    }

    const request = await RideRequest.create({
      ride: ride._id,
      passenger: req.user._id,
      driver: ride.driver,
      seatsRequested: requestedCount,
      pickupNote: pickupNote ? pickupNote.trim() : '',
      status: 'pending',
    });

    const populatedRequest = await RideRequest.findById(request._id)
      .populate('ride', 'source destination date time pricePerSeat vehicleType')
      .populate('driver', 'name email phone rating')
      .populate('passenger', 'name email studentId department phone');

    res.status(201).json({
      success: true,
      message: 'Seat request sent to driver successfully!',
      request: populatedRequest,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Accept seat request & automatically update available seats
// @route   PATCH /api/requests/:id/accept
// @access  Private (Driver only)
const acceptSeatRequest = async (req, res, next) => {
  try {
    const request = await RideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Seat request not found.',
      });
    }

    if (request.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the driver can accept requests for this ride.',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}.`,
      });
    }

    // Atomically find ride and check seat availability to prevent race conditions / overbooking
    const ride = await Ride.findOneAndUpdate(
      {
        _id: request.ride,
        availableSeats: { $gte: request.seatsRequested },
        status: 'active',
      },
      {
        $inc: { availableSeats: -request.seatsRequested },
      },
      { new: true }
    );

    if (!ride) {
      return res.status(400).json({
        success: false,
        message: 'Cannot accept request: Insufficient available seats remaining or ride is no longer active.',
      });
    }

    // If seats reached 0, update ride status to full
    if (ride.availableSeats === 0) {
      ride.status = 'full';
      await ride.save();
    }

    // Update request status
    request.status = 'accepted';
    request.responseMessage = req.body.responseMessage || 'Seat confirmed! See you at pickup.';
    await request.save();

    // Increment passenger stats
    await User.findByIdAndUpdate(request.passenger, { $inc: { ridesJoined: 1 } });
    // Increment driver stats
    await User.findByIdAndUpdate(request.driver, { $inc: { ridesHosted: 1 } });

    const populatedRequest = await RideRequest.findById(request._id)
      .populate('passenger', 'name email studentId department phone')
      .populate('ride');

    res.status(200).json({
      success: true,
      message: `Request accepted! ${request.seatsRequested} seat(s) booked. ${ride.availableSeats} seat(s) remaining.`,
      request: populatedRequest,
      availableSeats: ride.availableSeats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject seat request
// @route   PATCH /api/requests/:id/reject
// @access  Private (Driver only)
const rejectSeatRequest = async (req, res, next) => {
  try {
    const { responseMessage } = req.body;
    const request = await RideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Seat request not found.',
      });
    }

    if (request.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the driver can reject requests for this ride.',
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request cannot be rejected because it is already ${request.status}.`,
      });
    }

    request.status = 'rejected';
    request.responseMessage = responseMessage ? responseMessage.trim() : 'Driver could not accommodate this request.';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Request has been rejected.',
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel seat request (by Passenger)
// @route   PATCH /api/requests/:id/cancel
// @access  Private (Passenger only)
const cancelSeatRequest = async (req, res, next) => {
  try {
    const request = await RideRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found.',
      });
    }

    if (request.passenger.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own seat requests.',
      });
    }

    if (request.status === 'cancelled' || request.status === 'rejected') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${request.status}.`,
      });
    }

    // If it was already accepted, restore the seats to the ride!
    if (request.status === 'accepted') {
      await Ride.findByIdAndUpdate(request.ride, {
        $inc: { availableSeats: request.seatsRequested },
        $set: { status: 'active' }, // reopen ride if it was full
      });
      // Decrement passenger joined stats
      await User.findByIdAndUpdate(request.passenger, { $inc: { ridesJoined: -1 } });
    }

    request.status = 'cancelled';
    request.responseMessage = 'Request cancelled by passenger.';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Seat request cancelled successfully.',
      request,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests made by current student (My Requests)
// @route   GET /api/requests/my-requests
// @access  Private (Passenger)
const getMyRequests = async (req, res, next) => {
  try {
    const requests = await RideRequest.find({ passenger: req.user._id })
      .populate({
        path: 'ride',
        populate: {
          path: 'driver',
          select: 'name email phone rating vehicleInfo',
        },
      })
      .populate('driver', 'name email phone rating vehicleInfo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all requests received for rides hosted by current student (Received Requests)
// @route   GET /api/requests/received
// @access  Private (Driver)
const getReceivedRequests = async (req, res, next) => {
  try {
    const filter = { driver: req.user._id };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.rideId) {
      filter.ride = req.query.rideId;
    }

    const requests = await RideRequest.find(filter)
      .populate('passenger', 'name email studentId department phone rating')
      .populate('ride', 'source destination date time availableSeats pricePerSeat status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendSeatRequest,
  acceptSeatRequest,
  rejectSeatRequest,
  cancelSeatRequest,
  getMyRequests,
  getReceivedRequests,
};

