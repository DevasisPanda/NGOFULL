import { jsPDF } from "jspdf";
import axios from "axios";
import { sendWhatsAppMedia } from "./whatsapp";
import { sendDonationReceiptEmail } from "./email";

const TEMPLATE_URL =
  "https://res.cloudinary.com/dxmovdiru/image/upload/v1781611665/ngo-management/templates/donation_receipt_template.jpg";
const IMG_W = 905;
const IMG_H = 1280;

interface FieldSpec {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  weight: "normal" | "bold";
  align: "left" | "center" | "right";
}

const FIELDS: FieldSpec[] = [
  { id: "receiptNumber", x: 208, y: 224, size: 18, color: "#1e293b", weight: "bold", align: "left" },
  { id: "date", x: 706, y: 224, size: 18, color: "#1e293b", weight: "bold", align: "right" },
  { id: "donorName", x: 217, y: 384, size: 22, color: "#1e293b", weight: "bold", align: "left" },
  { id: "amount", x: 217, y: 563, size: 24, color: "#115e59", weight: "bold", align: "left" },
  { id: "purpose", x: 217, y: 723, size: 20, color: "#1e293b", weight: "bold", align: "left" },
  { id: "paymentMethod", x: 217, y: 795, size: 18, color: "#1e293b", weight: "bold", align: "left" },
  { id: "transactionId", x: 217, y: 865, size: 18, color: "#1e293b", weight: "bold", align: "left" },
];

export async function generateReceiptPDF(fieldValues: Record<string, string>): Promise<Buffer> {
  const imgResp = await axios.get(TEMPLATE_URL, { responseType: "arraybuffer" });
  const imgBase64 = Buffer.from(imgResp.data).toString("base64");

  const PAGE_W = 210;
  const scale = PAGE_W / IMG_W;
  const PAGE_H = IMG_H * scale;

  const pdf = new jsPDF("p", "mm", [PAGE_W, PAGE_H]);
  pdf.addImage(`data:image/jpeg;base64,${imgBase64}`, "JPEG", 0, 0, PAGE_W, PAGE_H);

  for (const f of FIELDS) {
    const val = fieldValues[f.id];
    if (!val) continue;

    const xMm = f.x * scale;
    const yMm = f.y * scale;
    const fontSize = Math.round((f.size * scale) / 0.3528);

    pdf.setFontSize(fontSize);
    pdf.setTextColor(f.color);
    pdf.setFont("helvetica", f.weight === "bold" ? "bold" : "normal");
    pdf.text(val, xMm, yMm, { align: f.align, baseline: "top" });
  }

  return Buffer.from(pdf.output("arraybuffer"));
}

export interface DonationReceiptData {
  donationId: number;
  receiptNumber: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: string;
  purpose: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: Date | string;
}

export function buildReceiptFieldValues(data: DonationReceiptData): Record<string, string> {
  const date = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-GB")
    : new Date().toLocaleDateString("en-GB");

  return {
    receiptNumber: data.receiptNumber || "N/A",
    date,
    donorName: data.donorName || "Anonymous Donor",
    amount: `₹${parseFloat(data.amount).toFixed(2)}`,
    purpose: data.purpose || "General Donation",
    paymentMethod: (data.paymentMethod || "ONLINE").toUpperCase(),
    transactionId: data.transactionId || data.receiptNumber,
  };
}

export async function deliverReceiptViaWhatsApp(
  data: DonationReceiptData,
  pdfUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!data.donorPhone || data.donorPhone.length < 10) {
    console.log(`[Receipt] Skipping WhatsApp: no valid phone for donation ${data.receiptNumber}`);
    return { success: false, error: "no_phone" };
  }

  const caption =
    `*Valmiki Samaj Charitable Trust*\n` +
    `*OFFICIAL DONATION RECEIPT*\n\n` +
    `Dear *${data.donorName || "Donor"}*,\n` +
    `Thank you for your generous contribution of *₹${parseFloat(data.amount).toFixed(2)}* to Valmiki Samaj Charitable Trust!\n\n` +
    `📄 *Receipt No*: ${data.receiptNumber}\n` +
    `💳 *Payment ID*: ${data.transactionId || "N/A"}\n` +
    `💰 *Amount*: ₹${parseFloat(data.amount).toFixed(2)}\n` +
    `📌 *Purpose*: ${data.purpose || "General Donation"}\n` +
    `📅 *Date*: ${new Date(data.createdAt).toLocaleDateString("en-GB")}\n` +
    `🏛 *80G Tax Exemption URN*: AADTV2345L25AD01\n\n` +
    `Your official donation receipt is attached below.`;

  try {
    return await sendWhatsAppMedia(
      data.donorPhone,
      caption,
      pdfUrl,
      `Donation_Receipt_${data.receiptNumber}.pdf`
    );
  } catch (err: any) {
    console.error(`[Receipt] WhatsApp delivery failed:`, err.message);
    return { success: false, error: err.message };
  }
}

export async function deliverReceiptViaEmail(
  data: DonationReceiptData,
  pdfUrl: string
): Promise<{ success: boolean; error?: string }> {
  if (!data.donorEmail || !data.donorEmail.includes("@")) {
    console.log(`[Receipt] Skipping Email: no valid email for donation ${data.receiptNumber}`);
    return { success: false, error: "no_email" };
  }

  try {
    return await sendDonationReceiptEmail(data, pdfUrl);
  } catch (err: any) {
    console.error(`[Receipt] Email delivery failed:`, err.message);
    return { success: false, error: err.message };
  }
}
