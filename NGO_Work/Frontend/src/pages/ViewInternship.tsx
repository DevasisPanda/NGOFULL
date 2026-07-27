import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

const ViewInternship: React.FC = () => {
  const [searchParams] = useSearchParams();
  const idStr = searchParams.get('id');
  const internshipId = idStr ? parseInt(idStr, 10) : null;

  // Form State
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    educationBackground: '',
    coverLetter: '',
  });

  // Verification states
  const [verificationCode, setVerificationCode] = useState("");
  const [searchedCode, setSearchedCode] = useState<string | null>(null);

  // Queries
  const { data: internship, isLoading } = trpc.internship.getById.useQuery(
    { id: internshipId || 0 },
    { enabled: !!internshipId }
  );

  const { data: verResult, isLoading: isVerifying } = trpc.document.verifyCertificate.useQuery(
    { qrCode: searchedCode || "" },
    { enabled: !!searchedCode }
  );

  // Mutation
  const applyMutation = trpc.internship.submitApplication.useMutation({
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      setFormData({ applicantName: '', applicantEmail: '', applicantPhone: '', educationBackground: '', coverLetter: '' });
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internshipId) return;
    applyMutation.mutate({ internshipId, ...formData });
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (verificationCode.trim()) {
      setSearchedCode(verificationCode.trim());
    } else {
      toast.error("Please enter a Certificate ID");
    }
  };

  const handleClear = () => {
    setVerificationCode("");
    setSearchedCode(null);
  };

  // If no ID is passed, show the Certificate Verification UI
  if (!internshipId) {
    const isSuccess = verResult?.valid;
    const cert = verResult?.certificate;
    const recipient = verResult?.recipient;

    return (
      <div className="flex-grow flex flex-col items-center justify-center py-20 px-6 relative bg-[#f9f9f9] min-h-screen">
        <div className="w-full max-w-[700px] relative mt-12">
          {/* Central Card */}
          <div className="bg-white rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-6 sm:p-12 relative border border-[#e2e2e2]">
            {/* Logo Overlay */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2">
              <div className="bg-white p-2 rounded-full shadow-lg border border-[#e2e2e2]">
                <img alt="Trust Logo" className="w-28 h-28 object-contain rounded-full" src="/logo.jpg" />
              </div>
            </div>
            
            {/* Card Content */}
            <div className="mt-16 text-center">
              <h1 className="text-[#061941] text-[28px] sm:text-[38px] font-extrabold tracking-tight leading-tight uppercase">Valmiki Samaj Charitable Trust</h1>
              <p className="text-muted text-xl mt-2 font-medium">Internship Certificate Verification</p>
              <div className="w-16 h-1 mx-auto mt-4 bg-[#061941] rounded-full"></div>
              
              {/* Verification Input Form */}
              <form onSubmit={handleVerify} className="mt-12 max-w-lg mx-auto">
                <div className="bg-white card-content rounded-2xl shadow-sm border border-[#e2e2e2]">
                  <div className="relative flex items-center border-2 border-[#e2e2e2] rounded-xl px-4 py-4 focus-within:border-[#061941] transition-colors">
                    <span className="material-symbols-outlined text-[#061941] text-2xl mr-3">badge</span>
                    <input 
                      className="w-full bg-transparent border-none focus:outline-none focus:ring-0 text-lg text-[#1a1c1c] placeholder-muted" 
                      placeholder="Enter Internship ID (e.g., INT-2025-001 or CERT_...)" 
                      type="text" 
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <button 
                    type="submit" 
                    disabled={isVerifying}
                    className="bg-[#061941] text-white hover:bg-[#061941]/90 font-bold py-4 rounded-2xl transition-colors text-lg border border-[#061941] disabled:opacity-50"
                  >
                    {isVerifying ? "Verifying..." : "Verify Now"}
                  </button>
                  <button 
                    type="button" 
                    onClick={handleClear}
                    className="bg-[#f3f3f4] text-[#061941] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#e2e2e2] transition-colors text-lg border border-[#e2e2e2]"
                  >
                    <span className="material-symbols-outlined">restart_alt</span> Clear
                  </button>
                </div>
              </form>

              {/* Verification Result Display */}
              {searchedCode && (
                <div className="mt-8 border-t border-[#e2e2e2] pt-8 text-left">
                  {isVerifying ? (
                    <div className="text-center py-4">
                      <div className="w-10 h-10 border-4 border-t-[#061941] border-r-slate-200 border-b-slate-200 border-l-slate-200 rounded-full animate-spin mx-auto mb-2"></div>
                      <p className="text-slate-500 font-semibold text-sm">Verifying with records...</p>
                    </div>
                  ) : isSuccess && cert && recipient ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-emerald-800">
                        <span className="material-symbols-outlined text-3xl">verified</span>
                        <div>
                          <h4 className="font-bold text-base">Certificate Officially Verified</h4>
                          <p className="text-xs text-emerald-700 font-mono">ID: {cert.certificateNumber}</p>
                        </div>
                      </div>

                      {/* Overlaid Certificate Preview */}
                      <div className="relative w-full aspect-[904/639] max-w-lg mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50">
                        <img 
                          src={cert.certificateType === 'achievement' 
                            ? "https://res.cloudinary.com/dxmovdiru/image/upload/v1781611663/ngo-management/templates/achievement_certificate_template.jpg" 
                            : "https://res.cloudinary.com/dxmovdiru/image/upload/v1781611666/ngo-management/templates/membership_certificate_template.jpg"} 
                          alt="Certificate Template" 
                          className="w-full h-full object-cover" 
                        />
                        
                        {/* Recipient Name Overlay */}
                        <div className="absolute top-[48%] left-0 right-0 text-center px-8">
                          <span className="font-serif text-[14px] sm:text-[18px] md:text-[20px] text-slate-800 font-bold tracking-wide italic inline-block">
                            {recipient.name}
                          </span>
                        </div>

                        {/* Description Overlay */}
                        <div className="absolute top-[61%] left-[10%] right-[10%] text-center text-slate-600 text-[6px] sm:text-[8px] md:text-[10px] leading-relaxed">
                          {cert.description || `This certificate is officially presented to acknowledge their dedication and valuable service as a registered ${cert.certificateType} of the Valmiki Samaj Charitable Trust.`}
                        </div>

                        {/* Issue Date Overlay */}
                        <div className="absolute bottom-[13%] left-[17%] text-[6px] sm:text-[8px] text-slate-600 font-medium font-mono">
                          {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : ""}
                        </div>

                        {/* Certificate Number Overlay */}
                        <div className="absolute bottom-[13%] right-[17%] text-[6px] sm:text-[8px] text-slate-600 font-medium font-mono">
                          {cert.certificateNumber}
                        </div>
                      </div>

                      {/* Detail list */}
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-sm space-y-2 text-slate-700">
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="font-semibold text-slate-400">Awarded To:</span>
                          <span className="font-bold text-slate-900">{recipient.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="font-semibold text-slate-400">Award Type:</span>
                          <span className="font-bold text-slate-900 capitalize">{cert.certificateType}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/50 pb-2">
                          <span className="font-semibold text-slate-400">Issue Date:</span>
                          <span className="font-bold text-slate-900">{cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-400">Status:</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase">
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl text-red-800">
                      <span className="material-symbols-outlined text-3xl">warning</span>
                      <div>
                        <h4 className="font-bold text-base">Verification Failed</h4>
                        <p className="text-xs text-red-700">No active record found for Certificate ID: "{searchedCode}"</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Trust Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 pt-12 border-t border-[#e2e2e2]">
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-[#061941] text-4xl">lock</span>
                  <span className="text-[#061941]/80 font-bold text-sm">Secure Verification</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-[#061941] text-4xl">bolt</span>
                  <span className="text-[#061941]/80 font-bold text-sm">Instant Results</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-[#061941] text-4xl">database</span>
                  <span className="text-[#061941]/80 font-bold text-sm">Official Records</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, show the Internship Details and Application Form
  if (isLoading) {
    return <div className="flex-grow flex justify-center items-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
  }

  if (!internship) {
    return <div className="flex-grow flex justify-center items-center py-20"><p className="text-xl text-gray-500">Internship not found.</p></div>;
  }

  return (
    <div className="flex-grow bg-[#f8f9fa] pb-20">
      <section 
        className="bg-[#061941] text-white py-20 relative overflow-hidden bg-cover bg-center"
        style={internship.image ? { backgroundImage: `linear-gradient(rgba(6, 25, 65, 0.85), rgba(6, 25, 65, 0.85)), url('${encodeURI(internship.image)}')` } : undefined}
      >
        <div className="container-main px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-secondary">{internship.title}</h1>
          <div className="flex flex-wrap gap-4 mt-6 text-gray-300">
            <span className="flex items-center gap-2"><span className="material-symbols-outlined">domain</span> {internship.department || 'General'}</span>
            <span className="flex items-center gap-2"><span className="material-symbols-outlined">schedule</span> {internship.duration || 'Flexible'}</span>
            <span className="flex items-center gap-2 capitalize"><span className="material-symbols-outlined">location_on</span> {internship.type}</span>
          </div>
        </div>
      </section>

      <div className="container-main px-4 mt-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-primary mb-4">About the Role</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{internship.description}</p>
            
            {internship.requirements && (
              <>
                <h2 className="text-2xl font-bold text-primary mb-4 mt-8">Requirements</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{internship.requirements}</p>
              </>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-primary mb-4">Apply Now</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input required type="text" className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
                  value={formData.applicantName} onChange={(e) => setFormData({...formData, applicantName: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input required type="email" className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
                  value={formData.applicantEmail} onChange={(e) => setFormData({...formData, applicantEmail: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="text" className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
                  value={formData.applicantPhone} onChange={(e) => setFormData({...formData, applicantPhone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Education Background</label>
                <input type="text" placeholder="e.g., BSc Computer Science" className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200"
                  value={formData.educationBackground} onChange={(e) => setFormData({...formData, educationBackground: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
                <textarea required rows={4} className="w-full border rounded-lg p-2 focus:ring focus:ring-blue-200" placeholder="Why are you a good fit?"
                  value={formData.coverLetter} onChange={(e) => setFormData({...formData, coverLetter: e.target.value})} />
              </div>
              <button disabled={applyMutation.isPending} type="submit" className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-[#d87c00] transition-colors">
                {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewInternship;
