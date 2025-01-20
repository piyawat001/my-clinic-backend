// controllers/lineController.js
const LineService = require('../services/lineService');
const User = require('../models/User');
const Booking = require('../models/Booking');

class LineController {
  async handleWebhook(req, res) {
    try {
      const events = req.body.events;
      console.log('Received events:', events);

      if (!events || !Array.isArray(events)) {
        return res.status(200).json({ message: 'No events to process' });
      }

      await Promise.all(events.map(event => this.handleEvent(event)));
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Error in webhook handler:', err);
      res.status(500).json({ error: err.message });
    }
  }

  async handleEvent(event) {
    console.log('Processing event:', event);
    try {
      switch (event.type) {
        case 'follow':
          return this.handleFollowEvent(event);
        case 'unfollow':
          return this.handleUnfollowEvent(event);
        case 'message':
          return this.handleMessageEvent(event);
        default:
          console.log(`Unhandled event type: ${event.type}`);
          return null;
      }
    } catch (err) {
      console.error('Error handling event:', err);
      return null;
    }
  }

  async handleFollowEvent(event) {
    try {
      const userProfile = await LineService.getUserProfile(event.source.userId);
      console.log('User profile:', userProfile);
      
      const user = await User.findOneAndUpdate(
        { lineUserId: event.source.userId },
        {
          lineUserId: event.source.userId,
          displayName: userProfile.displayName,
          pictureUrl: userProfile.pictureUrl,
          status: 'active'
        },
        { upsert: true, new: true }
      );

      const welcomeMessage = {
        type: 'text',
        text: `ยินดีต้อนรับคุณ ${userProfile.displayName} สู่คลินิกนายแพทย์สุทธิลักษณ์\nต้องการจองคิวหรือสอบถามข้อมูลเพิ่มเติมสามารถเลือกเมนูด้านล่างได้เลยครับ`,
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'จองคิว',
                text: 'จองคิว'
              }
            },
            {
              type: 'action',
              action: {
                type: 'message',
                label: 'ข้อมูลคลินิก',
                text: 'ข้อมูลคลินิก'
              }
            }
          ]
        }
      };

      await LineService.replyMessage(event.replyToken, welcomeMessage);
      return true;
    } catch (err) {
      console.error('Error handling follow event:', err);
      return null;
    }
  }

  async handleUnfollowEvent(event) {
    try {
      await User.findOneAndUpdate(
        { lineUserId: event.source.userId },
        { status: 'inactive' }
      );
      return true;
    } catch (err) {
      console.error('Error handling unfollow event:', err);
      return null;
    }
  }

  async handleMessageEvent(event) {
    if (event.message.type !== 'text') {
      return null;
    }

    try {
      const userId = event.source.userId;
      const messageText = event.message.text.toLowerCase().trim();
      
      let user = await User.findOne({ lineUserId: userId });
      
      if (!user) {
        const userProfile = await LineService.getUserProfile(userId);
        user = await User.create({
          lineUserId: userId,
          displayName: userProfile.displayName,
          pictureUrl: userProfile.pictureUrl,
          status: 'active'
        });
      }

      switch (messageText) {
        case 'จองคิว':
        case 'นัดหมาย':
          return this.handleBookingRequest(event, user);
        
        case 'ประวัติการจอง':
        case 'เช็คการจอง':
          return this.handleBookingHistory(event, user);
        
        case 'ข้อมูลคลินิก':
        case 'เวลาทำการ':
          return this.handleClinicInfo(event);
        
        case 'เมนู':
        case 'menu':
          return this.sendMainMenu(event);
        
        default:
          return this.sendMainMenu(event);
      }
    } catch (err) {
      console.error('Error handling message event:', err);
      return null;
    }
  }

  async handleBookingRequest(event, user) {
    const bookingUrl = `${process.env.FRONTEND_URL}/booking?userId=${user._id}`;
    const message = {
      type: 'text',
      text: 'กรุณาคลิกที่ปุ่มด้านล่างเพื่อทำการจองคิว',
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'uri',
              label: 'จองคิว',
              uri: bookingUrl
            }
          }
        ]
      }
    };
    return LineService.replyMessage(event.replyToken, message);
  }

  async handleBookingHistory(event, user) {
    try {
      const bookings = await Booking.find({ userId: user._id })
        .sort({ bookingDate: -1 })
        .limit(5);

      if (bookings.length === 0) {
        return LineService.replyMessage(event.replyToken, {
          type: 'text',
          text: 'คุณยังไม่มีประวัติการจอง'
        });
      }

      const bookingList = bookings.map(booking => 
        `วันที่: ${new Date(booking.bookingDate).toLocaleDateString('th-TH')}\n` +
        `เวลา: ${booking.bookingTime}\n` +
        `สถานะ: ${booking.status}`
      ).join('\n\n');

      return LineService.replyMessage(event.replyToken, {
        type: 'text',
        text: `ประวัติการจองล่าสุด:\n\n${bookingList}`
      });
    } catch (err) {
      console.error('Error fetching booking history:', err);
      return null;
    }
  }

  async handleClinicInfo(event) {
    const message = {
      type: 'text',
      text: 'คลินิกนายแพทย์สุทธิลักษณ์\n\n' +
            'เวลาทำการ:\n' +
            'จันทร์-ศุกร์: 16:00-21:00 น.\n\n' +
            'ที่อยู่:\n' +
            'ต.ปะโค จ.หนองคาย\n\n' +
            'โทร: xxx-xxx-xxxx',
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'message',
              label: 'จองคิว',
              text: 'จองคิว'
            }
          }
        ]
      }
    };
    return LineService.replyMessage(event.replyToken, message);
  }

  async sendMainMenu(event) {
    const message = {
      type: 'text',
      text: 'กรุณาเลือกเมนูที่ต้องการ:',
      quickReply: {
        items: [
          {
            type: 'action',
            action: {
              type: 'message',
              label: 'จองคิว',
              text: 'จองคิว'
            }
          },
          {
            type: 'action',
            action: {
              type: 'message',
              label: 'ประวัติการจอง',
              text: 'ประวัติการจอง'
            }
          },
          {
            type: 'action',
            action: {
              type: 'message',
              label: 'ข้อมูลคลินิก',
              text: 'ข้อมูลคลินิก'
            }
          }
        ]
      }
    };
    return LineService.replyMessage(event.replyToken, message);
  }

  // API Endpoints
  async createBooking(req, res) {
    const booking = new Booking({
      userId: req.user._id,
      ...req.body
    });
    
    try {
      const newBooking = await booking.save();
      
      await LineService.pushMessage(req.user.lineUserId, {
        type: 'text',
        text: `การจองของคุณได้รับการยืนยันแล้ว\n` +
              `วันที่: ${new Date(booking.bookingDate).toLocaleDateString('th-TH')}\n` +
              `เวลา: ${booking.bookingTime}\n\n` +
              `กรุณามาก่อนเวลานัดหมาย 15 นาที`
      });
      
      res.status(201).json(newBooking);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async getUserProfile(req, res) {
    res.json(req.user);
  }
}

// สร้าง instance และ export
const lineController = new LineController();
module.exports = lineController;