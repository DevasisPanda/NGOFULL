import React from 'react';
import { trpc } from '../lib/trpc';
import Audit24_25 from '../assets/24_25.jpeg';
import Audit23_24 from '../assets/23_24.jpeg';
import Audit22_23 from '../assets/22_23.jpeg';

const Audit: React.FC = () => {
  const { data: auditsData, isLoading } = trpc.website.getAudits.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  const defaultAudits = [
    { name: "Audit Report 2022-2023", image: Audit22_23 },
    { name: "Audit Report 2023-2024", image: Audit23_24 },
    { name: "Audit Report 2024-2025", image: Audit24_25 },
    { name: "Audit Report 2025-2026", image: null },
    { name: "Audit Report 2026-2027", image: null }
  ];

  // Merge backend audits with defaults
  const mergedAudits = [...defaultAudits];
  if (auditsData) {
    auditsData.forEach((dbAudit) => {
      const cleanDbName = dbAudit.name.trim().toLowerCase().replace(/\s+/g, '');
      const matchIndex = mergedAudits.findIndex(
        (def) => def.name.trim().toLowerCase().replace(/\s+/g, '') === cleanDbName
      );
      if (matchIndex !== -1) {
        mergedAudits[matchIndex] = {
          name: dbAudit.name,
          image: dbAudit.imageUrl || mergedAudits[matchIndex].image
        };
      } else {
        mergedAudits.push({
          name: dbAudit.name,
          image: dbAudit.imageUrl || null
        });
      }
    });
  }

  const getStartYear = (name: string): number => {
    const match = name.match(/(\d{4})/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const reports = mergedAudits.sort((a, b) => getStartYear(b.name) - getStartYear(a.name));

  return (
    <div className="flex-grow bg-[#f8f9fa] pb-20">
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary text-5xl md:text-6xl font-extrabold tracking-tight">Audit Reports</h1>
        </div>
      </section>
      
      <section className="py-16 container-main max-w-6xl mx-auto px-4">
        {isLoading && (!auditsData || auditsData.length === 0) ? (
          <div className="py-12 text-center text-gray-500">Loading audit reports...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <div 
                key={report.name} 
                className="rounded-xl border border-gray-300 overflow-hidden flex flex-col bg-white shadow-lg transition-transform hover:scale-[1.02]"
                style={{ minHeight: '350px' }}
              >
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-[#e67e22] to-[#1e293b] p-4 text-center text-white font-bold text-lg md:text-xl shadow-sm">
                  {report.name}
                </div>
                
                {/* Box Body */}
                <div className="flex-1 p-4 flex flex-col items-center justify-center bg-gray-50">
                  {report.image ? (
                    <img 
                      src={report.image} 
                      alt={`${report.name} Image`} 
                      className="w-full h-full object-contain max-h-[280px]"
                    />
                  ) : (
                    <div className="text-gray-400 italic">Report document not available</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Audit;
