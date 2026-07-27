import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Volunteer: React.FC = () => {
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

    window.scrollTo(0, 0);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="page-section fade-in-section overflow-x-hidden pb-16" id="volunteer">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 mb-12 relative">
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-4 text-4xl md:text-6xl font-bold">Become a Volunteer</h1>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-xl">A Golden Opportunity to Transform Lives</p>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-lg mt-2 font-medium">“Be the Change You Wish to See in the World”</p>
        </div>
      </section>

      <div className="container-main animate-fade-in">
        {/* Core Message & Intro */}
        <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
            <span>🤝</span> Spreading Hope, Compassion & Humanity
          </h2>
          <p className="text-[#45464e] leading-relaxed mb-4 text-base md:text-lg">
            Valmiki Samaj Charitable Trust believes that even the smallest contribution can create a significant impact in society. Volunteering is not merely about donating time; it is a noble act of spreading hope, compassion, knowledge, and humanity among orphaned children, abandoned children, underprivileged children, and vulnerable sections of society.
          </p>
          <p className="text-[#45464e] leading-relaxed mb-4 text-base md:text-lg">
            By joining our organization as a volunteer, you become part of a compassionate family committed to bringing positive change to the lives of countless children. Your time, experience, guidance, and encouragement can help shape a child’s future and inspire them to achieve their dreams.
          </p>
          <div className="bg-[#f8f9fa] border-l-4 border-secondary p-4 italic text-base md:text-lg text-[#1a1c1c] font-medium mt-6">
            ✨ Through your support, orphaned and underprivileged children can gain access to education, life skills, confidence, and values that empower them to lead independent, successful, and dignified lives.
          </div>
        </div>

        {/* Direct & Meaningful Impact */}
        <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
            <span>💖</span> Make a Direct and Meaningful Impact
          </h2>
          <p className="text-[#45464e] leading-relaxed text-base md:text-lg">
            As a volunteer, you will have the unique opportunity to work directly with orphaned, abandoned, and vulnerable children, helping them overcome challenges and build brighter futures.
          </p>
          <p className="text-[#45464e] leading-relaxed mt-4 text-base md:text-lg">
            Your presence, care, encouragement, and mentorship can instill confidence, inspire hope, and motivate children to pursue their goals. A positive change in the life of one child can create a lasting impact on families, communities, and society as a whole.
          </p>
        </div>

        {/* How can you contribute grid */}
        <div className="mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-6">
            <span>🌟</span> How Can You Contribute as a Volunteer?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                num: "1️⃣",
                title: "Education and Mentoring",
                items: [
                  "Assist children with studies, homework, and projects",
                  "Teach English, computer skills, and digital literacy",
                  "Provide career guidance and personality development support",
                  "Help children develop life skills and moral values"
                ]
              },
              {
                num: "2️⃣",
                title: "Health and Hygiene Initiatives",
                items: [
                  "Organize health awareness programs",
                  "Support medical check-up camps",
                  "Promote personal hygiene and healthy living practices",
                  "Assist in distributing essential healthcare supplies"
                ]
              },
              {
                num: "3️⃣",
                title: "Training and Skill Development",
                items: [
                  "Conduct technology and digital literacy workshops",
                  "Help improve communication and language skills",
                  "Support vocational and skill development programs",
                  "Facilitate leadership and personality development sessions"
                ]
              },
              {
                num: "4️⃣",
                title: "Emotional & Psychological Support",
                items: [
                  "Offer encouragement, care, and emotional support",
                  "Help build self-confidence and positive thinking",
                  "Guide children in overcoming life's challenges",
                  "Promote mental well-being and resilience"
                ]
              },
              {
                num: "5️⃣",
                title: "Arts, Culture, and Sports",
                items: [
                  "Mentor children in music, dance, painting, and performing arts",
                  "Support sports and recreational activities",
                  "Encourage participation in cultural and talent programs"
                ]
              },
              {
                num: "6️⃣",
                title: "Event & Community Engagement",
                items: [
                  "Assist in organizing educational, cultural, and social events",
                  "Participate in fundraising and awareness campaigns",
                  "Contribute to community development initiatives"
                ]
              }
            ].map((contrib, idx) => (
              <div key={idx} className="bg-white border border-[#e2e2e2] rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-[#061941] text-base mb-3 flex items-center gap-1.5">
                  <span>{contrib.num}</span> {contrib.title}
                </h3>
                <ul className="space-y-1.5 pl-6 text-sm text-[#45464e]">
                  {contrib.items.map((item, i) => (
                    <li key={i} className="list-disc leading-relaxed">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits & Gains Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
              <span>📚</span> Importance and Benefits
            </h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-[#061941] text-base">🌈 Supporting Children's Futures</h4>
                <p className="text-sm text-[#45464e] leading-relaxed">Your contribution plays a vital role in the education, development, and overall well-being of orphaned and underprivileged children.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#061941] text-base">🌍 Creating Social Change</h4>
                <p className="text-sm text-[#45464e] leading-relaxed">Helping one child can positively influence an entire family, community, and future generation.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#061941] text-base">😊 Personal Fulfillment</h4>
                <p className="text-sm text-[#45464e] leading-relaxed">Serving humanity brings immense satisfaction, happiness, and a sense of purpose that enriches life.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
              <span>🎯</span> Developing New Skills & Experiences
            </h2>
            <p className="text-sm text-[#45464e] mb-4">Through volunteering with us, you will strengthen leadership, collaboration, and problem-solving abilities:</p>
            <ul className="space-y-1.5 pl-6 text-sm text-[#45464e]">
              <li className="list-disc">Strengthen leadership and organization skills</li>
              <li className="list-disc">Improve communication and public speaking</li>
              <li className="list-disc">Learn teamwork, empathy, and active collaboration</li>
              <li className="list-disc">Enhance problem-solving and critical thinking capabilities</li>
              <li className="list-disc">Connect with diverse people and learn new perspectives</li>
              <li className="list-disc">Experience the joy and motivation of children's smiles</li>
            </ul>
          </div>
        </div>

        {/* Effective Volunteer reflective guide */}
        <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
            <span>🏆</span> How to Become an Effective Volunteer
          </h2>
          <p className="text-[#45464e] text-sm md:text-base mb-6">
            Before joining as a volunteer, reflect on these questions. Our organization will help you align with projects that fit your interests and schedule:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "Which causes am I most passionate about?",
              "What skills and experiences can I contribute?",
              "How much time can I dedicate to serving others?",
              "What kind of positive impact do I want to create?"
            ].map((q, i) => (
              <div key={i} className="bg-[#f8f9fa] border-l-4 border-secondary p-4 rounded-r-lg">
                <p className="text-[#061941] font-bold text-sm">Question {i+1}</p>
                <p className="text-sm text-[#45464e] mt-1">{q}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What will you gain list */}
        <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
            <span>🌟</span> What Will You Gain from Volunteering?
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 text-sm text-[#45464e] font-medium">
            <li className="list-disc">Opportunities to meet new people and expand your network</li>
            <li className="list-disc">The satisfaction of making a direct, meaningful difference</li>
            <li className="list-disc">Leadership and personality development opportunities</li>
            <li className="list-disc">Valuable learning experiences and community building skills</li>
            <li className="list-disc">Increased confidence and self-growth</li>
            <li className="list-disc">The joy of contributing to a meaningful humanitarian cause</li>
          </ul>
        </div>

        {/* Join Us CTA */}
        <div className="bg-[#061941] text-white rounded-xl p-8 text-center fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h3 className="text-2xl font-bold text-secondary mb-4 flex items-center justify-center gap-2">
            <span>🤝</span> Join Us and Create Lasting Change
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm sm:text-base mb-6 leading-relaxed">
            By joining Valmiki Samaj Charitable Trust, you can help provide hope, education, protection, love, and a brighter future to orphaned, abandoned, and underprivileged children.
          </p>
          <div className="bg-white/5 border border-white/10 max-w-xl mx-auto p-4 rounded-lg italic text-white text-xs sm:text-sm mb-6 leading-relaxed">
            <p className="text-white">"No orphaned child should be deprived of love."</p>
            <p className="text-white">"No child should be denied education."</p>
            <p className="text-white">"No child should live without protection, dignity, and care."</p>
          </div>
          <Link 
            to="/register" 
            className="inline-block bg-secondary text-primary hover:bg-[#d67b00] hover:scale-105 transition-all px-8 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-md uppercase tracking-wider text-center"
          >
            Apply for Membership
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
