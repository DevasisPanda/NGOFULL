import React from 'react';
import Audit24_25 from '../assets/24_25.jpeg';
import Audit23_24 from '../assets/23_24.jpeg';
import Audit22_23 from '../assets/22_23.jpeg';




const auditReports = [
  { name: "Audit Report 2022-2023", image: Audit22_23 },
  { name: "Audit Report 2023-2024", image: Audit23_24 },
  
  { name: "Audit Report 2024-2025", image: Audit24_25 },
  { name: "Audit Report 2025-2026", image: null },
  { name: "Audit Report 2026-2027", image: null }
];

const Audit: React.FC = () => {
  return (
    <div className="flex-grow bg-[#f8f9fa] pb-20">
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary text-5xl md:text-6xl font-extrabold tracking-tight">Audit Reports</h1>
        </div>
      </section>
      
      <section className="py-16 container-main max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {auditReports.map((report) => (
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
      </section>
    </div>
  );
};

export default Audit;
