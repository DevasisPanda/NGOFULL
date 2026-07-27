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
          <p className="text-white opacity-90 max-w-2xl mx-auto text-lg mt-2 font-medium">Service • Education • Values • Empowerment • Dignity</p>
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
                <span>🌐</span> Our Mission
              </h2>
              <div className="bg-[#f8f9fa] border-l-4 border-secondary p-4 italic text-lg text-[#1a1c1c] font-medium mb-4">
                ✨ “At Valmiki Samaj Charitable Trust, our mission is to build an inclusive, empowered, and self-reliant society through service, education, compassion, and ethical values.”
              </div>
              <p className="text-[#45464e] leading-relaxed text-lg">
                Valmiki Samaj Charitable Trust firmly believes that service and education are not merely concepts; they are the most powerful tools to overcome poverty, inequality, and ignorance. Service transforms lives, education empowers families, and moral values lay the foundation for a progressive and prosperous society.
              </p>
              <p className="text-[#45464e] leading-relaxed text-lg mt-4">
                With this vision, the Trust continues to expand its reach and initiatives dedicated to ensuring that every individual, especially those from marginalized and underprivileged communities, has access to quality education, social support, and equal opportunities.
              </p>
            </div>
          </div>
        </div>

        {/* Two Column Grid: Unity & Key Focus Areas */}
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
              <span>📖</span> Key Mission Focus Areas
            </h2>
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
              
              <div>
                <h3 className="font-bold text-[#061941] text-base mb-1.5 flex items-center gap-1.5">
                  <span>📚</span> Education & Skill Development
                </h3>
                <ul className="space-y-1 pl-6 text-sm text-[#45464e]">
                  <li className="list-disc">Promote quality education for children and youth.</li>
                  <li className="list-disc">Encourage skill development and lifelong learning.</li>
                  <li className="list-disc">Create educational awareness among underprivileged families.</li>
                  <li className="list-disc">Empower women through education and vocational opportunities.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#061941] text-base mb-1.5 flex items-center gap-1.5">
                  <span>🧸</span> Child Welfare
                </h3>
                <ul className="space-y-1 pl-6 text-sm text-[#45464e]">
                  <li className="list-disc">Provide education, protection, guidance, and care for orphaned, destitute, and economically disadvantaged children.</li>
                  <li className="list-disc">Create opportunities that help every child live with dignity, confidence, and hope.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#061941] text-base mb-1.5 flex items-center gap-1.5">
                  <span>🌸</span> Women Empowerment
                </h3>
                <ul className="space-y-1 pl-6 text-sm text-[#45464e]">
                  <li className="list-disc">Organize dignified mass marriages for orphaned and adult destitute girls.</li>
                  <li className="list-disc">Support every bride with essential household items and livelihood resources.</li>
                  <li className="list-disc">Encourage financial independence and a secure future through self-employment opportunities.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#061941] text-base mb-1.5 flex items-center gap-1.5">
                  <span>🤝</span> Social Welfare
                </h3>
                <ul className="space-y-1 pl-6 text-sm text-[#45464e]">
                  <li className="list-disc">Work for the welfare of all communities without discrimination based on caste, religion, language, ethnicity, or economic status.</li>
                  <li className="list-disc">Promote compassion, humanity, equality, and social justice across society.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#061941] text-base mb-1.5 flex items-center gap-1.5">
                  <span>🌱</span> Health & Environment
                </h3>
                <ul className="space-y-1 pl-6 text-sm text-[#45464e]">
                  <li className="list-disc">Create awareness about health, hygiene, environmental protection, and sustainable development.</li>
                  <li className="list-disc">Encourage healthy and responsible lifestyles within communities.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-[#061941] text-base mb-1.5 flex items-center gap-1.5">
                  <span>🏛️</span> Culture & Nation Building
                </h3>
                <ul className="space-y-1 pl-6 text-sm text-[#45464e]">
                  <li className="list-disc">Preserve and promote India's cultural, ethical, and spiritual heritage.</li>
                  <li className="list-disc">Strengthen the values of patriotism, responsible citizenship, national unity, and social harmony.</li>
                </ul>
              </div>

            </div>
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
            <p className="leading-relaxed text-white text-lg mb-4 opacity-90">
              The Trust’s mission extends beyond distributing educational materials. Our primary goal is to prevent children from dropping out of school and ensure they continue their education without interruption.
            </p>
            <p className="leading-relaxed text-white text-lg mb-4 opacity-90">
              Through awareness, support, and community engagement, we strive to ensure that no child is forced to abandon education due to poverty, lack of resources, or social challenges.
            </p>
            <p className="leading-relaxed text-white text-lg font-medium">
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
                  "Our vision is to create a compassionate and progressive society where every individual has equal opportunities to live with dignity and self-respect."
                </p>
                <div className="mt-6 space-y-2 text-xs text-primary/80 font-bold italic">
                  <p>• Transforming Lives Through Compassion and Service.</p>
                  <p>• Building a Better Tomorrow Through Humanity, Education, and Empowerment.</p>
                  <p>• From Care and Compassion to a Self-Reliant Society.</p>
                </div>
              </div>
              <div className="md:col-span-3 p-8 md:p-12">
                <h2 className="text-2xl font-bold text-secondary flex items-center gap-2 mb-6">
                  <span>🎯</span> Core Pillars of Our Vision
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <div>
                      <strong className="text-white block font-bold text-base">Equal Opportunity for All</strong>
                      <span className="opacity-90 text-sm">To build an equitable society where every individual has access to security, dignity, education, and equal opportunities.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <div>
                      <strong className="text-white block font-bold text-base">Dignified Future for Every Girl</strong>
                      <span className="opacity-90 text-sm">To ensure that no orphaned or destitute adult girl is deprived of marriage or a respectable future because of financial hardship.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <div>
                      <strong className="text-white block font-bold text-base">Empowering Future Generations</strong>
                      <span className="opacity-90 text-sm">To nurture educated, ethical, self-reliant, and responsible youth who actively contribute to nation-building and social progress.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <div>
                      <strong className="text-white block font-bold text-base">Peace & Social Harmony</strong>
                      <span className="opacity-90 text-sm">To establish a society based on peace, unity, compassion, mutual respect, and harmony among all communities.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <div>
                      <strong className="text-white block font-bold text-base">Community Togetherness</strong>
                      <span className="opacity-90 text-sm">To foster communities that support one another through love, cooperation, shared responsibility, and collective growth.</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <div>
                      <strong className="text-white block font-bold text-base">Institutional Excellence</strong>
                      <span className="opacity-90 text-sm">To become a trusted model institution for social transformation through selfless service, transparency, accountability, and ethical values.</span>
                    </div>
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
