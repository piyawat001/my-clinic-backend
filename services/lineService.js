const line = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
};

const client = new line.Client(config);

class LineService {
  // ฟังก์ชันส่งข้อความตอบกลับ
  static async replyMessage(replyToken, message) {
    try {
      await client.replyMessage(replyToken, message);
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // เพิ่ม methods อื่นๆ ตามที่ต้องการ...
}

module.exports = LineService;