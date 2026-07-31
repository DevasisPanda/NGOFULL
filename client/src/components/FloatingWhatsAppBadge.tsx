import React from 'react';

export const FloatingWhatsAppBadge: React.FC = () => {
  const whatsappUrl = "https://wa.me/919024548020?text=Hello%20Valmiki%20Samaj%20Charitable%20Trust";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 z-[9999] block transition-transform duration-300 hover:scale-105 active:scale-95 shadow-2xl rounded-2xl overflow-hidden group"
      title="Contact Us on WhatsApp - 9024548020"
    >
      <img
        src="/Work1.jpeg"
        alt="Official Partner - Starbiz360"
        className="h-12 sm:h-14 md:h-16 w-auto object-contain rounded-2xl shadow-2xl border border-slate-900/30"
      />
    </a>
  );
};

export default FloatingWhatsAppBadge;
