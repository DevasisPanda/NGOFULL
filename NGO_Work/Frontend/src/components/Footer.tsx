import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | null>(null);

  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-8 border-t-4 border-secondary">
      <div className="container-main grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
        {/* About Column */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className="text-[24px] font-bold text-secondary border-b border-gray-700 pb-2 inline-block">About</h3>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors" href="https://www.facebook.com/share/19A2tuUpJN/" target="_blank" rel="noreferrer">
              <FaFacebookF className="w-5 h-5 fill-current" />
            </a>
            <a className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors" href="https://www.instagram.com/valmikisamajcharitable" target="_blank" rel="noreferrer">
              <FaInstagram className="w-5 h-5 fill-current" />
            </a>
            <a className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors" href="https://youtube.com/@valmikisamajarvalli" target="_blank" rel="noreferrer">
              <FaYoutube className="w-5 h-5 fill-current" />
            </a>
            <a className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors" href="https://www.linkedin.com/in/valmiki-samaj-charitable-trust-valmiki-samaj-arvalli-919415355" target="_blank" rel="noreferrer">
              <FaLinkedinIn className="w-5 h-5 fill-current" />
            </a>
          </div>
          <ul className="space-y-3 mt-4 text-gray-400">
            <li><Link className="nav-link" to="/"><span className="material-symbols-outlined text-sm">chevron_right</span> Home</Link></li>
            <li><Link className="nav-link" to="/about"><span className="material-symbols-outlined text-sm">chevron_right</span> About Us</Link></li>
            <li><Link className="nav-link" to="/mission"><span className="material-symbols-outlined text-sm">chevron_right</span> Mission & Vision</Link></li>
            <li><Link className="nav-link" to="/"><span className="material-symbols-outlined text-sm">chevron_right</span> Management Body</Link></li>
          </ul>
        </div>
        
        {/* Quick Links Column */}
        <div className="lg:col-span-3">
          <h3 className="text-[24px] font-bold text-secondary border-b border-gray-700 pb-2 inline-block">Quick Links</h3>
          <ul className="space-y-3 mt-6 text-gray-400">
            <li><Link className="nav-link" to="/projects"><span className="material-symbols-outlined text-sm">chevron_right</span> Our Projects</Link></li>
            <li><Link className="nav-link" to="/events"><span className="material-symbols-outlined text-sm">chevron_right</span> Programs & Events</Link></li>
            <li><Link className="nav-link" to="/gallery"><span className="material-symbols-outlined text-sm">chevron_right</span> Activity Gallery</Link></li>
            <li><Link className="nav-link" to="/campaigns"><span className="material-symbols-outlined text-sm">chevron_right</span> Campaigns</Link></li>
          </ul>
          <h3 className="text-[24px] font-bold text-secondary border-b border-gray-700 pb-2 inline-block mt-8">Policies</h3>
          <ul className="space-y-3 mt-6 text-gray-400">
            <li>
              <button 
                onClick={() => setActiveModal('terms')} 
                className="nav-link text-left w-full cursor-pointer bg-transparent border-0 p-0 hover:text-[#ed8901]"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span> Terms & Conditions
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveModal('privacy')} 
                className="nav-link text-left w-full cursor-pointer bg-transparent border-0 p-0 hover:text-[#ed8901]"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span> Privacy Policy
              </button>
            </li>
          </ul>
        </div>
        
        {/* Contact Details Column */}
        <div className="lg:col-span-4">
          <h3 className="text-[24px] font-bold text-secondary border-b border-gray-700 pb-2 inline-block">Contact Details</h3>
          <ul className="space-y-4 mt-6 text-gray-400">
            <li className="flex items-start gap-3 min-w-0">
              <span className="material-symbols-outlined text-secondary shrink-0">call</span>
              <a href="tel:+918200315792" className="hover:text-secondary transition-colors text-sm break-words">
                +91 82003 15792
              </a>
            </li>
            <li className="flex items-start gap-3 min-w-0">
              <span className="material-symbols-outlined text-secondary shrink-0">mail</span>
              <a href="mailto:valmikisamajchiritabletrust@gmail.com" className="hover:text-secondary transition-colors text-[13px] md:text-sm whitespace-nowrap">
                valmikisamajchiritabletrust@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3 min-w-0">
              <span className="material-symbols-outlined text-secondary shrink-0">location_on</span>
              <span className="text-sm text-gray-400 leading-relaxed">
                President Narayan Rathod, Ramji mandir Road, Nr. Police Station, At & Post Tintoi - 383250, Tal:- Modasa, Dist. Aravalli, North Gujarat
              </span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container-main pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Valmiki Samaj Charitable Trust. All Rights Reserved.</p>
        <p className="text-xs text-gray-600 mt-2">Create by Star Marketing</p>
      </div>

      {/* Terms & Conditions / Privacy Policy Modal */}
      {activeModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setActiveModal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative border border-gray-100 max-h-[80vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            {/* Heading */}
            <h2 className="text-2xl font-extrabold text-[#00123a] mb-4 pr-10 border-b border-gray-100 pb-3">
              {activeModal === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'}
            </h2>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto text-gray-600 space-y-4 pr-2 text-sm md:text-base leading-relaxed">
              {activeModal === 'terms' ? (
                <div className="space-y-6 text-slate-700">
                  <div className="border-b border-gray-100 pb-2">
                    <p className="text-xs text-[#ed8901] font-semibold tracking-wider uppercase">Effective Date: 1 January 2026</p>
                  </div>
                  
                  <p className="text-sm md:text-base leading-relaxed">
                    Welcome to the official website of <strong>Valmiki Samaj Charitable Trust</strong>. By accessing, browsing, or using this website, you agree to comply with and be bound by these Terms & Conditions. These terms are designed to ensure transparency, accountability, digital security, and a safe online experience for all visitors, donors, volunteers, beneficiaries, and community members.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">2. Acceptance of Terms</h4>
                      <p className="text-sm leading-relaxed">By using this website, you agree to use it lawfully, ethically, and responsibly while complying with all applicable laws and regulations.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">3. Intellectual Property Rights</h4>
                      <p className="text-sm leading-relaxed">All content, including the Trust's name, logo, photographs, videos, articles, publications, graphics, documents, and website design, are the exclusive property of Valmiki Samaj Charitable Trust and may not be copied, reproduced, modified, distributed, or commercially used without prior written permission.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">4. Donations & Transparency Policy</h4>
                      <p className="text-sm leading-relaxed mb-2">All donations made through this website are voluntary and will be used exclusively for charitable purposes.</p>
                      <p className="text-sm font-semibold text-slate-800 mb-1">The Trust is committed to:</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Financial transparency</li>
                        <li>Ethical utilization of funds</li>
                        <li>Donor confidentiality</li>
                        <li>Publishing authorized reports and updates</li>
                      </ul>
                      <p className="text-sm leading-relaxed mt-2">Donations are generally non-refundable except in cases of technical errors or where required by law.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">5. User Responsibilities</h4>
                      <p className="text-sm font-semibold text-slate-800 mb-1">Users shall not:</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>Upload false or misleading information</li>
                        <li>Engage in unlawful or unethical activities</li>
                        <li>Attempt unauthorized access to website systems</li>
                        <li>Introduce viruses, malware, or harmful software</li>
                        <li>Misuse website services</li>
                      </ul>
                      <p className="text-sm leading-relaxed mt-2">Violations may result in suspension of access and legal action.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">6. Privacy & Data Protection</h4>
                      <p className="text-sm leading-relaxed">The Trust respects your privacy and protects your personal information, including names, email addresses, contact numbers, donation details, and volunteer registration information. Personal information will never be sold, rented, or misused.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">7. AI, Digital Technology & Cyber Security (2026)</h4>
                      <p className="text-sm leading-relaxed mb-2">To enhance user experience, this website may utilize:</p>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        <li>AI-powered assistance</li>
                        <li>Secure cloud infrastructure</li>
                        <li>Digital analytics</li>
                        <li>Advanced cyber security systems</li>
                        <li>Mobile-responsive services</li>
                      </ul>
                      <p className="text-sm leading-relaxed mt-2">Any attempt to disrupt, manipulate, hack, or compromise the website is strictly prohibited.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">8. Third-Party Links</h4>
                      <p className="text-sm leading-relaxed">This website may contain links to external websites for informational purposes. Valmiki Samaj Charitable Trust is not responsible for their content, privacy policies, accuracy, or security practices.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">9. Disclaimer</h4>
                      <p className="text-sm leading-relaxed">The information provided on this website is for general informational purposes only. While we strive to keep information accurate and updated, the Trust makes no warranties regarding the accuracy, completeness, reliability, or availability of the content. The Trust shall not be liable for any damages arising from the use of this website.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">10. Indemnification</h4>
                      <p className="text-sm leading-relaxed">You agree to indemnify and hold harmless Valmiki Samaj Charitable Trust, its trustees, office bearers, employees, volunteers, advisors, and affiliates from any claims, losses, liabilities, or expenses arising from your use of this website or violation of these Terms & Conditions.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">11. Governing Law, Updates & Jurisdiction</h4>
                      <p className="text-sm leading-relaxed">These Terms & Conditions shall be governed by the laws of India. Valmiki Samaj Charitable Trust reserves the right to modify or update these Terms & Conditions at any time without prior notice. Any dispute, claim, or legal proceeding arising from the use of this website, donations, services, or related matters shall be subject to the exclusive jurisdiction of the competent courts located in Modasa – 383315, Aravalli District, Gujarat, India.</p>
                    </div>
                  </div>

                  {/* Contact Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-6 space-y-3">
                    <h4 className="font-bold text-[#00123a] text-[16px]">📞 Contact Information</h4>
                    <div className="text-sm space-y-2 text-slate-600">
                      <p><strong>Valmiki Samaj Charitable Trust</strong></p>
                      <p className="flex items-start gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">location_on</span>
                        <span>Ramji Mandir Road, Near Police Station, Tintoi, Taluka Modasa, Aravalli District – 383315, Gujarat, India.</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">call</span>
                        <span>+91 82003 15792</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">mail</span>
                        <span>info@valmikisamajcharitabletrust.org</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">public</span>
                        <span>www.valmikisamajcharitabletrust.org</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                        <span>Monday to Saturday | 9:00 AM – 6:00 PM (IST)</span>
                      </p>
                    </div>
                  </div>

                  {/* Motto block */}
                  <div className="bg-orange-50/50 border-l-4 border-[#ed8901] rounded-r-xl p-4 mt-6 text-center space-y-2">
                    <p className="font-bold text-[#00123a] text-sm">🌿 Our Motto</p>
                    <p className="italic text-slate-700 text-sm">“Service to Humanity is Service to God.”</p>
                    <p className="font-medium text-xs text-slate-500">“Education • Empowerment • Equality • Environment • Excellence”</p>
                    <p className="text-xs text-slate-600 font-semibold pt-1 border-t border-orange-100/50">
                      Valmiki Samaj Charitable Trust — Building an Educated, Empowered, Compassionate and Prosperous Society for Future Generations.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-slate-700">
                  <div className="border-b border-gray-100 pb-2">
                    <p className="text-xs text-[#ed8901] font-semibold tracking-wider uppercase">Effective Date: 1 January 2026</p>
                  </div>
                  
                  <p className="text-sm md:text-base leading-relaxed">
                    Welcome to the official website of <strong>Valmiki Samaj Charitable Trust</strong>. We value your trust and are committed to protecting your privacy, safeguarding your personal information, and ensuring a secure, transparent, and positive digital experience for all visitors, donors, volunteers, beneficiaries, and community members. This Privacy Policy explains how we collect, use, store, protect, and manage the information you provide while using our website.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">1. Information We Collect</h4>
                      <p className="text-sm leading-relaxed">We may collect information necessary to provide our services and improve your experience, including your name, email address, mobile number, postal address, donation information, volunteer registration details, communication preferences, and website usage analytics.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">2. How We Use Your Information</h4>
                      <p className="text-sm leading-relaxed">We may use your information to process donations securely, respond to inquiries, register volunteers and participants, provide updates regarding Trust activities and events, improve website functionality, maintain transparency, and comply with legal obligations.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">3. Sharing of Information</h4>
                      <p className="text-sm leading-relaxed">Valmiki Samaj Charitable Trust does not sell, rent, trade, or misuse your personal information. Information may only be shared when required by law, with authorized service providers assisting the Trust, to protect the safety and security of the Trust, or with your explicit consent.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">4. Data Security</h4>
                      <p className="text-sm leading-relaxed">We implement appropriate administrative, technical, and physical safeguards to protect personal information from unauthorized access, disclosure, alteration, misuse, or destruction. However, no method of internet transmission or electronic storage can be guaranteed to be completely secure, and therefore absolute security cannot be guaranteed.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">5. Your Rights and Choices</h4>
                      <p className="text-sm leading-relaxed">You have the right to access, update, correct, or request deletion of your personal information by contacting us. You may also unsubscribe from promotional emails, newsletters, or other communications at any time.</p>
                    </div>

                    {/* Sensitive Beneficiary Privacy Card */}
                    <div className="bg-red-50/50 border border-red-100 rounded-xl p-5 mt-4 space-y-3">
                      <h4 className="font-bold text-red-900 text-[16px] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[20px]">shield</span>
                        6. Privacy Protection of Orphan Children & Mass Marriage Beneficiaries
                      </h4>
                      <div className="text-sm text-slate-700 space-y-2 leading-relaxed">
                        <p>Valmiki Samaj Charitable Trust is fully committed to protecting the privacy, dignity, safety, and well-being of all children and beneficiaries under its care.</p>
                        <p>To safeguard their rights, the Trust does not publicly disclose, publish, share, or display any personal information, identity details, contact information, residential addresses, educational records, medical records, financial information, government identification documents, or any other confidential data relating to children residing at <strong>Paradise Children Home</strong> or beneficiaries participating in <strong>Mass Marriage Ceremonies for Orphaned and Underprivileged Daughters</strong>.</p>
                        <p>Any photographs, videos, testimonials, stories, or promotional materials published on this website will only be used with appropriate authorization and in a manner that protects the dignity, privacy, and best interests of the beneficiaries.</p>
                        <p className="font-semibold text-red-800">The unauthorized collection, copying, downloading, reproduction, sharing, distribution, or misuse of any beneficiary-related information from this website is strictly prohibited and may result in legal action.</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">7. Children's Privacy</h4>
                      <p className="text-sm leading-relaxed">This website is not intended for children under the age of 13, and we do not knowingly collect personal information from children under 13 years of age. If such information is discovered, appropriate steps will be taken to remove it promptly.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">8. Updates to This Privacy Policy</h4>
                      <p className="text-sm leading-relaxed">Valmiki Samaj Charitable Trust reserves the right to modify, update, or revise this Privacy Policy at any time without prior notice to reflect changes in legal requirements, technology, or organizational practices. Users are encouraged to review this page periodically.</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-[#00123a] text-[16px] mb-1">9. Contact Us</h4>
                      <p className="text-sm leading-relaxed font-semibold">If you have any questions, concerns, or requests regarding this Privacy Policy or our data protection practices, please contact us.</p>
                    </div>
                  </div>

                  {/* Contact Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mt-6 space-y-3">
                    <h4 className="font-bold text-[#00123a] text-[16px]">📞 Contact Information</h4>
                    <div className="text-sm space-y-2 text-slate-600">
                      <p><strong>Valmiki Samaj Charitable Trust</strong></p>
                      <p className="flex items-start gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">location_on</span>
                        <span>Ramji Mandir Road, Near Police Station, Tintoi, Taluka Modasa, Aravalli District – 383315, Gujarat, India.</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">call</span>
                        <span>+91 82003 15792</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">mail</span>
                        <span>info@valmikisamajcharitabletrust.org</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">public</span>
                        <span>www.valmikisamajcharitabletrust.org</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
                        <span>Monday to Saturday | 9:00 AM – 6:00 PM (IST)</span>
                      </p>
                    </div>
                  </div>

                  {/* Motto block */}
                  <div className="bg-orange-50/50 border-l-4 border-[#ed8901] rounded-r-xl p-4 mt-6 text-center space-y-2">
                    <p className="font-bold text-[#00123a] text-sm">🌿 Our Commitment</p>
                    <p className="text-xs text-slate-700">Thank you for placing your trust in Valmiki Samaj Charitable Trust. We are committed to protecting privacy, ensuring transparency, safeguarding children and beneficiaries, and providing a secure, respectful, and positive digital experience for everyone.</p>
                    <p className="italic text-slate-700 text-sm font-semibold pt-2 border-t border-orange-100/50">“Service to Humanity is Service to God.”</p>
                    <p className="font-medium text-xs text-slate-500">“Education • Empowerment • Equality • Environment • Excellence”</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer / Action */}
            <div className="mt-6 border-t border-gray-100 pt-4 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="bg-secondary text-primary font-bold px-6 py-2.5 rounded-lg shadow-sm hover:bg-opacity-95 transition-colors duration-200 text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default React.memo(Footer);
