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
        from: 'Valmiki Samaj Trust <no-reply@valmikisamajcharitabletrust.org>',
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

export const sendDonationReceiptEmail = async (
  data: {
    receiptNumber: string;
    donorName: string;
    donorEmail: string;
    amount: string;
    purpose: string;
    transactionId: string;
    createdAt: Date | string;
    donorPhone?: string;
  },
  pdfUrl: string
) => {
  if (!data.donorEmail || !data.donorEmail.includes("@")) {
    console.log(`[Resend Email] Skipping: no valid donor email`);
    return { success: false, error: "no_email" };
  }

  const date = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-GB")
    : new Date().toLocaleDateString("en-GB");

  const subject = `Official Donation Receipt - Valmiki Samaj Charitable Trust (#${data.receiptNumber})`;

  const html = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff; color: #1e293b;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">Valmiki Samaj Charitable Trust</h2>
    <p style="color: #475569; margin: 4px 0 0; font-size: 14px;">Official Donation Receipt</p>
  </div>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />

  <p style="font-size: 16px; line-height: 24px;">Dear <strong>${data.donorName || "Donor"}</strong>,</p>
  <p style="font-size: 16px; line-height: 24px; margin-bottom: 16px;">
    Thank you for your generous contribution of <strong>₹${parseFloat(data.amount).toFixed(2)}</strong> to Valmiki Samaj Charitable Trust. Your support helps us continue our mission.
  </p>

  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px;">
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr><td style="padding: 6px 0; color: #64748b;"><b>Receipt No:</b></td><td style="padding: 6px 0; color: #1e293b;">${data.receiptNumber}</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b;"><b>Payment ID:</b></td><td style="padding: 6px 0; color: #1e293b;">${data.transactionId || "N/A"}</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b;"><b>Amount:</b></td><td style="padding: 6px 0; color: #115e59; font-weight: bold;">₹${parseFloat(data.amount).toFixed(2)}</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b;"><b>Purpose:</b></td><td style="padding: 6px 0; color: #1e293b;">${data.purpose || "General Donation"}</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b;"><b>Date:</b></td><td style="padding: 6px 0; color: #1e293b;">${date}</td></tr>
      <tr><td style="padding: 6px 0; color: #64748b;"><b>80G URN:</b></td><td style="padding: 6px 0; color: #1e293b;">AADTV2345L25AD01</td></tr>
    </table>
  </div>

  <p style="font-size: 14px; line-height: 20px; color: #475569; margin-bottom: 16px;">
    Your official donation receipt is attached to this email. Donations to Valmiki Samaj Charitable Trust are eligible for tax exemption under Section 80G of the Income Tax Act.
  </p>

  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
  <p style="font-size: 12px; line-height: 16px; color: #94a3b8; text-align: center; margin: 0;">This is an automated email from Valmiki Samaj Charitable Trust. Please do not reply directly to this message.</p>
</div>
  `;

  if (!resendApiKey) {
    console.log("\n========================================================");
    console.log("               [MOCK EMAIL SERVICE]                     ");
    console.log("========================================================");
    console.log(`Sending donation receipt to: ${data.donorEmail}`);
    console.log(`Receipt: ${data.receiptNumber} | Amount: ₹${data.amount}`);
    console.log(`Attachments: [${pdfUrl}]`);
    console.log("========================================================\n");
    return { success: true, mock: true };
  }

  try {
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Valmiki Samaj Trust <no-reply@valmikisamajcharitabletrust.org>",
        to: [data.donorEmail],
        subject,
        html,
        attachments: [
          {
            filename: `Donation_Receipt_${data.receiptNumber}.pdf`,
            path: pdfUrl,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`[Resend Email] Donation receipt sent. ID: ${response.data.id}`);
    return { success: true, id: response.data.id };
  } catch (error: any) {
    const errData = error.response?.data || error.message;
    console.error(`[Resend Email] Failed to send donation receipt to ${data.donorEmail}:`, errData);
    throw new Error(`Email delivery failed: ${JSON.stringify(errData)}`);
  }
};
