// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  lineUserId: {
    type: String,
    unique: true
  },
  displayName: String,
  pictureUrl: String,
  firstName: String,
  lastName: String,
  phone: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);