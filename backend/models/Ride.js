const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    source: {
      type: String,
      required: [true, 'Pickup / Departure point is required'],
      trim: true,
    },
    destination: {
      type: String,
      required: [true, 'Destination / Drop-off point is required'],
      trim: true,
    },
    sourceCoords: {
      type: [Number],
      required: false,
    },
    destinationCoords: {
      type: [Number],
      required: false,
    },
    waypoints: {
      type: [String],
      default: [],
    },
    waypointsCoords: {
      type: [[Number]],
      required: false,
      default: [],
    },
    date: {
      type: String,
      required: [true, 'Travel date is required (YYYY-MM-DD)'],
      trim: true,
    },
    time: {
      type: String,
      required: [true, 'Departure time is required (HH:MM)'],
      trim: true,
    },
    seatsTotal: {
      type: Number,
      required: [true, 'Total seats must be specified'],
      min: [1, 'At least 1 seat must be offered'],
      max: [8, 'Maximum 8 seats per ride'],
    },
    availableSeats: {
      type: Number,
      required: true,
      min: [0, 'Available seats cannot be negative'],
    },
    pricePerSeat: {
      type: Number,
      required: [true, 'Price per seat is required'],
      min: [0, 'Price cannot be negative'],
      default: 30,
    },
    vehicleType: {
      type: String,
      enum: ['Bike', 'Car', 'Scooter'],
      default: 'Car',
    },
    vehicleModel: {
      type: String,
      default: '',
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 300,
    },
    status: {
      type: String,
      enum: ['active', 'full', 'completed', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for searching
rideSchema.index({ source: 'text', destination: 'text' });
rideSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Ride', rideSchema);

