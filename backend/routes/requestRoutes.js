const express = require('express');
const router = express.Router();
const {
  sendSeatRequest,
  acceptSeatRequest,
  rejectSeatRequest,
  cancelSeatRequest,
  getMyRequests,
  getReceivedRequests,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

// All request routes require student authentication
router.use(protect);

router.post('/', sendSeatRequest);
router.get('/my-requests', getMyRequests);
router.get('/received', getReceivedRequests);
router.patch('/:id/accept', acceptSeatRequest);
router.patch('/:id/reject', rejectSeatRequest);
router.patch('/:id/cancel', cancelSeatRequest);

module.exports = router;

