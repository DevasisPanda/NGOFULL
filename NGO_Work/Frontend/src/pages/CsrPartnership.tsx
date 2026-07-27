import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const CsrPartnership: React.FC = () => {
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
    <div className="page-section fade-in-section overflow-x-hidden pb-16" id="csr-partnership">
      {/* Hero Section */}
      <section className="bg-primary text-white py-16 mb-12 relative">
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-4 text-4xl md:text-6xl font-bold">CSR Partnership</h1>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-xl">Valmiki Samaj Charitable Trust</p>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-lg mt-2 font-medium">Opportunities for Corporate Collaboration & Social Impact</p>
        </div>
      </section>

      <div className="container-main">
        {/* Invitation Message */}
        <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
            <span>🤝</span> Partnership Invitation
          </h2>
          <p className="text-[#45464e] leading-relaxed text-base md:text-lg">
            We invite Corporates, CSR Foundations, Philanthropists, NRI Donors, Trusts, and Government Agencies to partner with us in building a transformative institution for vulnerable children.
          </p>
          <p className="text-[#45464e] leading-relaxed mt-4 text-base md:text-lg">
            By collaborating with the Trust, your organization can channel its Corporate Social Responsibility (CSR) funds directly into verified child welfare, educational infrastructure, healthcare, and sustainable community empowerment projects.
          </p>
        </div>

        {/* Flagship Project Section */}
        <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-4">
            <span>🏗️</span> Paradise Child Home, Modasa
          </h2>
          <div className="bg-[#f8f9fa] border-l-4 border-secondary p-4 italic text-base md:text-lg text-[#1a1c1c] font-semibold mb-4">
            ✨ “Where Every Child Finds Hope, Protection, Education and a Bright Future.”
          </div>
          <p className="text-[#45464e] leading-relaxed text-base md:text-lg">
            Our flagship project, the **Paradise Child Home** in Modasa, is built to provide safe shelter, nutrition, hygiene, digital literacy, and value-based schooling to children under our care. Partners can sponsor building blocks, digital libraries, healthcare labs, or running operational expenses.
          </p>
        </div>

        {/* CSR Focus Areas Grid */}
        <div className="mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h2 className="text-2xl font-bold text-[#061941] flex items-center gap-2 mb-6">
            <span>🎯</span> CSR Focus Areas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "🧸 Child Welfare", desc: "Providing safe shelters, nutrition, clothing, and psychological care for orphan and abandoned children." },
              { title: "📚 Education", desc: "Supporting primary, secondary, and digital schooling alongside moral values and career guidance." },
              { title: "🏥 Healthcare", desc: "Organizing general health check-ups, eye care, nutrition distribution, and sanitation programs." },
              { title: "⚙️ Skill Development", desc: "Conducting technology workshops, vocational classes, and career-readiness training for youth." },
              { title: "👩‍👦 Women & Child Development", desc: "Providing support, protection, and vocational skills to girls and single mothers." },
              { title: "🌱 Sustainable Development Goals (SDGs)", desc: "Direct contribution to SDG 1 (No Poverty), SDG 3 (Health), SDG 4 (Education), and SDG 10 (Reduced Inequalities)." },
              { title: "🏡 Community Development", desc: "Uplifting marginalized communities through health, educational infrastructure, and awareness seminars." }
            ].map((area, idx) => (
              <div key={idx} className="bg-white border border-[#e2e2e2] rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-[#061941] text-base mb-2">{area.title}</h3>
                <p className="text-sm text-[#45464e] leading-relaxed">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Promise Statement */}
        <div className="bg-[#061941] text-white rounded-xl p-8 text-center mb-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h3 className="text-xl font-bold text-secondary mb-4">🌿 Our Promise</h3>
          <p className="italic text-gray-200 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            "We are not merely constructing buildings; we are building futures, transforming lives, and nurturing the leaders of tomorrow."
          </p>
        </div>

        {/* Dual Call to Actions (End) */}
        <div className="bg-white border border-[#e2e2e2] rounded-xl p-8 shadow-sm text-center fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <h3 className="text-xl sm:text-2xl font-bold text-[#061941] mb-2">Get in Touch with Our Partnership Team</h3>
          <p className="text-[#45464e] text-sm md:text-base max-w-xl mx-auto mb-6">
            We will provide details on project budgets, CSR registration certificates, 80G tax exemptions, and reporting frameworks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/contact" 
              className="inline-block bg-[#061941] hover:bg-black text-white hover:scale-105 transition-all px-8 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-sm min-w-[160px]"
            >
              Contact Us
            </Link>
            <Link 
              to="/donate" 
              className="inline-block bg-secondary hover:bg-[#d67b00] text-primary hover:scale-105 transition-all px-8 py-3.5 rounded-full font-bold text-sm sm:text-base shadow-sm min-w-[160px]"
            >
              Donate Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CsrPartnership;
