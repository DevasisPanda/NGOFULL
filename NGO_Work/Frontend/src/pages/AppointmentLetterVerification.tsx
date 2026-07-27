import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { CheckCircle, XCircle, FileText, Printer, ArrowLeft, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { VerifiableDocument } from '../components/VerifiableDocument';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AppointmentLetterVerification: React.FC = () => {
  const { code } = useParams<{ code: string }>();

  // Query verification endpoint
  const { data: verResult, isLoading, error } = trpc.document.verifyAppointmentLetter.useQuery(
    { qrCode: code || "" },
    { enabled: !!code }
  );

  const { data: dbTemplates } = trpc.document.getTemplateConfigs.useQuery();

  const letterRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = async () => {
    if (!letterRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(letterRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AppointmentLetter_${verResult?.letter?.letterNumber || 'Download'}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-indigo-500 border-r-slate-200 border-b-slate-200 border-l-slate-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Verifying Appointment Letter...</p>
        </div>
      </div>
    );
  }

  if (error || !verResult || !verResult.valid) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h1>
          <p className="text-slate-500 mb-6">Could not fetch verification data. The appointment letter link might be invalid or broken.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const { letter } = verResult;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
        
        {/* Banner */}
        <div className="p-8 text-center text-white flex flex-col items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-700">
          <CheckCircle className="w-16 h-16 text-indigo-100 drop-shadow animate-pulse" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase">
              OFFICIALLY VERIFIED
            </h1>
            <p className="text-sm opacity-90 mt-1 font-mono tracking-wider">
              {letter?.letterNumber}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          
          <div className="flex flex-col items-center gap-3">
            <h3 className="w-full font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Digital Appointment Letter
            </h3>
            
            {/* The Dynamic Document View */}
            <div className="w-full flex justify-center bg-white p-2 border border-slate-100 rounded-2xl shadow-sm">
              <VerifiableDocument
                templateId="appointment"
                fieldValues={{
                  letterNumber: letter?.letterNumber || "",
                  name1: letter?.recipientName || "Valued Member",
                  name2: letter?.recipientName || "Valued Member",
                  post: letter?.position || "",
                  mobile: letter?.recipientPhone || "N/A",
                  fromDate: letter?.appointmentDate ? new Date(letter.appointmentDate).toLocaleDateString() : "",
                  toDate: "Ongoing"
                }}
                dbTemplates={dbTemplates}
                cardRef={letterRef}
                className="max-w-md w-full rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-100 print:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to NGO Website
            </Link>
            <Button onClick={handlePrint} variant="outline" className="font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button onClick={downloadPDF} disabled={isDownloading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" /> {isDownloading ? "Generating PDF..." : "Download as PDF"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppointmentLetterVerification;
