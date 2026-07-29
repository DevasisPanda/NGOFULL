import "dotenv/config";

/**
 * WhatsApp Live API Test Script
 * Usage: node scripts/test_whatsapp.js [phone] [message]
 */

async function testWhatsAppMessage() {
  const instanceId = (process.env.WHATSAPP_INSTANCE_ID || '6A535D73DAE85').trim().replace(/^["']|["']$/g, "");
  const accessToken = (process.env.WHATSAPP_ACCESS_TOKEN || '6a427de1437f3').trim().replace(/^["']|["']$/g, "");
  const number = process.argv[2] || '917077906817';
  const text = process.argv[3] || 'Hi from NGO Management System';
  const subject = 'Live System Test';

  const formattedMessage = `*${subject}*\n\n${text}\n\n_This is an automated message from Valmiki Samaj Charitable Trust._`;

  console.log('====================================================');
  console.log('         WhatsApp API Test Dispatcher');
  console.log('====================================================');
  console.log('Recipient Number :', number);
  console.log('Instance ID      :', instanceId);
  console.log('Access Token     :', accessToken);
  console.log('Message Payload  :\n', formattedMessage);
  console.log('----------------------------------------------------');

  const url = `https://button.allexpert.in/api/send?number=${number}&type=text&message=${encodeURIComponent(formattedMessage)}&instance_id=${instanceId}&access_token=${accessToken}`;

  try {
    console.log('Sending request to https://button.allexpert.in/api/send ...');
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        number: number,
        type: 'text',
        message: formattedMessage,
        instance_id: instanceId,
        access_token: accessToken,
      })
    });

    const data = await res.json();
    console.log('\nHTTP Response Status :', res.status);
    console.log('API Response Body   :\n', JSON.stringify(data, null, 2));

    if (data && data.status === 'success') {
      console.log('\n✅ SUCCESS: WhatsApp message dispatched successfully!');
    } else {
      console.log('\n❌ ERROR: WhatsApp dispatch returned non-success status.');
    }
  } catch (err) {
    console.error('\n❌ CRITICAL ERROR:', err.message);
  }
}

testWhatsAppMessage();
