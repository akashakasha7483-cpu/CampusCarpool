const mongoose = require('mongoose');

const rideRequestSchema = new mongoose.Schema(
  {
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
      required: true,
    },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    seatsRequested: {
      type: Number,
      required: [true, 'Seats requested is required'],
      min: [1, 'Must request at least 1 seat'],
      default: 1,
    },
    pickupNote: {
      type: String,
      default: '',
      maxlength: 200,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
    },
    responseMessage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending or accepted requests by the same passenger for the same ride
rideRequestSchema.index({ ride: 1, passenger: 1 });

module.exports = mongoose.model('RideRequest', rideRequestSchema);

