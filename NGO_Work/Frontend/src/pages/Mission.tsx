import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Mission: React.FC = () => {
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
    <div className="page-section fade-in-section overflow-x-hidden" id="mission">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 mb-12 relative">
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-4 text-4xl md:text-6xl font-bold">Mission & Vision</h1>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-xl">Valmiki Samaj Charitable Trust</p>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-lg mt-2 font-medium">Education • Service • Equality • Empowerment</p>
        </div>
      </section>

      <div className="container-main">
        {/* Intro & Logo */}
        <div className="flex flex-col lg:flex-row gap-12 items-center mb-16 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <div className="lg:w-1/3 flex justify-center">
            <img
              src="/logo.jpg"
              alt="Valmiki Samaj Trust Logo"
              className="w-64 h-64 object-contain rounded-full border-4 border-[#f8f9fa] shadow-none bg-[#f8f9fa]"
            />
          </div>
          <div className="lg:w-2/3 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-[#061941] flex items-center gap-2 mb-4">
                <span>🌐</span> Mission for Education – Education is Welfare
              </h2>
              <div className="bg-[#f8f9fa] border-l-4 border-secondary p-4 italic text-lg text-[#1a1c1c] font-medium mb-4">
                ✨ “Where there is Service, there is God; Where there is Education, there is a Bright Future.”
              </div>
              <p className="text-[#45464e] leading-relaxed text-lg">
                Valmiki Samaj Charitable Trust firmly believes that education is not merely a means of acquiring knowledge; it is the most powerful tool to overcome poverty, inequality, and ignorance. Education transforms lives, empowers families, and lays the foundation for a progressive and prosperous society.
              </p>
              <p className="text-[#45464e] leading-relaxed text-lg mt-4">
                With this vision, the Trust has launched <strong>“Mission for Education – School Chale Hum”</strong>, an initiative dedicated to ensuring that every child, especially those from marginalized and underprivileged communities, has access to quality education and equal opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Grid: Unity & Educational Revolution */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
              <span>🤝</span> Unity, Compassion and Public Welfare
            </h2>
            <p className="text-[#45464e] leading-relaxed mb-4">
              When many hands come together for a common mission, they create more than cooperation—they create a powerful symbol of love, compassion, service, and humanity.
            </p>
            <p className="text-[#45464e] leading-relaxed mb-4">
              <strong>Jan Kalyan (Public Welfare)</strong> is the guiding philosophy of our organization. It reflects our commitment to the upliftment, dignity, and well-being of every individual in society.
            </p>
            <p className="text-[#45464e] leading-relaxed">
              We believe that lasting social transformation can only be achieved through service, dedication, sacrifice, cooperation, and collective responsibility.
            </p>
          </div>

          <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
              <span>📖</span> Educational Revolution
            </h2>
            <div className="bg-[#f8f9fa] border-l-4 border-secondary p-3 italic text-md text-[#1a1c1c] font-medium mb-4">
              📢 “No discrimination of caste, creed, or religion; every child deserves the right to education.”
            </div>
            <p className="text-[#45464e] leading-relaxed mb-6">
              All our educational initiatives are inclusive and non-discriminatory. We serve children irrespective of their religion, caste, community, or economic background, ensuring equal opportunities for all.
            </p>
            
            <h3 className="text-xl font-bold text-[#061941] mb-3">Our Key Educational Initiatives</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✅</span>
                <span className="text-[#45464e]">Free educational support for students studying in government primary schools.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✅</span>
                <span className="text-[#45464e]">Distribution of more than 25,000 notebooks to students of Grades 6 to 8.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✅</span>
                <span className="text-[#45464e]">Door-to-door outreach programs delivering educational kits to children in remote villages and sanitation workers’ communities.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✅</span>
                <span className="text-[#45464e]">Protection and promotion of every child’s fundamental right to education up to the age of 14.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Child Labour & Underprivileged Families */}
        <div className="mb-16 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <div className="bg-primary text-white rounded-2xl p-8 md:p-12 shadow-lg mb-8">
            <h2 className="text-3xl font-bold text-secondary flex items-center gap-2 mb-6">
            Reducing School Dropouts and Eliminating Child Labour
            </h2>
            <div className="bg-white/10 border-l-4 border-white p-4 italic text-lg font-medium mb-6">
              📢 “End Child Labour, Send Every Child to School.”
            </div>
            <p className="leading-relaxed  text-white text-lg mb-4 opacity-90">
              The Trust’s mission extends beyond distributing educational materials. Our primary goal is to prevent children from dropping out of school and ensure they continue their education without interruption.
            </p>
            <p className="leading-relaxed  text-white text-lg mb-4 opacity-90">
              Through awareness, support, and community engagement, we strive to ensure that no child is forced to abandon education due to poverty, lack of resources, or social challenges.
            </p>
            <p className="leading-relaxed  text-white text-lg font-medium">
              We envision a society where every child holds a pen instead of tools of labour and contributes to building a brighter nation.
            </p>
          </div>
        </div>

        {/* Underprivileged Families & Women Empowerment */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <div className="bg-[#f8f9fa] rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
              <span>🌸</span> A Ray of Hope for Families
            </h2>
            <p className="text-[#45464e] leading-relaxed mb-6">
              Sanitation workers who dedicate their lives to keeping society clean often face serious health risks and economic hardships. In many cases, families are left vulnerable after losing their primary earning member.
            </p>
            <p className="text-[#061941] font-bold mb-3">In such circumstances, the Trust stands as a pillar of support by providing:</p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">•</span>
                <span className="text-[#45464e]">Educational assistance and guidance to orphaned and underprivileged children.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">•</span>
                <span className="text-[#45464e]">Support for children of widowed mothers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">•</span>
                <span className="text-[#45464e]">Programs that promote dignity, self-respect, and confidence.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-1">•</span>
                <span className="text-[#45464e]">Mentorship and encouragement for higher education and career development.</span>
              </li>
            </ul>
            
            <div className="bg-white border border-[#e2e2e2] p-4 rounded-lg">
              <div className="font-bold text-secondary italic mb-2">✨ “A daughter is the light of a family.”</div>
              <p className="text-[#45464e] text-sm leading-relaxed mb-2">
                For economically weaker families, marriage expenses can be a significant burden. To ease this challenge, the Trust organizes annual mass marriage ceremonies.
              </p>
              <p className="text-[#45464e] text-sm leading-relaxed">
                Each bride receives a sewing machine free of cost, empowering her to earn a livelihood and lead a dignified, self-reliant life.
              </p>
            </div>
          </div>

          <div className="bg-[#f8f9fa] rounded-xl p-8 border border-gray-200">
            <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
              <span>📢</span> Empowered Women, Prosperous Society.
            </h2>
            <p className="text-[#45464e] leading-relaxed mb-6">
              We believe that women are the cornerstone of strong families and communities. Our initiatives focus on three key areas:
            </p>
            
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-lg border border-[#e2e2e2] shadow-sm flex gap-4">
                <div className="text-3xl mt-1">🧵</div>
                <div>
                  <h4 className="font-bold text-[#061941]">Economic Empowerment</h4>
                  <p className="text-[#45464e] text-sm mt-1">Creating livelihood opportunities through sewing machines and skill development.</p>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-[#e2e2e2] shadow-sm flex gap-4">
                <div className="text-3xl mt-1">📚</div>
                <div>
                  <h4 className="font-bold text-[#061941]">Educational Empowerment</h4>
                  <p className="text-[#45464e] text-sm mt-1">Building confidence, awareness, and knowledge through education.</p>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-lg border border-[#e2e2e2] shadow-sm flex gap-4">
                <div className="text-3xl mt-1">🌺</div>
                <div>
                  <h4 className="font-bold text-[#061941]">Social Empowerment</h4>
                  <p className="text-[#45464e] text-sm mt-1">Promoting dignity, equality, and meaningful participation in society.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-300">
              <h3 className="font-bold text-[#061941] flex items-center gap-2 mb-3">
                <span>🌺</span> Gratitude to Our Donors
              </h3>
              <div className="italic text-secondary font-medium text-sm mb-3">
                🙏 “A contribution towards education and service is a true offering to humanity.”
              </div>
              <p className="text-[#45464e] text-sm leading-relaxed">
                Our mission is made possible through the generous support of donors, social leaders, volunteers, and well-wishers from all walks of life. Even a small contribution can transform a child’s future, bring hope to a struggling family, and create meaningful change in society.
              </p>
            </div>
          </div>
        </div>

        {/* Vision & Objectives */}
        <div className="mb-16 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <div className="bg-primary text-white rounded-2xl overflow-hidden shadow-xl">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 bg-secondary p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-primary flex items-center gap-2 mb-6">
                  <span>🌟</span> Our Vision
                </h2>
                <p className="text-primary text-xl leading-relaxed italic font-medium">
                  "A society where every child is educated, every childhood is protected, and every woman is empowered—regardless of caste, religion, community, or economic status—is a society that truly reflects progress, equality, and humanity."
                </p>
              </div>
              <div className="md:col-span-3 p-8 md:p-12">
                <h2 className="text-2xl font-bold text-secondary flex items-center gap-2 mb-6">
                  <span>🎯</span> Our Long-Term Objectives
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span className="opacity-90">Ensure that no child is deprived of education due to lack of resources.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span className="opacity-90">Eliminate child labour and encourage school enrollment.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span className="opacity-90">Create 100% educational awareness among marginalized and disadvantaged communities.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span className="opacity-90">Empower girls and women through education and self-reliance.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span className="opacity-90">Promote dropout-free schools and equal educational opportunities.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span className="opacity-90">Build a strong and progressive nation through education, empowerment, and social responsibility.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-[#f8f9fa] border border-[#e2e2e2] rounded-xl p-10 mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h2 className="text-3xl font-bold text-[#061941] mb-4">📞 Join the Movement</h2>
          <p className="text-lg text-[#45464e] mb-2 max-w-3xl mx-auto">
            Let us come together to transform the seeds of humanity into a mighty tree of hope and opportunity.
          </p>
          <p className="text-lg text-[#45464e] mb-8 max-w-3xl mx-auto">
            Become a partner in nation-building by supporting children, women, and underprivileged families with education, dignity, equality, and empowerment. Together, we can create a future where every child learns, every family thrives, and every individual lives with dignity.
          </p>
          <Link to="/contact" className="bg-[#061941] text-white px-10 py-4 rounded-full font-bold text-xl inline-flex items-center gap-3 hover:bg-secondary transition-all shadow-lg hover:-translate-y-1">
            Contact Us Now <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Mission;
