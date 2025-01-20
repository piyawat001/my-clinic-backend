const express = require('express');
const router = express.Router();
const LineController = require('../controllers/lineController');
const { authenticateLineUser } = require('../middleware/lineAuth');

// ย้าย webhook route ไปไว้ที่ server.js แล้ว
router.get('/profile', authenticateLineUser, LineController.getUserProfile);
router.post('/bookings', authenticateLineUser, LineController.createBooking);

module.exports = router;