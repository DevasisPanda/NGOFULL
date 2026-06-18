import React, { useEffect } from 'react';
import { trpc } from '../lib/trpc';
import AG1 from '../assets/AG1.jpeg';
import AG2 from '../assets/AG2.jpeg';
import AG3 from '../assets/AG3.jpeg';
import AG4 from '../assets/AG4.jpeg';
import AG5 from '../assets/AG5.jpeg';
import AG6 from '../assets/AG6.jpeg';
import AG7 from '../assets/AG7.jpeg';

const Gallery: React.FC = () => {
  const { data: galleryItems, isLoading } = trpc.gallery.getPublic.useQuery();

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
  }, [galleryItems]);

  const hasLiveItems = galleryItems && galleryItems.length > 0;

  const renderCardContent = (item: any) => {
    return (
      <>
        {item.mediaType === 'video' ? (
          <video 
            src={item.imageUrl} 
            className="w-full h-full object-cover aspect-video sm:aspect-auto" 
            muted 
            loop 
            playsInline 
            autoPlay 
          />
        ) : (
          <img 
            alt={item.title} 
            className="w-full h-full object-cover aspect-video sm:aspect-auto group-hover:scale-105 transition-transform duration-500" 
            src={item.imageUrl} 
          />
        )}
        
        {/* Play indicator overlay for videos */}
        {item.mediaType === 'video' && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-1 rounded-full flex items-center justify-center text-white z-20">
            <span className="material-symbols-outlined text-[18px]">play_circle</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end text-white z-10">
          <span className="text-[10px] font-extrabold tracking-wider uppercase text-secondary mb-1.5 inline-block">
            {item.category || 'General'}
          </span>
          <h4 className="font-bold text-base sm:text-lg leading-tight mb-1">{item.title}</h4>
          
          {item.redirectUrl && (
            <span className="text-[10px] text-secondary font-bold flex items-center gap-1 mt-1 mb-2">
              <span className="material-symbols-outlined text-[12px]">link</span> Click to visit link
            </span>
          )}

          {item.description && (
            <p className="text-xs text-gray-200 opacity-90 line-clamp-2 mt-1 font-medium">{item.description}</p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="page-section fade-in-section overflow-x-hidden w-full" id="gallery">
      <section className="bg-primary text-white py-16 md:py-20 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container-main text-center relative z-10">
          <h1 className="text-secondary mb-4 text-4xl md:text-6xl font-bold">Activity Gallery</h1>
          <p className="text-white opacity-90 max-w-2xl mx-auto text-xl">Glimpses of our mission in action, showcasing our impact and the communities we serve.</p>
        </div>
      </section>

      <div className="container-main">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : hasLiveItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
            {galleryItems.map((item, index) => {
              // Create a masonry effect by making certain cards larger
              const isLarge = index === 0 || index === 5 || index === 8;
              const cardClassName = `${
                isLarge ? 'sm:col-span-2 sm:row-span-2' : 'col-span-1'
              } rounded-xl overflow-hidden shadow-sm relative group bg-white border border-gray-100 min-h-[220px]`;

              if (item.redirectUrl) {
                return (
                  <a 
                    key={item.id} 
                    href={item.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cardClassName} block cursor-pointer`}
                  >
                    {renderCardContent(item)}
                  </a>
                );
              }

              return (
                <div 
                  key={item.id} 
                  className={cardClassName}
                >
                  {renderCardContent(item)}
                </div>
              );
            })}
          </div>
        ) : (
          /* Static Fallback Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
            <div className="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-sm relative group">
              <img alt="Gallery Activity" className="w-full h-full object-cover aspect-[1.47] group-hover:scale-105 transition-transform duration-500" src={AG1} />
            </div>
            <div className="col-span-2 rounded-xl overflow-hidden shadow-sm relative group">
              <img alt="Gallery Activity" className="w-full h-full object-cover aspect-[1.79] group-hover:scale-105 transition-transform duration-500" src={AG2} />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm relative group">
              <img alt="Gallery Activity" className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500" src={AG3} />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm relative group">
              <img alt="Gallery Activity" className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500" src={AG4} />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm relative group">
              <img alt="Gallery Activity" className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500" src={AG5} />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm relative group">
              <img alt="Gallery Activity" className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500" src={AG6} />
            </div>
            <div className="rounded-xl overflow-hidden shadow-sm relative group">
              <img alt="Gallery Activity" className="w-full h-full object-cover aspect-square group-hover:scale-105 transition-transform duration-500" src={AG7} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
