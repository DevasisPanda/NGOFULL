import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { CheckCircle, XCircle, Award, Calendar, ShieldCheck, Printer, ArrowLeft } from 'lucide-react';
import { Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { VerifiableDocument } from '../components/VerifiableDocument';

const CertificateVerification: React.FC = () => {
  const { code } = useParams<{ code: string }>();

  // Query verification endpoint
  const { data: verResult, isLoading, error } = trpc.document.verifyCertificate.useQuery(
    { qrCode: code || "" },
    { enabled: !!code }
  );

  const { data: dbTemplates } = trpc.document.getTemplateConfigs.useQuery();

  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${verResult?.certificate?.certificateNumber || 'Download'}.pdf`);
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
          <div className="w-16 h-16 border-4 border-t-orange-500 border-r-slate-200 border-b-slate-200 border-l-slate-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Verifying Certificate Authenticity...</p>
        </div>
      </div>
    );
  }

  if (error || !verResult || !verResult.certificate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h1>
          <p className="text-slate-500 mb-6">Could not fetch verification data. The certificate link might be invalid or broken.</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-full font-bold hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const { valid, certificate, recipient } = verResult;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print:shadow-none print:border-none">
        
        {/* Banner */}
        <div className={`p-8 text-center text-white flex flex-col items-center justify-center gap-3 ${
          valid ? 'bg-gradient-to-r from-emerald-600 to-teal-700' : 'bg-gradient-to-r from-rose-600 to-red-700'
        }`}>
          {valid ? (
            <ShieldCheck className="w-16 h-16 text-emerald-100 drop-shadow animate-pulse" />
          ) : (
            <XCircle className="w-16 h-16 text-rose-100 drop-shadow" />
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-wide uppercase">
              {valid ? 'OFFICIALLY VERIFIED' : 'VERIFICATION WARNING'}
            </h1>
            <p className="text-sm opacity-90 mt-1 font-mono tracking-wider">
              {certificate?.certificateNumber}
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Certificate Holder Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 shadow bg-slate-50 shrink-0">
              {recipient?.profileImage ? (
                <img src={recipient.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-800 text-3xl font-bold bg-slate-200">
                  {recipient?.name?.slice(0, 2).toUpperCase() || 'MB'}
                </div>
              )}
            </div>
            <div className="text-center sm:text-left space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                Awarded Recipient
              </span>
              <h2 className="text-2xl font-bold text-slate-900">{recipient?.name || 'Valued Recipient'}</h2>
              <p className="text-slate-500 font-medium text-sm capitalize">
                {recipient?.designation || 'NGO Volunteer / Supporter'}
              </p>
              {recipient?.email && (
                <p className="text-slate-400 text-xs font-mono">{recipient.email}</p>
              )}
            </div>
          </div>

          {/* Certificate Graphic Overlay View */}
          {valid && (
            <div className="flex flex-col items-center gap-3">
              <h3 className="w-full font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-500" /> Digital Certificate Document
              </h3>
              
              <div className="w-full flex justify-center bg-white p-2 border border-slate-100 rounded-2xl shadow-sm">
                <VerifiableDocument
                  templateId={certificate?.certificateType || "membership"}
                  fieldValues={
                    certificate?.certificateType === 'achievement'
                      ? {
                          fullName: recipient?.name || "",
                          description: certificate?.description || "",
                          issueDate: certificate?.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : "",
                          certificateNumber: certificate?.certificateNumber || "",
                        }
                      : {
                          fullName: recipient?.name || "",
                          membershipNumber: certificate?.certificateNumber || "",
                          joinDate: certificate?.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : "",
                          expiryDate: certificate?.expiryDate ? new Date(certificate.expiryDate).toLocaleDateString() : "Lifetime",
                        }
                  }
                  dbTemplates={dbTemplates}
                  cardRef={certificateRef}
                  className="max-w-md w-full rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Certificate Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-500" /> Certificate Specifications
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Document Title</p>
                <p className="text-slate-800 font-semibold text-base mt-0.5">{certificate?.title}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Recognition Category</p>
                <p className="text-slate-800 font-semibold text-base capitalize mt-0.5">{certificate?.certificateType}</p>
              </div>
              <div className="border-t border-slate-200/60 pt-3 mt-1 sm:col-span-2"></div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Date of Issue
                </p>
                <p className="text-slate-800 font-semibold mt-0.5">
                  {certificate?.issueDate ? new Date(certificate.issueDate).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Expiration Date
                </p>
                <p className="text-slate-800 font-semibold mt-0.5">
                  {certificate?.expiryDate ? new Date(certificate.expiryDate).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'long', day: 'numeric'
                  }) : 'No Expiry (Lifetime Validity)'}
                </p>
              </div>
            </div>
          </div>

          {/* Legal Notice Footer */}
          <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl text-center">
            <p className="text-[11px] text-amber-800/80 leading-relaxed">
              This verification is provided directly from the live database of <strong>Valmiki Samaj Charitable Trust</strong>. 
              Any tampering or alteration of this document invalidates its authenticity.
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
            <Button onClick={downloadPDF} disabled={isDownloading} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-full flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" /> {isDownloading ? "Generating PDF..." : "Download as PDF"}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CertificateVerification;
