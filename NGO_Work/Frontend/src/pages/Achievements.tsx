import React from 'react';
import { trpc } from '../lib/trpc';

const Achievements: React.FC = () => {
  const { data: achievements, isLoading } = trpc.website.getAchievements.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex-grow bg-[#f8f9fa] pb-20 animate-fadeIn">
      {/* Header */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-6 text-5xl md:text-6xl font-extrabold tracking-tight">Achievements</h1>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-xl md:text-2xl font-medium">
            Celebrating milestones and success in social welfare
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white min-h-[50vh]">
        <div className="container-main max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <span className="animate-spin inline-block w-8 h-8 border-4 border-t-secondary border-r-transparent border-b-transparent border-l-transparent rounded-full" />
            </div>
          ) : !achievements || achievements.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4 block">emoji_events</span>
              <p className="text-lg font-semibold text-gray-700">Content is being updated</p>
              <p className="text-sm">Please check back later to see our latest awards and milestones.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className="rounded-2xl border border-gray-150 overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col group"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden flex items-center justify-center border-b">
                    {achievement.imageUrl ? (
                      <img 
                        src={achievement.imageUrl} 
                        alt={achievement.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center gap-2">
                        <span className="material-symbols-outlined text-4xl">emoji_events</span>
                        <span className="text-xs font-semibold uppercase tracking-wider">Milestone</span>
                      </div>
                    )}
                    
                    {/* Badge */}
                    <span className="absolute top-3 right-3 px-2 py-1 bg-[#e67e22] text-white text-[10px] font-bold uppercase rounded-md shadow-sm">
                      Milestone
                    </span>
                  </div>

                  {/* Text Details */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-primary text-xl mb-3 group-hover:text-secondary transition-colors duration-200 line-clamp-2">
                        {achievement.title}
                      </h3>
                      
                      {achievement.description && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 whitespace-pre-line">
                          {achievement.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {new Date(achievement.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Achievements;
