import React from 'react';
import { trpc } from '../lib/trpc';
import { useNavigate } from 'react-router-dom';

const Internship: React.FC = () => {
  const { data: internships, isLoading } = trpc.internship.getAll.useQuery();
  const navigate = useNavigate();

  return (
    <div className="flex-grow bg-[#f8f9fa] pb-20">
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10 px-4">
          <h1 className="text-secondary mb-6 text-5xl md:text-6xl font-extrabold tracking-tight">Open Internships</h1>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-xl font-medium">
            Join our team and make a difference. Explore our current internship opportunities below.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-5xl mx-auto min-h-[40vh]">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : internships && internships.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {internships.map((internship) => (
              <div key={internship.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden flex flex-col">
                {internship.image && (
                  <img src={internship.image} alt={internship.title} className="w-full h-48 object-cover border-b" />
                )}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-primary">{internship.title}</h3>
                    <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium capitalize">
                      {internship.type}
                    </span>
                  </div>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">domain</span>
                    {internship.department || 'General'}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">schedule</span>
                    {internship.duration || 'Not specified'}
                  </p>
                  <p className="text-gray-600 text-sm flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {internship.location || (internship.type === 'remote' ? 'Anywhere' : 'Not specified')}
                  </p>
                </div>
                <p className="text-gray-700 mb-6 line-clamp-3">{internship.description}</p>
                <button 
                  onClick={() => navigate(`/view-internship?id=${internship.id}`)}
                  className="w-full bg-secondary text-white font-bold py-3 rounded-lg hover:bg-[#d87c00] transition-colors"
                >
                  View Details & Apply
                </button>
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100 shadow-sm">
            <span className="material-symbols-outlined text-5xl text-gray-400 mb-4">work_off</span>
            <h3 className="text-xl font-bold text-gray-800">No Openings Right Now</h3>
            <p className="text-gray-500 mt-2">Check back later for new internship opportunities.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Internship;
