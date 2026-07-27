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

  // Parse bullet points out of the bio text to render them as structured key-value pairs
  const bioLines = member.bio.split('\n');
  const details: Array<{ key: string; value: string; icon: string }> = [];
  const cleanBioParagraphs: string[] = [];

  const getIconForKey = (key: string): string => {
    const k = key.toLowerCase();
    if (k.includes('birth') || k.includes('age')) return 'cake';
    if (k.includes('residence') || k.includes('address') || k.includes('place')) return 'location_on';
    if (k.includes('qualification') || k.includes('education') || k.includes('degree') || k.includes('credential')) return 'school';
    if (k.includes('profession') || k.includes('occupation') || k.includes('role') || k.includes('responsibility') || k.includes('position')) return 'work';
    if (k.includes('hobby') || k.includes('hobbies') || k.includes('interest')) return 'sports_esports';
    return 'info';
  };

  bioLines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('•')) {
      const content = trimmed.substring(1).trim();
      const colonIndex = content.indexOf(':');
      if (colonIndex !== -1) {
        const key = content.substring(0, colonIndex).trim();
        const value = content.substring(colonIndex + 1).trim();
        details.push({
          key,
          value,
          icon: getIconForKey(key)
        });
      }
    } else {
      cleanBioParagraphs.push(line);
    }
  });

  const cleanBio = cleanBioParagraphs.join('\n').trim();

  const renderFormattedContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = (keyPrefix: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${keyPrefix}`} className="list-disc pl-6 space-y-2 my-4 text-muted text-[16px] leading-relaxed">
            {listItems.map((item, idx) => (
              <li key={idx} className="marker:text-secondary">{item}</li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList(`${index}`);
        return;
      }

      // Check if it starts with a bullet character or is part of a list
      if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const cleaned = trimmed.replace(/^[•\-\*]\s*/, '');
        listItems.push(cleaned);
        return;
      }

      // If it's a quote (e.g. enclosed in double quotes or curly quotes)
      const isQuote = (trimmed.startsWith('“') && trimmed.endsWith('”')) || 
                      (trimmed.startsWith('"') && trimmed.endsWith('"'));
      if (isQuote) {
        flushList(`${index}`);
        elements.push(
          <div key={`quote-${index}`} className="my-6 pl-5 border-l-4 border-secondary bg-gray-50/70 py-4 pr-3 rounded-r-2xl italic text-[17px] text-primary font-medium leading-relaxed shadow-sm">
            {trimmed}
          </div>
        );
        return;
      }

      // If it's a heading (e.g. short length, no ending period, capitalized first letter of words)
      const isShort = trimmed.length < 80;
      const noEndPunctuation = !trimmed.endsWith('.') && !trimmed.endsWith('!') && !trimmed.endsWith('?');
      const isHeading = isShort && noEndPunctuation && (
        trimmed === trimmed.toUpperCase() || 
        trimmed.includes('Journey') || 
        trimmed.includes('Education:') || 
        trimmed.includes('Decades of') || 
        trimmed.includes('Transforming') || 
        trimmed.includes('Empowerment') || 
        trimmed.includes('Transparency') || 
        trimmed.includes('Spirituality') || 
        trimmed.includes('Integrity') || 
        trimmed.includes('Vision for') || 
        trimmed.includes('Family') || 
        trimmed.includes('Philosophy') || 
        trimmed.includes('Mission') ||
        trimmed.includes('Commitment')
      );

      if (isHeading) {
        flushList(`${index}`);
        elements.push(
          <h4 key={`heading-${index}`} className="text-primary font-bold text-[20px] md:text-[22px] mt-8 mb-4 border-b border-gray-100 pb-2">
            {trimmed}
          </h4>
        );
      } else {
        // It's a regular paragraph
        flushList(`${index}`);
        elements.push(
          <p key={`p-${index}`} className="text-muted text-[16px] leading-relaxed mb-4">
            {trimmed}
          </p>
        );
      }
    });

    flushList('final');
    return elements;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header with Background */}
      <section className="bg-primary text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main relative z-10 flex items-center gap-4">
          <Link to="/management-body" className="flex items-center text-secondary hover:text-white transition-colors font-bold">
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Back to Management
          </Link>
        </div>
      </section>

      {/* Profile Content */}
      <div className="container-main -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col md:flex-row relative">
          
          {/* Left Column: Image & Quick Details Panel */}
          <div className="md:w-[40%] lg:w-[35%] p-6 md:p-8 md:sticky md:top-6 self-start flex flex-col gap-6 shrink-0 bg-gray-50/50">
            {/* Circular Rounded Image container with padding context */}
            <div className="w-full aspect-[3/4] h-auto rounded-3xl overflow-hidden shadow-md border border-gray-100 relative bg-white group">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Quick Profile metadata details stacked directly below the image */}
            {details.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm w-full">
                <h3 className="text-[18px] font-bold text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">badge</span>
                  Quick Profile
                </h3>
                <div className="space-y-4">
                  {details.map((d, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <span className="material-symbols-outlined text-secondary bg-gray-50 p-2 rounded-xl shadow-inner text-[20px] shrink-0">
                        {d.icon}
                      </span>
                      <div>
                        <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                          {d.key}
                        </span>
                        <span className="text-[14px] text-primary font-semibold leading-tight">
                          {d.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Details */}
          <div className="md:w-[60%] lg:w-[65%] p-10 md:p-16 flex flex-col justify-center">
            <div className="mb-8 border-b border-gray-100 pb-8">
              <span className="text-secondary font-bold tracking-widest uppercase text-sm mb-2 block font-bold">
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

            {/* Biography Description */}
            <div className="space-y-4 mb-12">
              <h3 className="text-[22px] font-bold text-primary border-b pb-2 mb-4">Biography</h3>
              <div className="space-y-4">
                {renderFormattedContent(cleanBio)}
              </div>
            </div>

            {/* Key Contributions */}
            <div className="space-y-6">
              <h3 className="text-[22px] font-bold text-primary border-b pb-2 mb-4">Key Contributions</h3>
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
