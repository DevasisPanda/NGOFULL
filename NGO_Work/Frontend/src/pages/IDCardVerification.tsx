import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { ShieldCheck, XCircle, CreditCard, Calendar, Printer, ArrowLeft } from 'lucide-react';

import { Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import generateIdTemplate from '../assets/generate Id .jpeg';
const LocalButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
  <button className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors cursor-pointer ${className}`} {...props}>
    {children}
  </button>
);

const IDCardVerification: React.FC = () => {
  const { code } = useParams<{ code: string }>();

  // Query verification endpoint
  const { data: verResult, isLoading, error } = trpc.document.verifyIDCard.useQuery(
    { qrCode: code || "" },
    { enabled: !!code }
  );

  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`IDCard_${verResult?.card?.cardNumber || 'Download'}.pdf`);
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
          <div className="w-16 h-16 border-4 border-t-teal-500 border-r-slate-200 border-b-slate-200 border-l-slate-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Verifying ID Card Authenticity...</p>
        </div>
      </div>
    );
  }

  if (error || !verResult) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h1>
          <p className="text-slate-500 mb-6">Could not fetch verification data. The ID Card link might be invalid or broken.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const { valid, card, member } = verResult;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      {/* Verification Status Badge */}
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
        
        {/* Banner */}
        <div className={`p-8 text-center text-white flex flex-col items-center justify-center gap-3 ${
          valid ? 'bg-gradient-to-r from-teal-600 to-teal-800' : 'bg-gradient-to-r from-rose-600 to-red-700'
        }`}>
          {valid ? (
            <ShieldCheck className="w-16 h-16 text-teal-100 drop-shadow animate-pulse" />
          ) : (
            <XCircle className="w-16 h-16 text-rose-100 drop-shadow" />
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase">
              {valid ? 'VALID ID CARD' : 'INVALID / REVOKED ID'}
            </h1>
            <p className="text-sm opacity-90 mt-1 font-mono tracking-wider">
              {card?.cardNumber}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          
          {/* ID Card Member Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow bg-slate-50 shrink-0">
              {member?.profileImage ? (
                <img src={member.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-teal-800 text-3xl font-bold bg-teal-100">
                  {member?.name?.slice(0, 2).toUpperCase() || 'MB'}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                Registered Trust Member
              </span>
              <h2 className="text-2xl font-bold text-slate-900">{member?.name || 'Trust Member'}</h2>
              <p className="text-teal-700 font-semibold text-sm capitalize">
                {member?.designation || 'Active Member'}
              </p>
              {member?.membershipNumber && (
                <p className="text-slate-400 text-xs font-mono">Reg No: {member.membershipNumber}</p>
              )}
            </div>
          </div>

          {/* ID Card Graphic Overlay View */}
          {valid && (
            <div className="flex flex-col items-center gap-3">
              <h3 className="w-full font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-teal-600" /> Digital Identity Card
              </h3>
              <div 
                ref={cardRef}
                className="relative w-full aspect-[1.5/1] rounded-lg overflow-hidden border border-slate-200 shadow-md bg-white print:m-0 print:border-none print:shadow-none"
                style={{ fontFamily: "'Arial', sans-serif" }}
              >
                {/* Background Template */}
                <img src={generateIdTemplate} alt="ID Card Template" className="w-full h-full object-contain" crossOrigin="anonymous" />
                
                {/* Profile Photo Overlay (Left Half, Center-Left) */}
                <div className="absolute top-[41.5%] left-[23%] -translate-x-1/2 w-[16%] aspect-[1/1] rounded-xl overflow-hidden shadow-sm bg-white border border-gray-100 flex items-center justify-center">
                  {member?.profileImage ? (
                    <img src={member.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-teal-800 text-3xl font-bold bg-teal-50">
                      {member?.name?.slice(0, 2).toUpperCase() || 'MB'}
                    </div>
                  )}
                </div>

                {/* Name Overlay (Over the photo) */}
                <div className="absolute top-[32%] left-[4.5%] w-[40%] text-center">
                  <h4 className="font-extrabold text-[12px] sm:text-[16px] text-red-600 uppercase tracking-wide line-clamp-1">
                    {member?.name}
                  </h4>
                </div>

                {/* Left Side Details */}
                {/* ID No */}
                <div className="absolute top-[62.5%] left-[28%]">
                  <span className="font-bold text-[10px] sm:text-[14px] text-slate-800">
                    {card?.cardNumber}
                  </span>
                </div>

                {/* Mobile No */}
                <div className="absolute top-[67%] left-[17%]">
                  <span className="font-bold text-[10px] sm:text-[14px] text-slate-800">
                    N/A
                  </span>
                </div>

                {/* Email */}
                <div className="absolute top-[71%] left-[17%]">
                  <span className="font-bold text-[10px] sm:text-[14px] text-slate-800 line-clamp-1 w-[150px]">
                    {member?.email || 'N/A'}
                  </span>
                </div>

                {/* City */}
                <div className="absolute top-[75%] left-[13%]">
                  <span className="font-bold text-[10px] sm:text-[14px] text-slate-800">
                    N/A
                  </span>
                </div>

                {/* Right Side Details */}
                {/* Joining Date */}
                <div className="absolute top-[79.5%] left-[78%]">
                  <span className="font-bold text-[11px] sm:text-[15px] text-[#0f2454]">
                    {card?.issueDate ? new Date(card.issueDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : ""}
                  </span>
                </div>

                {/* Validity Date */}
                <div className="absolute top-[84%] left-[78%]">
                  <span className="font-bold text-[11px] sm:text-[15px] text-[#0f2454]">
                    {card?.expiryDate ? new Date(card.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-') : "Lifetime"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Card Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-600" /> ID Card Specifications
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Card Number</p>
                <p className="text-slate-800 font-semibold text-base mt-0.5">{card?.cardNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize mt-1 ${
                  valid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {valid ? 'Active' : card?.status || 'Inactive'}
                </span>
              </div>
              <div className="border-t border-slate-200/60 pt-3 mt-1 sm:col-span-2"></div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Date of Issue
                </p>
                <p className="text-slate-800 font-semibold mt-0.5">
                  {card?.issueDate ? new Date(card.issueDate).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Expiry Date
                </p>
                <p className="text-slate-800 font-semibold mt-0.5">
                  {card?.expiryDate ? new Date(card.expiryDate).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'No Expiry'}
                </p>
              </div>
            </div>
          </div>

          {/* Legal Notice Footer */}
          <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-xl text-center">
            <p className="text-[11px] text-teal-800/80 leading-relaxed">
              This card is a digital property of <strong>Valmiki Samaj Charitable Trust</strong>. 
              The holder whose name is listed is authorized to represent the Trust under their official designation.
            </p>
          </div>

          {/* Print/Actions bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-6 border-t border-slate-100 print:hidden">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to NGO Website
            </Link>
            <Button onClick={handlePrint} variant="outline" className="font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button onClick={downloadPDF} disabled={isDownloading} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" /> {isDownloading ? "Generating PDF..." : "Download as PDF"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default IDCardVerification;
