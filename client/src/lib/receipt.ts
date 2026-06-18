import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface ReceiptData {
  receiptNumber: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  donationType: string;
  purpose?: string;
  date: Date;
  paymentStatus: string;
}

export async function generateDonationReceiptPDF(data: ReceiptData): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    let yPosition = margin;

    // Header
    pdf.setFontSize(20);
    pdf.setTextColor(25, 103, 210);
    pdf.text("DONATION RECEIPT", pageWidth / 2, yPosition, { align: "center" });

    yPosition += 15;

    // Receipt Details Box
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin, yPosition, contentWidth, 50);

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    // Receipt Number
    pdf.text("Receipt Number:", margin + 5, yPosition + 8);
    pdf.setFont("helvetica", "bold");
    pdf.text(data.receiptNumber, margin + 50, yPosition + 8);

    // Date
    pdf.setFont("helvetica", "normal");
    pdf.text("Date:", margin + 5, yPosition + 16);
    pdf.setFont("helvetica", "bold");
    pdf.text(data.date.toLocaleDateString(), margin + 50, yPosition + 16);

    // Status
    pdf.setFont("helvetica", "normal");
    pdf.text("Status:", margin + 5, yPosition + 24);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(
      data.paymentStatus === "completed" ? 34 : 234,
      data.paymentStatus === "completed" ? 197 : 179,
      data.paymentStatus === "completed" ? 94 : 8
    );
    pdf.text(data.paymentStatus.toUpperCase(), margin + 50, yPosition + 24);

    yPosition += 60;

    // Donor Information
    pdf.setTextColor(0, 0, 0);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Donor Information", margin, yPosition);

    yPosition += 8;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    pdf.text(`Name: ${data.donorName}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Email: ${data.donorEmail}`, margin + 5, yPosition);

    yPosition += 15;

    // Donation Details
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Donation Details", margin, yPosition);

    yPosition += 8;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    pdf.text(`Amount: ₹${data.amount.toFixed(2)}`, margin + 5, yPosition);
    yPosition += 7;
    pdf.text(`Type: ${data.donationType}`, margin + 5, yPosition);
    yPosition += 7;
    if (data.purpose) {
      pdf.text(`Purpose: ${data.purpose}`, margin + 5, yPosition);
      yPosition += 7;
    }

    yPosition += 15;

    // Tax Information
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(margin, yPosition, contentWidth, 30);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(25, 103, 210);
    pdf.text("Tax Information", margin + 5, yPosition + 8);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    pdf.text(
      "This donation is eligible for tax deduction under Section 80G of the Income Tax Act.",
      margin + 5,
      yPosition + 15,
      { maxWidth: contentWidth - 10 }
    );
    pdf.text("Our Registration Number: [NGO_REG_NUMBER]", margin + 5, yPosition + 22);

    yPosition += 40;

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Thank you for your generous donation!", pageWidth / 2, pageHeight - 15, { align: "center" });

    // Save PDF
    pdf.save(`Receipt_${data.receiptNumber}.pdf`);
  } catch (error) {
    console.error("Error generating PDF receipt:", error);
    throw error;
  }
}

export async function generateReceiptFromHTML(elementId: string, filename: string): Promise<void> {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id ${elementId} not found`);
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? "landscape" : "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(filename);
  } catch (error) {
    console.error("Error generating PDF from HTML:", error);
    throw error;
  }
}
