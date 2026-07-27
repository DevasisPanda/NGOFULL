import React, { useState } from 'react';
import { trpc } from '../lib/trpc';

interface Certificate {
  id?: number;
  name: string;
  imageUrl?: string;
  description?: string;
}

const staticCertificates: Certificate[] = [
  { name: "Registration Certificate", imageUrl: "https://res.cloudinary.com/dxmovdiru/image/upload/v1781614777/ngo-management/certifications/nmiy3jwfewhywgydk7yg.jpg", description: "Official Registration Certificate of Valmiki Samaj Charitable Trust." },
  { name: "80G Certificate", imageUrl: "https://res.cloudinary.com/dxmovdiru/image/upload/v1781614779/ngo-management/certifications/lmwl1sitjjgyzjfxvytb.jpg", description: "Tax exemption certificate under Section 80G of the Income Tax Act." },
  { name: "12A Registration", imageUrl: "https://res.cloudinary.com/dxmovdiru/image/upload/v1781621765/ngo-management/Cer1_34d3ab3e.jpg", description: "Tax registration certificate under Section 12A of the Income Tax Act." },
  { name: "CSR Registration", imageUrl: "https://res.cloudinary.com/dxmovdiru/image/upload/v1781614783/ngo-management/certifications/bti7eoijve9otpfjn7zz.jpg", description: "Corporate Social Responsibility registration certificate with the Ministry of Corporate Affairs." },
  { name: "NGO Darpan", imageUrl: "https://res.cloudinary.com/dxmovdiru/image/upload/v1781614784/ngo-management/certifications/mlfgupo83nc37ojjavjc.jpg", description: "NITI Aayog NGO Darpan portal registration unique ID certificate." },
  { name: "TAN Number", imageUrl: "https://res.cloudinary.com/dxmovdiru/image/upload/v1781614785/ngo-management/certifications/w2uyxs9vc9hicbqu5csy.jpg", description: "Tax Deduction and Collection Account Number (TAN) document." }
];

const Certifications: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  const { data: dynamicCertificates, isLoading } = trpc.document.getOrgCertificates.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const displayCertificates = dynamicCertificates && dynamicCertificates.length > 0 
    ? dynamicCertificates 
    : staticCertificates;

  return (
    <div className="flex-grow bg-[#f8f9fa] pb-20">
      {/* Header Banner */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary text-5xl md:text-6xl font-extrabold tracking-tight">Certifications</h1>
          <p className="text-slate-300 mt-3 text-sm md:text-base max-w-xl mx-auto font-medium">
            Official government registrations, approvals, and legal documents of the Trust.
          </p>
        </div>
      </section>
      
      {/* Certificates Grid */}
      <section className="py-16 container-main max-w-6xl mx-auto px-4">
        {isLoading ? (
          <div className="min-h-[30vh] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-secondary border-r-slate-200 border-b-slate-200 border-l-slate-200 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-semibold text-sm">Loading certificates...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCertificates.map((cert: any) => (
              <div 
                key={cert.id || cert.name} 
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer h-[380px]"
                onClick={() => setSelectedCert(cert)}
              >
                {/* Header title */}
                <div className="bg-[#061941] text-white py-4 px-6 text-center border-b border-slate-100 flex items-center justify-center min-h-[70px]">
                  <h3 className="font-extrabold text-sm md:text-base text-secondary tracking-wide uppercase leading-snug">
                    {cert.name}
                  </h3>
                </div>
                
                {/* Document preview area */}
                <div className="flex-grow p-6 flex items-center justify-center bg-white relative overflow-hidden">
                  {cert.imageUrl ? (
                    <img 
                      src={cert.imageUrl} 
                      alt={cert.name} 
                      className="max-w-full max-h-[220px] object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-slate-400 italic text-sm">Image not available</div>
                  )}

                  {/* Hover visual details */}
                  <div className="absolute inset-0 bg-[#061941]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-12 h-12 bg-secondary text-primary rounded-full flex items-center justify-center shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="material-symbols-outlined text-[28px] font-bold">zoom_in</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox Preview Modal */}
      {selectedCert && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] shadow-2xl relative flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg transition-colors cursor-pointer z-10"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="bg-[#061941] text-white p-5 pr-14">
              <h3 className="text-lg md:text-xl font-extrabold text-secondary tracking-wide uppercase">
                {selectedCert.name}
              </h3>
              {selectedCert.description && (
                <p className="text-slate-300 text-xs md:text-sm mt-1">{selectedCert.description}</p>
              )}
            </div>

            {/* Modal Body (Full image display) */}
            <div className="flex-1 bg-slate-50 overflow-auto p-6 flex items-center justify-center min-h-[300px]">
              {selectedCert.imageUrl ? (
                <img
                  src={selectedCert.imageUrl}
                  alt={selectedCert.name}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-md"
                />
              ) : (
                <div className="text-slate-400 italic">Document preview not available</div>
              )}
            </div>

            {/* Modal Footer with Actions */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center gap-4">
              {selectedCert.imageUrl ? (
                <a
                  href={selectedCert.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs md:text-sm text-secondary hover:text-opacity-80 font-bold border border-secondary px-4 py-2 rounded-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  Open in New Tab
                </a>
              ) : <div />}

              <button
                onClick={() => setSelectedCert(null)}
                className="bg-secondary text-primary font-bold px-6 py-2 rounded-lg text-xs md:text-sm hover:bg-opacity-90 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifications;
