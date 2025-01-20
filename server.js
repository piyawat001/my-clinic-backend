const express = require('express');
const cors = require('cors');
const line = require('@line/bot-sdk');
require('dotenv').config();
const connectDB = require('./config/db');
const lineController = require('./controllers/lineController');

// Line Config
const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const app = express();

// Middleware
app.use(cors());

// Line Webhook route - ใช้ .bind() เพื่อผูก this context
app.post(
  '/line/webhook',
  express.raw({ type: 'application/json' }),
  line.middleware(lineConfig),
  lineController.handleWebhook.bind(lineController)
);

// Middleware สำหรับ routes อื่นๆ
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/line', require('./routes/lineRoutes'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});