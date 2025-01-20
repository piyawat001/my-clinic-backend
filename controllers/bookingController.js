//my-clinic-backend/controllers/bookingController.js
const Booking = require('../models/Booking');

// Create booking
const createBooking = async (req, res) => {
  try {
    const { userId, bookingDate, bookingTime } = req.body;
    const booking = new Booking({
      userId,
      bookingDate,
      bookingTime
    });
    
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'ไม่พบการจอง' });
    }
    
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteBooking = async (req, res) => {
    try {
      const booking = await Booking.findByIdAndDelete(req.params.id);
      
      if (!booking) {
        return res.status(404).json({ message: 'ไม่พบการจอง' });
      }
  
      res.json({ message: 'ลบการจองเรียบร้อย' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  module.exports = {
    createBooking,
    getUserBookings,
    updateBookingStatus,
    deleteBooking  // เพิ่ม export
  };