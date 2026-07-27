import React from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../lib/trpc';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';
import { trackButtonClick } from '../utils/analytics';

const imageMap: Record<string, string> = {};

const Home: React.FC = () => {
  const { data: settings } = trpc.homepage.getSettings.useQuery(undefined, {
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  const { data: projectsData, isLoading: isProjectsLoading } = trpc.project.getAll.useQuery();

  useFadeInOnScroll();

  // Slider state and responsive layout state
  const [currentHeroSlide, setCurrentHeroSlide] = React.useState(0);
  const [currentDonateCard, setCurrentDonateCard] = React.useState(0);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dynamic variables with fallback defaults
  const heroTitle = settings?.heroTitle || "Valmiki Samaj Charitable Trust";
  const heroDescription = settings?.heroDescription || "";
  const showDonateButton = (settings as any)?.showDonateButton !== undefined ? (settings as any).showDonateButton : true;

  const heroSlides = [
    settings?.heroImage,
    (settings as any)?.heroImage2,
    (settings as any)?.heroImage3,
    (settings as any)?.heroImage4,
    (settings as any)?.heroImage5
  ].filter(Boolean) as string[];

  if (heroSlides.length === 0) {
    heroSlides.push("https://res.cloudinary.com/dxmovdiru/image/upload/v1782201374/ngo-management/ngikldnfngyuo9suxhpm.jpg");
  }

  React.useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const quickLinks = [
    { text: settings?.quickLink1Text || "Generate ID Card", url: settings?.quickLink1Url || "#" },
    { text: settings?.quickLink2Text || "Appointment Letter", url: settings?.quickLink2Url || "#" },
    { text: settings?.quickLink3Text || "Generate Certificate", url: settings?.quickLink3Url || "#" },
    { text: settings?.quickLink4Text || "Donate Us", url: settings?.quickLink4Url || "/donate" },
  ];

  const donateSmileCards = [
    {
      title: settings?.donateSmileTitle || "Dream Project",
      content: settings?.donateSmileContent || "Empower orphaned and vulnerable children at Paradise Child Home with a safe home, quality education, and holistic development for a bright future.",
      image: settings?.donateSmileImage || "https://res.cloudinary.com/dxmovdiru/image/upload/v1782201376/ngo-management/jkzrj6we849h5ifwgqfr.jpg",
    },
    {
      title: (settings as any)?.donateSmileTitle2 || "Celebration",
      content: (settings as any)?.donateSmileContent2 || "Bring joy to underprivileged children on your special occasions. Sponsor meals, education, and care to turn your happiness into hope and lasting smiles.",
      image: (settings as any)?.donateSmileImage2 || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
    },
    {
      title: (settings as any)?.donateSmileTitle3 || "Wings of Hope",
      content: (settings as any)?.donateSmileContent3 || "Give children the opportunity to learn and grow. Empower them through education, mentorship, and healthcare to achieve their dreams with dignity.",
      image: (settings as any)?.donateSmileImage3 || "https://res.cloudinary.com/dxmovdiru/image/upload/v1782201377/ngo-management/sqod7jftqs0dvtgva9ks.jpg",
    },
    {
      title: (settings as any)?.donateSmileTitle4 || "Education Support",
      content: (settings as any)?.donateSmileContent4 || "Help children with school uniforms, notebooks, bags, and tuition fees to build their career.",
      image: (settings as any)?.donateSmileImage4 || "",
    },
    {
      title: (settings as any)?.donateSmileTitle5 || "Women Empowerment",
      content: (settings as any)?.donateSmileContent5 || "Empower women through self-employment opportunities and vocational training programs.",
      image: (settings as any)?.donateSmileImage5 || "",
    }
  ].filter(card => card.title || card.image);

  let visibleCards = 1;
  if (windowWidth >= 1024) visibleCards = 3;
  else if (windowWidth >= 768) visibleCards = 2;

  const maxIndex = Math.max(0, donateSmileCards.length - visibleCards);

  React.useEffect(() => {
    if (donateSmileCards.length <= visibleCards) return;
    const timer = setInterval(() => {
      setCurrentDonateCard((prev) => {
        if (prev >= maxIndex) return 0;
        return prev + 1;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [donateSmileCards.length, visibleCards, maxIndex]);

  const handleNextCard = () => {
    setCurrentDonateCard((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };
  const handlePrevCard = () => {
    setCurrentDonateCard((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  return (
    <div className="flex-grow bg-[#f8f9fa] pb-20">
      
      {/* Hero Section with crossfading slides */}
      <section className="relative w-full flex items-center justify-center fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 bg-black overflow-hidden h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[80vh] min-h-[300px]" id="home">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentHeroSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {/* Subtle overlay for text readability */}
        <div className="absolute inset-0 bg-black/30 z-5"></div>
        
        {/* Static text overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 xl:px-[8%] z-10 text-white">
          {showDonateButton && (
            <div className="mt-6 flex">
              <Link to="/donate" onClick={() => trackButtonClick('donate_now_hero', '/home')} className="bg-secondary text-primary px-5 py-2.5 sm:px-8 sm:py-3.5 md:px-10 md:py-4 rounded-full font-bold text-xs sm:text-sm md:text-lg hover:bg-[#d67b00] hover:scale-105 transition-all duration-300 shadow-xl border md:border-2 border-white whitespace-nowrap">
                Donate Now
              </Link>
            </div>
          )}
        </div>

        {/* Hero Slide dots */}
        {heroSlides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentHeroSlide ? "bg-secondary w-6" : "bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Quick Links & About Section */}
      <section className="py-20 container-main fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0" id="about">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Quick Links Grid */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-[24px] font-bold text-secondary mb-6 border-b-2 border-primary pb-2 inline-block">Quick Links</h2>
            {quickLinks.map((link, idx) => {
              const isExternal = link.url.startsWith('http') || link.url.startsWith('www') || link.url.includes('//');
              if (isExternal) {
                return (
                  <a 
                    key={idx} 
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-between bg-white p-4 rounded hover:bg-[#e2e2e2] transition-colors border-l-4 border-secondary shadow-sm"
                  >
                    <span className="font-bold text-[14px] text-primary">{link.text}</span>
                    <span className="material-symbols-outlined text-secondary text-sm">open_in_new</span>
                  </a>
                );
              }
              return (
                <Link 
                  key={idx} 
                  to={link.url} 
                  className="flex items-center justify-between bg-white p-4 rounded hover:bg-[#e2e2e2] transition-colors border-l-4 border-secondary shadow-sm"
                >
                  <span className="font-bold text-[14px] text-primary">{link.text}</span>
                  <span className="material-symbols-outlined text-secondary">arrow_forward</span>
                </Link>
              );
            })}
          </div>
          {/* About Content */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-[32px] font-bold text-secondary mb-4 border-b-2 border-primary pb-2 inline-block">About Valmiki Samaj Charitable Trust</h2>
            <p className="text-body">
              Valmiki Samaj Charitable Trust is dedicated to serving humanity through education, social welfare, and community development. Inspired by the teachings of His Holiness Pramukh Swami Maharaj, the Trust supports poor, orphaned, and underprivileged individuals with dignity and compassion. It promotes quality education, helps school dropouts return to learning, and encourages higher studies. The Trust also provides shelter, healthcare, and value-based upbringing for orphaned children. Through community marriage initiatives and self-employment support, it empowers economically disadvantaged women to become independent. With service, values, and dedication at its core, the Trust works for the welfare, unity, and progress of society.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded hover:opacity-90 transition-colors font-bold text-[14px]">
              <span className="material-symbols-outlined">info</span> Know More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Goals Section */}
      <section className="py-20 bg-white fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0" id="goals">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold text-secondary mb-4 border-b-2 border-primary pb-2 inline-block">Goals Of Valmiki Samaj Charitable Trust</h2>
            <p className="text-[16px] text-muted max-w-3xl mx-auto mt-4">Our goals are aligned with our vision of creating an equitable, just, and sustainable society. We focus on areas where we can make the most significant impact, ensuring that our efforts bring about real and lasting change.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isProjectsLoading ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
                Loading goals...
              </div>
            ) : !projectsData || projectsData.length === 0 ? (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 text-gray-500">
                No goals currently configured.
              </div>
            ) : (
              projectsData.slice(0, 3).map((project) => {
                const imgSrc = project.image 
                  ? (imageMap[project.image] || project.image)
                  : 'https://via.placeholder.com/400x300?text=No+Image';

                return (
                  <div className="bg-[#f8f9fa] rounded-xl shadow-sm border border-[#e2e2e2] hover:shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full overflow-hidden" key={project.id}>
                    <Link to={`/project/${project.id}`} className="block overflow-hidden h-48 relative group">
                      <img 
                        alt={project.title} 
                        className="card-img w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        src={imgSrc} 
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                    </Link>
                    
                    <div className="card-content flex-1 flex flex-col p-6">
                      <Link to={`/project/${project.id}`} className="hover:text-[#ed8901] transition-colors block mb-3">
                        <h3 className="text-xl font-bold text-primary">{project.title}</h3>
                      </Link>
                      <p className="text-muted-sm whitespace-pre-wrap line-clamp-3 mb-6 flex-grow">{project.description}</p>
                      
                      <Link 
                        to={`/project/${project.id}`} 
                        className="inline-flex items-center text-secondary font-bold hover:text-primary transition-colors text-sm mt-auto self-start group"
                      >
                        Read More 
                        <span className="material-symbols-outlined text-[18px] ml-1 group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="mt-8 text-center">
            <Link to="/projects" className="inline-block bg-white text-primary border border-primary px-8 py-3 rounded-full font-bold hover:bg-[#f3f3f4] transition-colors">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Organization Members Teaser */}
      <section className="py-20 container-main fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0" id="members">
        <div className="text-center mb-12">
          <h2 className="text-[32px] font-bold text-secondary mb-4 border-b-2 border-primary pb-2 inline-block">Organization Members</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-secondary text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
              <span className="material-symbols-outlined text-3xl">groups</span>
            </div>
            <h3 className="text-[24px] font-bold text-primary mb-4">Management Body</h3>
            <p className="text-[16px] text-muted mb-6">Explore the members of our Management Committee who lead and support the mission of the organization.</p>
            <Link to="/management-body" className="bg-primary text-white px-6 py-2 rounded-full font-bold text-[14px] hover:opacity-90 transition-colors inline-block">See Management Body</Link>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border-t-4 border-secondary text-center">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
              <span className="material-symbols-outlined text-3xl">people</span>
            </div>
            <h3 className="text-[24px] font-bold text-primary mb-4">General Members</h3>
            <p className="text-[16px] text-muted mb-6">Discover the dedicated members who strengthen our initiatives &amp; contribute to the growth &amp; success of the organization.</p>
            <Link to="/general-members" className="bg-primary text-white px-6 py-2 rounded-full font-bold text-[14px] hover:opacity-90 transition-colors inline-block">See General Members</Link>
          </div>
        </div>
      </section>

      {/* Donate For Smile / Campaigns Slider */}
      <section className="py-20 bg-white fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0" id="donate">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="text-[32px] font-bold text-secondary mb-4 border-b-2 border-primary pb-2 inline-block">Donate For Smile</h2>
          </div>
          
          <div className="relative w-full px-0 sm:px-12">
            {/* Slider track container */}
            <div className="overflow-hidden w-full">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentDonateCard * (100 / visibleCards)}%)`,
                }}
              >
                {donateSmileCards.map((card, idx) => (
                  <div 
                    key={idx} 
                    className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
                  >
                    <div className="bg-[#f8f9fa] rounded-xl shadow-md border border-[#e2e2e2] overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300">
                      <img alt={card.title} className="w-full h-48 sm:h-56 object-cover" src={card.image} />
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>
                        <p className="text-sm text-muted mb-6 flex-1 line-clamp-4">{card.content}</p>
                        <Link to="/donate" onClick={() => trackButtonClick(`donate_card_${card.title}`, '/home')} className="bg-secondary text-primary text-center py-3 rounded-lg font-bold text-sm hover:bg-[#d67b00] transition-colors mt-auto block">
                          Donate Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Arrows */}
            {donateSmileCards.length > visibleCards && (
              <>
                <button
                  onClick={handlePrevCard}
                  className="absolute left-[-15px] sm:left-0 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-gray-200 transition-all z-10 cursor-pointer"
                  aria-label="Previous card"
                >
                  <span className="material-symbols-outlined font-bold">chevron_left</span>
                </button>
                <button
                  onClick={handleNextCard}
                  className="absolute right-[-15px] sm:right-0 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white text-primary w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-gray-200 transition-all z-10 cursor-pointer"
                  aria-label="Next card"
                >
                  <span className="material-symbols-outlined font-bold">chevron_right</span>
                </button>
              </>
            )}

            {/* Slider Dots */}
            {donateSmileCards.length > visibleCards && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentDonateCard(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === currentDonateCard ? "bg-secondary w-5" : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Banner */}
      <section className="bg-primary py-12 fade-in-section opacity-0 translate-y-5 transition-all duration-800 ease-out [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0">
        <div className="container-main text-center flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-[32px] font-bold text-white mb-4 md:mb-0">Every child deserves a safe home !</h2>
          <Link to="/contact" className="bg-secondary text-primary px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2">
            <span className="material-symbols-outlined">mail</span> Contact Us Now
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
