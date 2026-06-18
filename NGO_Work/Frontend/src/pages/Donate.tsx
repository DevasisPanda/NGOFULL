import React from 'react';

const Donate: React.FC = () => {
  return (
    <div className="flex-grow flex items-center justify-center py-20 px-6 relative overflow-hidden bg-[#f8f9fa]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-[#f3f3f4] -z-10 skew-y-3 origin-top-left"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-20 left-10 w-48 h-48 bg-primary/5 rounded-full blur-2xl -z-10"></div>
      
      <div className="w-full max-w-[500px] bg-white rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-[#e2e2e2] overflow-hidden relative z-10">
        {/* Card Header */}
        <div className="p-12 pb-6 text-center border-b border-[#e2e2e2]">
          <img alt="Trust Logo" className="w-24 h-24 mx-auto object-cover rounded-full shadow-sm mb-6 border-2 border-[#e2e2e2]" src="/logo.jpg" />
          <div className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-secondary text-3xl">volunteer_activism</span>
            <h1 className="heading-section">Support Our<br />Mission</h1>
          </div>
        </div>
        
        {/* Form Body */}
        <div className="p-12 pt-6">
          <form action="#" className="space-y-6" method="POST">
            <div className="space-y-4">
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="input-icon-container">
                  <span className="material-symbols-outlined icon-primary">person</span>
                </div>
                <input className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none" name="fullName" placeholder="Enter Your Name" type="text" />
              </div>
              
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="input-icon-container">
                  <span className="material-symbols-outlined icon-primary">mail</span>
                </div>
                <input className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none" name="email" placeholder="Enter Your Email ID" type="email" />
              </div>
              
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="input-icon-container">
                  <span className="material-symbols-outlined icon-primary">call</span>
                </div>
                <input className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none" name="phone" placeholder="Enter Mobile Number" type="tel" />
              </div>
              
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="input-icon-container">
                  <span className="text-primary/70 font-bold px-1">₹</span>
                </div>
                <input className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none" name="amount" placeholder="Enter Amount" type="number" />
              </div>
              
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="input-icon-container">
                  <span className="material-symbols-outlined icon-primary">volunteer_activism</span>
                </div>
                <select className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none text-[#45464e] appearance-none">
                  <option value="">Purpose of Donation</option>
                  <option value="education">Education</option>
                  <option value="health">Health</option>
                </select>
              </div>
              
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="input-icon-container">
                  <span className="material-symbols-outlined icon-primary">location_on</span>
                </div>
                <input className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none" name="address" placeholder="Enter Address" type="text" />
              </div>
              
              <div className="py-2 text-center">
                <p className="text-[14px] font-bold text-[#1a1c1c]">If you want to claim Tax Deduction under Section 80G, please fill the fields below or leave blank</p>
                <p className="text-[14px] font-bold text-[#1a1c1c]">यदि आप धारा 80G के अंतर्गत टैक्स छूट प्राप्त करना चाहते हैं, तो नीचे दिए गए फ़ील्ड भरें या खाली छोड़ दें।</p>
              </div>
              
              <div className="flex border border-[#c5c6cf] rounded-lg overflow-hidden">
                <div className="input-icon-container">
                  <span className="material-symbols-outlined icon-primary">badge</span>
                </div>
                <input className="flex-1 bg-white border-none px-4 py-[12px] focus:ring-0 outline-none" name="pan" placeholder="PAN Number" type="text" />
              </div>
              
              <button className="w-full flex justify-center items-center font-bold py-[14px] px-6 rounded-lg transition-colors duration-200 mt-4 bg-secondary hover:bg-opacity-90 text-primary" type="submit">
                Donate Now
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
