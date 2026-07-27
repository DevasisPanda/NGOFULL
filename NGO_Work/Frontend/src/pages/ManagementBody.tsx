import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { managementMembers } from '../data/managementMembers';

const ManagementBody: React.FC = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-section fade-in-section">
      {/* Header Section */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-6 text-5xl md:text-6xl font-extrabold tracking-tight">
            Management Body
          </h1>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-xl md:text-2xl font-medium">
            Meet the dedicated individuals guiding Valmiki Samaj Charitable Trust towards a better future.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="container-main">
          <div className="text-center mb-16 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">Our Leadership</span>
            <h2 className="text-[36px] font-bold text-primary">Trustees & Management</h2>
            <div className="w-24 h-1.5 bg-secondary mx-auto mt-6 rounded-full"></div>
          </div>

          {managementMembers.map((member, index) => (
            <div key={member.id} className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.06)] border border-gray-100 mb-16 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
              <div className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} w-full`}>
                {/* Image Side */}
                <div className="lg:w-[35%] relative h-[400px] lg:h-auto bg-primary cursor-pointer group hover:opacity-90 transition-opacity">
                  <Link to={`/member/${member.id}`} className="block w-full h-full">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    <div className="absolute bottom-4 left-8 right-8 flex justify-center">
                      <div className="bg-white/15 backdrop-blur-xl rounded-[28px] px-7 py-2 text-center max-w-lg w-full shadow-[0_20px_50px_rgba(0,0,0,0.14)] border border-white/20 group-hover:bg-white/25 transition-colors">
                        <h3 className="text-[18px] md:text-[20px] font-bold leading-tight mb-1 text-white">{member.name}</h3>
                        <p className="text-secondary font-bold text-[13px] md:text-[14px] uppercase tracking-wide">{member.role}</p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Details Side */}
                <div className="lg:w-[65%] p-10 lg:p-16 flex flex-col justify-center">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute -top-4 -left-4 text-7xl text-gray-100 -z-10 rotate-180">format_quote</span>
                    <p className="text-primary text-[20px] leading-relaxed font-medium italic mb-8">
                      {member.quote}
                    </p>
                  </div>
                  
                  <p className="text-muted text-[16px] leading-relaxed mb-8 whitespace-pre-line">
                    {member.bio.split('\n')[0]}
                  </p>

                  <div className="space-y-6 mb-10">
                    {member.points.map((point, ptIdx) => (
                      <div key={ptIdx} className="flex items-start gap-5">
                        <div className="bg-[#f8f9fa] p-3 rounded-lg text-secondary shrink-0 mt-1">
                          <span className="material-symbols-outlined text-[24px]">{point.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-primary font-bold text-[16px] mb-2">{point.title}</h4>
                          <p className="text-muted text-[15px] leading-relaxed">{point.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
                      <span className="text-primary font-bold text-[15px]">{member.tag}</span>
                    </div>
                    <Link to={`/member/${member.id}`} className="bg-[#061941] text-white hover:bg-secondary px-6 py-2.5 rounded-full font-bold text-[14px] inline-flex items-center gap-2 transition-all duration-300 shadow-sm hover:-translate-y-0.5">
                      Read More <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Other Members Grid (We will inject more cards here later) */}
          <div className="text-center mb-10 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
            <h3 className="text-[24px] font-bold text-primary">Executive Committee</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0" id="management-cards">
            
            {/* Placeholder for future members */}
            <div className="bg-[#f8f9fa] rounded-3xl overflow-hidden hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-gray-100 border-dashed flex flex-col items-center justify-center h-[450px] text-gray-400 hover:bg-white hover:border-secondary hover:text-secondary cursor-pointer group">
               <div className="bg-gray-100 p-6 rounded-full mb-5 group-hover:bg-[#fff3e0] transition-colors">
                 <span className="material-symbols-outlined text-5xl">person_add</span>
               </div>
               <p className="font-bold text-[18px]">More Members Coming Soon</p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ManagementBody;
