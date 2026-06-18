import twilio from 'twilio';

/**
 * WhatsApp Messaging Service via Twilio API
 */

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER; // e.g. "whatsapp:+14155238886"

let client: twilio.Twilio | null = null;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
    console.log("[Twilio] Client initialized successfully.");
  } catch (error) {
    console.error("[Twilio] Failed to initialize client:", error);
  }
} else {
  console.log("[Twilio] Credentials missing. Running in MOCK mode.");
}

export const sendWhatsAppMessage = async (phone: string, subject: string, text: string) => {
  const formattedMessage = `*${subject}*\n\n${text}\n\n_This is an automated message from your NGO Admin._`;

  if (!client || !twilioWhatsAppNumber) {
    // Fallback to Mock service when keys aren't provided
    console.log("=========================================");
    console.log(`[WhatsApp Mock] Sending message to: ${phone}`);
    console.log(`[WhatsApp Mock] Payload:\n${formattedMessage}`);
    console.log("=========================================");
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, mock: true };
  }

  // Format phone number to E.164 with whatsapp: prefix if needed
  // Ensure it starts with a plus, e.g., '+919876543210'
  let cleanPhone = phone.trim();
  if (cleanPhone.startsWith('whatsapp:')) {
    cleanPhone = cleanPhone.replace('whatsapp:', '');
  }
  if (!cleanPhone.startsWith('+')) {
    cleanPhone = '+' + cleanPhone;
  }
  const to = `whatsapp:${cleanPhone}`;

  try {
    const message = await client.messages.create({
      body: formattedMessage,
      from: twilioWhatsAppNumber,
      to: to
    });
    console.log(`[Twilio WhatsApp] Message sent to ${to}. SID: ${message.sid}`);
    return { success: true, sid: message.sid };
  } catch (error) {
    console.error(`[Twilio WhatsApp] Error sending message to ${to}:`, error);
    throw error;
  }
};
