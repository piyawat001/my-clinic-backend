// line-signature-test.js
const crypto = require('crypto');

// Channel Secret ของคุณ
const channelSecret = '36c8355ce24324?ca8c471c96d1d30ab';

// Request body ที่จะใช้ทดสอบ (ต้องใช้แบบเดียวกันใน Postman)
const body = {
  "destination": "xxxxxxxxxx",
  "events": [
    {
      "type": "message",
      "message": {
        "type": "text",
        "id": "14353798921116",
        "text": "สวัสดี"
      },
      "timestamp": 1625665242211,
      "source": {
        "type": "user",
        "userId": "U80696558e1aa831..."
      },
      "replyToken": "757913772c4646b784d4b7ce46d12671",
      "mode": "active"
    }
  ]
};

// แปลง body เป็น string (ต้องใช้แบบเดียวกันใน Postman)
const stringBody = JSON.stringify(body);

// สร้าง signature
const signature = crypto
  .createHmac('SHA256', channelSecret)
  .update(stringBody)
  .digest('base64');

console.log('\n=== ข้อมูลสำหรับ Postman ===\n');
console.log('1. Headers:');
console.log('Content-Type: application/json');
console.log(`x-line-signature: ${signature}`);
console.log('\n2. Body (raw JSON):');
console.log(stringBody);

// เพิ่มการตรวจสอบ
console.log('\n=== ตรวจสอบ ===');
console.log('Channel Secret:', channelSecret);
console.log('Body Length:', stringBody.length);
console.log('Signature Length:', signature.length);