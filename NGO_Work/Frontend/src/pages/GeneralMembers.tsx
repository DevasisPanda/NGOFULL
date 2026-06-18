import React, { useState } from 'react';
import { trpc } from '../lib/trpc';

const GeneralMembers: React.FC = () => {
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data, isLoading, isError, error } = trpc.membership.getPublicMembers.useQuery(
    { page, pageSize }
  );

  const totalPages = data ? Math.ceil(data.total / pageSize) : 1;

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const formatDate = (dateString: Date | string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="flex-grow bg-[#f9fafb] pb-24 font-['Plus_Jakarta_Sans']">
      {/* Banner */}
      <section className="bg-[#061941] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        {/* Decorative Blurs */}
        <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-[#fed813] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
          <h1 className="text-secondary text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-[#fed813]">
            General Members
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-medium">
            Meet the dedicated individuals who support and drive our charitable initiatives to empower communities.
          </p>
        </div>
      </section>

      {/* Grid Content */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">
        {isLoading ? (
          // Loading Skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center animate-pulse">
                <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
            <p className="text-gray-600 text-lg font-semibold">{error?.message || "Failed to load members."}</p>
          </div>
        ) : !data || data.items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <span className="material-symbols-outlined text-gray-400 text-5xl mb-4">group</span>
            <p className="text-gray-500 text-lg">No active members found.</p>
          </div>
        ) : (
          <>
            {/* Active Members Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {data.items.map((member) => (
                <div 
                  key={member.id} 
                  className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100/80 flex flex-col items-center text-center transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  {/* Profile Image container */}
                  <div className="relative w-28 h-28 mb-4 rounded-full overflow-hidden border-4 border-[#061941]/5 group-hover:border-[#fed813] transition-all duration-300 shadow-inner">
                    {member.profileImage ? (
                      <img 
                        src={member.profileImage} 
                        alt={member.name || 'Member'} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#061941]/10 to-[#061941]/5 flex items-center justify-center text-[#061941]/40">
                        <span className="material-symbols-outlined text-4xl">person</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="font-bold text-lg text-[#061941] group-hover:text-[#fed813] transition-colors duration-300 line-clamp-1 mb-1">
                    {member.name || 'Anonymous Member'}
                  </h3>

                  {/* Designation */}
                  <span className="px-3 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-3">
                    {member.designation || 'Trust Member'}
                  </span>

                  {/* Details block */}
                  <div className="w-full pt-3 mt-auto border-t border-gray-50 space-y-1 text-xs text-gray-500 font-medium">
                    <div className="flex justify-between">
                      <span>ID:</span>
                      <span className="font-bold text-gray-700">{member.membershipNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Joined:</span>
                      <span className="text-gray-700">{formatDate(member.joinDate)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-16 font-semibold">
                <button
                  onClick={handlePrevPage}
                  disabled={page === 1}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px] mr-1">chevron_left</span>
                  Previous
                </button>

                <span className="text-sm text-gray-600">
                  Page <span className="font-bold text-[#061941]">{page}</span> of <span className="font-bold text-[#061941]">{totalPages}</span>
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm shadow-sm"
                >
                  Next
                  <span className="material-symbols-outlined text-[18px] ml-1">chevron_right</span>
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default GeneralMembers;
