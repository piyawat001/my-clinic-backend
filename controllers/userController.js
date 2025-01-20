//my-clinic-backend/controllers/userController.js
const User = require('../models/User');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create or update user
const createUpdateUser = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    
    const user = await User.findOneAndUpdate(
      { phone },
      { firstName, lastName },
      { new: true, upsert: true }
    );
    
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getUserProfile,
  createUpdateUser
};