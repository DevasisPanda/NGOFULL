import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { managementMembers } from '../data/managementMembers';

const MemberProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const member = managementMembers.find(m => m.id === Number(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!member) {
    return <Navigate to="/management-body" replace />;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header with Background */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main relative z-10 flex items-center gap-4">
          <Link to="/management-body" className="flex items-center text-secondary hover:text-white transition-colors">
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Back to Management
          </Link>
        </div>
      </section>

      {/* Profile Content */}
      <div className="container-main -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Column: Image */}
          <div className="md:w-[40%] lg:w-[35%] relative h-[500px] md:h-auto bg-primary">
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent"></div>
          </div>

          {/* Right Column: Details */}
          <div className="md:w-[60%] lg:w-[65%] p-10 md:p-16 flex flex-col justify-center">
            <div className="mb-8 border-b border-gray-100 pb-8">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block">
                {member.tag}
              </span>
              <h1 className="text-[36px] md:text-[42px] font-bold text-primary leading-tight mb-2">
                {member.name}
              </h1>
              <p className="text-[20px] text-gray-500 font-medium">
                {member.role}
              </p>
            </div>

            <div className="relative mb-10">
              <span className="material-symbols-outlined absolute -top-6 -left-6 text-7xl text-gray-100 -z-10 rotate-180">
                format_quote
              </span>
              <p className="text-primary text-[22px] leading-relaxed font-medium italic">
                {member.quote}
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-[20px] font-bold text-primary mb-4">About</h3>
              <p className="text-muted text-[16px] leading-relaxed">
                {member.bio}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-[20px] font-bold text-primary mb-4">Key Contributions</h3>
              {member.points.map((point, ptIdx) => (
                <div key={ptIdx} className="flex items-start gap-5">
                  <div className="bg-[#f8f9fa] p-3 rounded-lg text-secondary shrink-0 mt-1 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">{point.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-primary font-bold text-[18px] mb-2">{point.title}</h4>
                    <p className="text-muted text-[15px] leading-relaxed">{point.description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
