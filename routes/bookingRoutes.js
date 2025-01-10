const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  updateBookingStatus,
  deleteBooking
} = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/user/:userId', getUserBookings);
router.patch('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);  

module.exports = router;