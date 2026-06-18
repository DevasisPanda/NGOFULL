import React from 'react';

const Achievements: React.FC = () => {
  return (
    <div className="flex-grow bg-[#f8f9fa] pb-20">
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-6 text-5xl md:text-6xl font-extrabold tracking-tight">Achievements</h1>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-xl md:text-2xl font-medium">Coming Soon...</p>
        </div>
      </section>
      <section className="py-16 bg-white min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500 text-lg">Content is being updated. Please check back later.</p>
      </section>
    </div>
  );
};

export default Achievements;
