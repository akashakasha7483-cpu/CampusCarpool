const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'College email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    studentId: {
      type: String,
      required: [true, 'Student ID / Roll number is required'],
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      default: 'Information Technology',
      trim: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
    vehicleInfo: {
      vehicleType: {
        type: String,
        enum: ['None', 'Bike', 'Car', 'Scooter'],
        default: 'None',
      },
      model: {
        type: String,
        default: '',
      },
      registrationNumber: {
        type: String,
        default: '',
      },
    },
    bio: {
      type: String,
      default: 'College commuter looking for convenient carpooling!',
      maxlength: 250,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 1,
      max: 5,
    },
    ridesHosted: {
      type: Number,
      default: 0,
    },
    ridesJoined: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Method to return safe student profile object (strip password)
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);

