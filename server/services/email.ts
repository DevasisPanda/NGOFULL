import axios from 'axios';

const resendApiKey = process.env.RESEND_API_KEY;

/**
 * Sends a password reset email using Resend.com
 * If RESEND_API_KEY is not defined, it falls back to a console-logged Mock service.
 */
export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  const subject = "Reset Your Password - Valmiki Samaj Charitable Trust";
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">Valmiki Samaj Charitable Trust</h2>
      </div>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 16px; line-height: 24px; margin-bottom: 16px;">Hello,</p>
      <p style="font-size: 16px; line-height: 24px; margin-bottom: 24px;">We received a request to reset the password for your account. Click the button below to choose a new password. This link is valid for 1 hour.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" style="background-color: #fed813; color: #061941; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block; font-size: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">Reset Password</a>
      </div>
      <p style="font-size: 14px; line-height: 20px; color: #64748b; margin-bottom: 8px;">If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="font-size: 14px; line-height: 20px; word-break: break-all; color: #2563eb; margin-bottom: 24px;">
        <a href="${resetLink}" style="color: #2563eb; text-decoration: underline;">${resetLink}</a>
      </p>
      <p style="font-size: 14px; line-height: 20px; color: #64748b; margin-bottom: 16px;">If you did not request a password reset, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 12px; line-height: 16px; color: #94a3b8; text-align: center; margin: 0;">This is an automated email. Please do not reply directly to this message.</p>
    </div>
  `;

  if (!resendApiKey) {
    console.log("\n========================================================");
    console.log("               [MOCK EMAIL SERVICE]                     ");
    console.log("========================================================");
    console.log(`Sending password reset email to: ${email}`);
    console.log(`Reset Link: ${resetLink}`);
    console.log("========================================================\n");
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, mock: true };
  }

  try {
    const response = await axios.post(
      'https://api.resend.com/emails',
      {
        from: 'Valmiki Samaj Trust <onboarding@resend.dev>',
        to: email,
        subject: subject,
        html: htmlContent,
      },
      {
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`[Resend Email] Password reset email sent. ID: ${response.data.id}`);
    return { success: true, id: response.data.id };
  } catch (error: any) {
    const errData = error.response?.data || error.message;
    console.error(`[Resend Email] Failed to send email to ${email}:`, errData);
    throw new Error(`Email delivery failed: ${JSON.stringify(errData)}`);
  }
};
