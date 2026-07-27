import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { trackEvent } from '../utils/analytics';

const faqs = [
  {
    question: "How can I become a member of Valmiki Samaj Charitable Trust?",
    answer: "You can apply for membership directly through our website. Once your application is reviewed and approved, you will receive your Membership Certificate.",
    linkText: "Apply for Membership",
    linkUrl: "/register"
  },
  {
    question: "How can I donate to support your causes?",
    answer: "We accept online donations through our secure payment gateway. Your contributions help us fund education, healthcare, and community awareness programs.",
    linkText: "Donate Now",
    linkUrl: "/donate"
  },
  {
    question: "Do you offer internships or volunteer opportunities?",
    answer: "Yes, we regularly offer internships and volunteer programs. After successful completion, participants receive an official Internship Certificate.",
    linkText: "Apply for Internship",
    linkUrl: "/internship"
  },
  {
    question: "How do I apply for beneficiary support?",
    answer: "If you or someone you know needs assistance regarding healthcare, education, or basic needs, you can submit a beneficiary request online.",
    linkText: "Apply for Support",
    linkUrl: "/beneficiary"
  }
];

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const submitEnquiry = trpc.enquiry.submit.useMutation({
    onSuccess: (data) => {
      setSuccessMsg(data.message);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setSuccessMsg(''), 5000);
    },
    onError: (error) => {
      setErrorMsg(error.message);
      setTimeout(() => setErrorMsg(''), 5000);
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    trackEvent('contact_form_submit', { subject: formData.subject || 'no_subject' });
    submitEnquiry.mutate(formData);
  };

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
    <div className="page-section fade-in-section" id="contact">
      {/* Contact Info Cards */}
      <section className="bg-white pt-20">
        <div className="container-main grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border-2 border-primary rounded-xl p-8 flex flex-col items-center text-center group hover:bg-[#f3f3f4] transition-colors">
            <div className="bg-secondary w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined icon-white-lg">location_on</span>
            </div>
            <h3 className="text-primary text-2xl font-bold mb-2">Address</h3>
            <p className="text-[#45464e] font-medium text-base">Head Office :- President Narayan Rathod  Ramji mandir Road, Nr. Police Station At & Post Tintoi - 383250, Tal:- Modasa Dist. Aravalli North Gujrat</p>
          </div>
          <div className="border-2 border-primary rounded-xl p-8 flex flex-col items-center text-center group hover:bg-[#f3f3f4] transition-colors">
            <div className="bg-secondary w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined icon-white-lg">call</span>
            </div>
            <h3 className="text-primary text-2xl font-bold mb-2">Call Us</h3>
            <p className="text-[#45464e] font-medium text-base">+91 82003 15792</p>
          </div>
          <div className="border-2 border-primary rounded-xl p-8 flex flex-col items-center text-center group hover:bg-[#f3f3f4] transition-colors">
            <div className="bg-secondary w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined icon-white-lg">chat</span>
            </div>
            <h3 className="text-primary text-2xl font-bold mb-2">WhatsApp</h3>
            <p className="text-[#45464e] font-medium text-base">+91 82003 15792</p>
          </div>
          <div className="border-2 border-primary rounded-xl p-8 flex flex-col items-center text-center group hover:bg-[#f3f3f4] transition-colors">
            <div className="bg-secondary w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined icon-white-lg">mail</span>
            </div>
            <h3 className="text-primary text-2xl font-bold mb-2">Email Us</h3>
            <p className="text-[#45464e] font-medium text-base break-all">valmikisamajchiritabletrust@gmail.com</p>
          </div>
        </div>
      </section>

      {/* Map and Enquiry Form Section */}
      <section className="bg-white py-20">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column: Map */}
            <div className="flex flex-col">
              <div className="bg-secondary px-6 py-4 rounded-t-xl">
                <h2 className="text-primary text-2xl font-extrabold tracking-wide text-center">Contact Us</h2>
              </div>
              <div className="border-2 border-t-0 border-[#e2e2e2] rounded-b-xl overflow-hidden shadow-sm h-[600px]">
                <iframe allowFullScreen className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=23.6136122,73.33269&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
              </div>
            </div>
            {/* Right Column: Enquiry Form */}
            <div className="bg-white border-2 border-[#e2e2e2] rounded-xl p-8 shadow-sm">
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">contact_support</span>
                <h2 className="text-primary text-3xl font-bold">Contact Us</h2>
              </div>
              <div className="text-center mb-8">
                <p className="text-[#45464e] font-bold text-lg mb-1">संस्था में पूछताछ करने के लिए नीचे दिया गया Enquiry Form भरें।</p>
                <p className="text-muted font-medium">For enquiries, please fill out the form below.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                {successMsg && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-200 text-center font-medium">
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-center font-medium">
                    {errorMsg}
                  </div>
                )}
                <div className="space-y-1">
                  <label className="form-label" htmlFor="fullname">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted">person</span>
                    <input value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border-2 border-[#e2e2e2] rounded-lg focus:border-secondary focus:ring-0 outline-none transition-colors" id="name" placeholder="Enter your full name" type="text" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted">mail</span>
                    <input value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border-2 border-[#e2e2e2] rounded-lg focus:border-secondary focus:ring-0 outline-none transition-colors" id="email" placeholder="Enter your email address" type="email" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="form-label" htmlFor="phone">Phone Number</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted">call</span>
                    <input value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border-2 border-[#e2e2e2] rounded-lg focus:border-secondary focus:ring-0 outline-none transition-colors" id="phone" placeholder="Enter your 10-digit phone number" type="tel" pattern="[0-9]{10}" maxLength={10} title="Phone number must be exactly 10 digits" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="form-label" htmlFor="subject">Subject</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted">label</span>
                    <input value={formData.subject} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border-2 border-[#e2e2e2] rounded-lg focus:border-secondary focus:ring-0 outline-none transition-colors" id="subject" placeholder="Enter subject" type="text" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="form-label" htmlFor="message">Your Message</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-4 text-muted">chat_bubble</span>
                    <textarea value={formData.message} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border-2 border-[#e2e2e2] rounded-lg focus:border-secondary focus:ring-0 outline-none transition-colors h-32" id="message" placeholder="Type your message here..."></textarea>
                  </div>
                </div>
                <button disabled={submitEnquiry.isPending} className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-black transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-50" type="submit">
                  {submitEnquiry.isPending ? "Sending..." : "Send Message"} <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-20">
        <div className="container-main max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-primary text-3xl font-extrabold tracking-tight mb-4">Frequently Asked Questions</h2>
            <p className="text-[#45464e] font-medium text-lg">Find quick answers to common questions about our NGO.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border-2 border-[#e2e2e2] rounded-xl overflow-hidden transition-all shadow-sm hover:border-secondary/50">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-lg text-[#061941] pr-4">{faq.question}</span>
                  <span 
                    className="material-symbols-outlined text-secondary transition-transform duration-300 shrink-0" 
                    style={{ transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    expand_more
                  </span>
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-[#45464e] font-medium leading-relaxed mb-4">{faq.answer}</p>
                  <Link to={faq.linkUrl} className="inline-flex items-center gap-1.5 text-secondary font-bold hover:text-[#d67b00] transition-colors border-b border-transparent hover:border-[#d67b00]">
                    {faq.linkText} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
