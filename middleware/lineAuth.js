const line = require('@line/bot-sdk');
const User = require('../models/User'); // เพิ่มการ import User model

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

// ลบ validateLineWebhook ออกเพราะใช้จาก server.js แล้ว
const authenticateLineUser = async (req, res, next) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(401).json({ message: 'กรุณาระบุ User ID' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  authenticateLineUser
};