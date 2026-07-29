import axios from 'axios';

/**
 * WhatsApp Messaging Service via AllExpert REST API
 */

export const sendWhatsAppMessage = async (phone: string, subject: string, text: string) => {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '6a427de1437f3';
  const instanceId = process.env.WHATSAPP_INSTANCE_ID || '6A535D73DAE85';

  const formattedMessage = `*${subject}*\n\n${text}\n\n_This is an automated message from Valmiki Samaj Charitable Trust._`;

  // Format phone number to clean digits (no +, spaces or dashes)
  let cleanNumber = phone.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = '91' + cleanNumber;
  }

  try {
    console.log(`[WhatsApp API] Dispatching live message to ${cleanNumber}...`);
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

/**
 * Send WhatsApp Media / File Attachment (PDF Receipts, Certificates, Images)
 */
export const sendWhatsAppMedia = async (phone: string, caption: string, mediaUrl: string, filename?: string) => {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '6a427de1437f3';
  const instanceId = process.env.WHATSAPP_INSTANCE_ID || '6A535D73DAE85';

  let cleanNumber = phone.replace(/\D/g, '');
  if (cleanNumber.length === 10) {
    cleanNumber = '91' + cleanNumber;
  }

  try {
    console.log(`[WhatsApp API] Dispatching media message to ${cleanNumber}...`);
    const params: any = {
      number: cleanNumber,
      type: "media",
      message: caption,
      media_url: mediaUrl,
      instance_id: instanceId,
      access_token: accessToken,
    };

    if (filename) {
      params.filename = filename;
    }

    const response = await axios.post('https://button.allexpert.in/api/send', null, { params });
    console.log(`[WhatsApp Media API] Response:`, response.data);

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error(`[WhatsApp Media API] Error sending media to ${cleanNumber}:`, error.response?.data || error.message);
    throw error;
  }
};
