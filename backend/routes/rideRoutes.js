const express = require('express');
const router = express.Router();
const {
  postRide,
  searchRides,
  getAllActiveRides,
  getRideById,
  getMyRides,
  cancelRide,
} = require('../controllers/rideController');
const { protect } = require('../middleware/authMiddleware');

// Optional auth helper: if token provided, sets req.user, else continues
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', protect, postRide);
router.get('/search', optionalAuth, searchRides);
router.get('/my-rides', protect, getMyRides);
router.get('/', getAllActiveRides);
router.get('/:id', optionalAuth, getRideById);
router.patch('/:id/cancel', protect, cancelRide);

module.exports = router;

