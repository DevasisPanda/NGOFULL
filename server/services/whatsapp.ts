import axios from 'axios';

/**
 * WhatsApp Messaging Service via AllExpert REST API
 */

export const sendWhatsAppMessage = async (phone: string, subject: string, text: string) => {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '6a427de1437f3';
  const instanceId = process.env.WHATSAPP_INSTANCE_ID || '609ACF283XXXX';

  const formattedMessage = `*${subject}*\n\n${text}\n\n_This is an automated message from Valmiki Samaj Charitable Trust._`;

  // Format phone number to clean digits (no +, spaces or dashes)
  let cleanNumber = phone.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = '91' + cleanNumber;
  }

  // If credentials are in mock mode (using default placeholder / config not customized)
  // we can still trigger the real API if they have set custom ones, or log it cleanly
  if (instanceId === '609ACF283XXXX') {
    console.log("=========================================");
    console.log(`[WhatsApp Mock] Sending message to: ${cleanNumber}`);
    console.log(`[WhatsApp Mock] Payload:\n${formattedMessage}`);
    console.log("=========================================");
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, mock: true };
  }

  try {
    console.log(`[WhatsApp API] Dispatching message to ${cleanNumber}...`);
    const response = await axios.post('https://button.allexpert.in/api/send', null, {
      params: {
        number: cleanNumber,
        type: "text",
        message: formattedMessage,
        instance_id: instanceId,
        access_token: accessToken
      }
    });

    console.log(`[WhatsApp API] Response:`, response.data);
    
    // Check if response contains limit messages (even if status is 200/success)
    const responseData = response.data;
    if (responseData && typeof responseData === 'object') {
      const msg = responseData.message || '';
      if (msg.toLowerCase().includes('limit') || msg.toLowerCase().includes('exceeded')) {
        console.warn(`[WhatsApp API] WARNING: Message to ${cleanNumber} accepted by endpoint but not delivered: ${msg}`);
        return { success: false, error: 'limit_exceeded', data: responseData };
      }
      if (responseData.status === 'error') {
        console.error(`[WhatsApp API] Error status returned for ${cleanNumber}:`, responseData.message);
        return { success: false, error: 'api_error', data: responseData };
      }
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`[WhatsApp API] Error sending message to ${cleanNumber}:`, error.response?.data || error.message);
    throw error;
  }
};
