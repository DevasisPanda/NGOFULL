import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Impact: React.FC = () => {
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

  const contributionTiers = [
    { amount: '₹501', label: 'Support a Child', icon: '👶', desc: 'Provides essential nutrition and basic care for a child in need.' },
    { amount: '₹1,001', label: 'Educational Kit', icon: '📚', desc: 'Covers books, uniforms, and learning supplies for an underprivileged student.' },
    { amount: '₹2,501', label: 'Nutrition Support', icon: '🍲', desc: 'Ensures healthy meals and nutrition packages for vulnerable families.' },
    { amount: '₹5,001', label: 'Orphan Care', icon: '🏡', desc: 'Supports complete shelter, healthcare, and guidance at Paradise Child Home.' },
    { amount: '₹11,001', label: 'Education Sponsorship', icon: '🎓', desc: 'Full annual educational sponsorship including tuition and competitive exam prep.' },
  ];

  return (
    <div className="page-section fade-in-section overflow-x-hidden" id="impact">
      {/* Hero Banner */}
      <section className="bg-primary text-white py-16 mb-12 relative">
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-4 text-4xl md:text-6xl font-bold flex items-center justify-center gap-3">
            <span>🌍</span> Our Impact
          </h1>
          <p className="text-white opacity-90 max-w-3xl mx-auto text-xl font-medium">
            Creating Hope • Empowering Lives • Building a Better Tomorrow
          </p>
          <p className="text-white/80 max-w-3xl mx-auto text-base mt-4 leading-relaxed">
            At Valmiki Samaj Charitable Trust, we are committed to transforming lives through education, orphan care, women's empowerment, healthcare, and sustainable community development. Every donation, volunteer effort, and partnership helps us build a brighter future where every child is protected, every woman is empowered, and every family can live with dignity and hope.
          </p>
        </div>
      </section>

      <div className="container-main">
        {/* Flagship Initiative Banner: Paradise Child Home */}
        <div className="bg-gradient-to-br from-[#061941] to-[#0a2560] text-white rounded-3xl p-8 md:p-12 mb-16 shadow-xl relative overflow-hidden fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/40 text-secondary px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
              <span>🏡</span> Flagship Initiative
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Paradise Child Home at Modasa District Aravalli
            </h2>
            <p className="text-white/90 text-lg leading-relaxed font-light mb-6">
              Our flagship initiative aims to provide orphaned and vulnerable children with a safe home, nutritious food, quality education, healthcare, emotional support, life skills, sports, cultural activities, and a nurturing environment where they can grow into confident and responsible citizens.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-semibold">🏠 Safe Shelter</span>
              <span className="bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-semibold">🍲 Nutritious Food</span>
              <span className="bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-semibold">🎓 Quality Education</span>
              <span className="bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-semibold">🩺 Healthcare</span>
              <span className="bg-white/10 text-white px-3 py-1 rounded-lg text-xs font-semibold">⚽ Sports & Life Skills</span>
            </div>
          </div>
        </div>

        {/* Impact Pillars Grid */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#061941] mb-3">Key Focus Areas & Impact Pillars</h2>
            <p className="text-[#45464e]">How your support creates tangible, lasting change across society.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
            
            {/* 1. Education for Every Child */}
            <div className="bg-white border border-[#e2e2e2] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  📚
                </div>
                <h3 className="text-xl font-bold text-[#061941] mb-3">Education for Every Child</h3>
                <p className="text-[#45464e] text-sm leading-relaxed">
                  We believe education is the strongest foundation for social transformation. Our initiatives focus on school enrollment, scholarships, books, uniforms, digital learning, career guidance, competitive exam support, and value-based education to ensure that no child is left behind.
                </p>
              </div>
            </div>

            {/* 2. Women's Empowerment */}
            <div className="bg-white border border-[#e2e2e2] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  👩
                </div>
                <h3 className="text-xl font-bold text-[#061941] mb-3">Women's Empowerment</h3>
                <p className="text-[#45464e] text-sm leading-relaxed">
                  We empower women through vocational training, tailoring and sewing programs, digital literacy, entrepreneurship, financial awareness, leadership development, and self-employment opportunities, helping them become economically independent.
                </p>
              </div>
            </div>

            {/* 3. Support for Orphan Girls */}
            <div className="bg-white border border-[#e2e2e2] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  💍
                </div>
                <h3 className="text-xl font-bold text-[#061941] mb-3">Support for Orphan Girls</h3>
                <p className="text-[#45464e] text-sm leading-relaxed">
                  We are dedicated to supporting orphan and underprivileged young women through group marriage assistance, essential household kits, skill development, career guidance, and long-term rehabilitation to help them build secure and dignified futures.
                </p>
              </div>
            </div>

            {/* 4. Healthcare & Community Welfare */}
            <div className="bg-white border border-[#e2e2e2] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  ❤️
                </div>
                <h3 className="text-xl font-bold text-[#061941] mb-3">Healthcare & Community Welfare</h3>
                <p className="text-[#45464e] text-sm leading-relaxed">
                  Our healthcare initiatives include medical assistance, health awareness programs, blood donation drives, free health check-up camps, nutrition support, emergency relief, and community wellness activities that improve the quality of life for vulnerable families.
                </p>
              </div>
            </div>

            {/* 5. Food & Nutrition */}
            <div className="bg-white border border-[#e2e2e2] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  🍲
                </div>
                <h3 className="text-xl font-bold text-[#061941] mb-3">Food & Nutrition</h3>
                <p className="text-[#45464e] text-sm leading-relaxed">
                  We strive to ensure that children and needy families receive nutritious meals, food assistance, and essential support that promotes healthy growth and well-being.
                </p>
              </div>
            </div>

            {/* 6. Skill Development & Career Support */}
            <div className="bg-white border border-[#e2e2e2] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  🧵
                </div>
                <h3 className="text-xl font-bold text-[#061941] mb-3">Skill Development & Career Support</h3>
                <p className="text-[#45464e] text-sm leading-relaxed">
                  Our skill development programs include computer education, digital skills, vocational training, career counselling, personality development, and employment guidance to help youth achieve sustainable livelihoods.
                </p>
              </div>
            </div>

            {/* 7. Community Development */}
            <div className="bg-white border border-[#e2e2e2] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  🌱
                </div>
                <h3 className="text-xl font-bold text-[#061941] mb-3">Community Development</h3>
                <p className="text-[#45464e] text-sm leading-relaxed">
                  Through social awareness campaigns, environmental initiatives, volunteer engagement, youth leadership programs, humanitarian relief, and community partnerships, we work to build stronger, healthier, and more inclusive communities.
                </p>
              </div>
            </div>

            {/* 8. Transparency & Accountability */}
            <div className="bg-white border border-[#e2e2e2] rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-2">
              <div>
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-5">
                  🛡️
                </div>
                <h3 className="text-xl font-bold text-[#061941] mb-3">Transparency & Accountability</h3>
                <p className="text-[#45464e] text-sm leading-relaxed">
                  We are committed to maintaining the highest standards of transparency, ethical governance, financial accountability, and responsible utilization of every donation. Regular audits, donor communication, and project updates ensure complete trust and confidence.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Razorpay Donation & Tax Section */}
        <div className="bg-[#f8f9fa] border border-[#e2e2e2] rounded-3xl p-8 md:p-12 mb-16 shadow-sm fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="bg-secondary/10 text-secondary border border-secondary/30 px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3 inline-block">
              💳 Secure Online Donations
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#061941] mb-4">
              Support Our Mission Through Razorpay
            </h2>
            <p className="text-[#45464e] text-base leading-relaxed">
              Your generosity can transform lives. Make a secure online donation through Razorpay and help us provide education, orphan care, healthcare, women's empowerment, and community welfare initiatives.
            </p>
          </div>

          {/* Payment Methods & 80G Tax Badges */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h4 className="font-bold text-[#061941] text-base mb-3 flex items-center gap-2">
                <span>🔒</span> Safe & Convenient Payment Options
              </h4>
              <ul className="space-y-2 text-sm text-[#45464e]">
                <li className="flex items-center gap-2">💳 Credit & Debit Cards</li>
                <li className="flex items-center gap-2">🏦 Net Banking</li>
                <li className="flex items-center gap-2">📱 UPI (Google Pay, PhonePe, BHIM, Paytm & more)</li>
                <li className="flex items-center gap-2">📲 Mobile Wallets</li>
                <li className="flex items-center gap-2">🌍 International Cards (if enabled)</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-[#061941] text-base mb-3 flex items-center gap-2">
                  <span>✨</span> Donor Security & Benefits
                </h4>
                <ul className="space-y-2.5 text-sm text-[#45464e]">
                  <li className="flex items-center gap-2">⚡ <strong>Instant Payment Confirmation</strong></li>
                  <li className="flex items-center gap-2">📧 <strong>Digital Donation Receipt</strong></li>
                  <li className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                    🎁 Eligible Donations Receive 80G Tax Benefits (where applicable)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Choose Contribution Tier */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-[#061941] text-center mb-6">
              ❤️ Choose Your Contribution
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {contributionTiers.map((tier, idx) => (
                <Link
                  key={idx}
                  to={`/donate?amount=${tier.amount.replace('₹', '').replace(',', '')}&purpose=${encodeURIComponent(tier.label)}`}
                  className="bg-white border-2 border-gray-200 hover:border-secondary hover:shadow-md rounded-2xl p-4 text-center transition-all group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-2xl mb-1 block">{tier.icon}</span>
                    <span className="text-xl font-extrabold text-[#061941] group-hover:text-secondary transition-colors block">
                      {tier.amount}
                    </span>
                    <span className="text-xs font-bold text-gray-600 block mt-1">
                      {tier.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-2 block">Click to Donate</span>
                </Link>
              ))}
              <Link
                to="/donate"
                className="bg-secondary text-white rounded-2xl p-4 text-center transition-all shadow-sm hover:bg-[#d47b00] flex flex-col items-center justify-center"
              >
                <span className="text-2xl mb-1">💝</span>
                <span className="text-base font-extrabold block">Custom</span>
                <span className="text-xs font-medium block">Amount</span>
              </Link>
            </div>
          </div>

          {/* Real Impact Summary List */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
            <h4 className="font-bold text-[#061941] text-base mb-4 text-center">
              🌟 Your Donation Creates Real Impact
            </h4>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-[#45464e]">
              <div className="flex items-center gap-2">🏡 Protects vulnerable children</div>
              <div className="flex items-center gap-2">📚 Supports education for students</div>
              <div className="flex items-center gap-2">👩 Empowers women through skills</div>
              <div className="flex items-center gap-2">💍 Assists orphan girls</div>
              <div className="flex items-center gap-2">❤️ Provides healthcare assistance</div>
              <div className="flex items-center gap-2">🌱 Strengthens communities</div>
            </div>
          </div>

          {/* Big CTA Button */}
          <div className="text-center">
            <Link
              to="/donate"
              className="bg-secondary hover:bg-[#d47b00] text-white px-10 py-4 rounded-full text-lg font-extrabold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-3 transform hover:-translate-y-0.5"
            >
              <span>🔘</span> Donate Securely with Razorpay
            </Link>
            <p className="text-xs text-gray-500 mt-3">
              Together, we can build a future where every child is safe, every woman is empowered, every family has hope, and every act of kindness creates lasting change.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Impact;
