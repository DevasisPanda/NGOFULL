import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { trpc } from '../lib/trpc';
import { toast } from 'sonner';

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const createHandoffMutation = trpc.auth.createHandoff.useMutation();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const { data: newsItems } = trpc.news.list.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const rawNews = newsItems && newsItems.length > 0
    ? newsItems
    : [{ id: 0, text: "Stay Connected and Informed: Empowering Lives, Transforming Communities!", link: "" }];

  // To prevent visual gaps or jumps when there are only 1-2 items,
  // we repeat the items so the marquee content is sufficiently wide.
  const activeNews: Array<{ id: number; text: string; link: string | null; uniqueKey: string }> = [];
  if (rawNews.length > 0) {
    let index = 0;
    while (activeNews.length < 12) {
      for (const item of rawNews) {
        activeNews.push({
          id: item.id,
          text: item.text,
          link: item.link || null,
          uniqueKey: `${item.id}-${index++}`,
        });
      }
    }
  }

  // Speed up if only 1-2 unique news items, otherwise slower crawl
  const uniqueCount = rawNews.length;
  const marqueeDuration = uniqueCount <= 2 ? '12s' : uniqueCount <= 4 ? '22s' : '32s';

  const renderMarqueeContent = () => {
    return activeNews.map((item) => (
      <React.Fragment key={item.uniqueKey}>
        <span className="px-8">
          {item.link ? (
            <Link to={item.link} className="hover:underline hover:text-secondary transition">
              {item.text}
            </Link>
          ) : (
            item.text
          )}
        </span>
        <span className="px-8 text-secondary font-bold">●</span>
      </React.Fragment>
    ));
  };

  const handleDashboardRedirect = async () => {
    if (isRedirecting) return;
    setIsRedirecting(true);
    const toastId = toast.loading("Connecting to your dashboard...");
    try {
      const { handoffCode } = await createHandoffMutation.mutateAsync();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      toast.dismiss(toastId);
      window.location.href = `${apiUrl}/sso?code=${handoffCode}&role=${user?.role || 'user'}`;
    } catch (error: any) {
      console.error("SSO Handoff error:", error);
      toast.error(error.message || "Failed to log in securely. Please try again.", { id: toastId });
      setIsRedirecting(false);
    }
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');

  const languages = [
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w20/gb.png' },
    { code: 'hi', name: 'Hindi', flag: 'https://flagcdn.com/w20/in.png' },
    { code: 'gu', name: 'Gujarati', flag: 'https://flagcdn.com/w20/in.png' }
  ];

  // Helper function to read cookie value
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  // Sync with cookies on mount
  React.useEffect(() => {
    const googtrans = getCookie('googtrans');
    if (googtrans) {
      const parts = googtrans.split('/');
      const targetLang = parts[parts.length - 1]; // e.g. hi, gu, en
      const matched = languages.find(l => l.code === targetLang);
      if (matched) {
        setSelectedLang(matched.name);
      }
    }
  }, []);

  const handleLanguageChange = (lang: { code: string; name: string }) => {
    setSelectedLang(lang.name);
    setIsLangDropdownOpen(false);

    // Set cookie for Google Translate
    // Standard format for googtrans is: /original_language/target_language
    const cookieValue = `/en/${lang.code}`;
    
    // Set cookie on main domain and paths
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
    
    // Try to trigger the Google Translate dropdown directly if present
    const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = lang.code;
      selectEl.dispatchEvent(new Event('change'));
    }
    
    // Reload the page to ensure complete and clean translation across React virtual DOM
    window.location.reload();
  };

  const currentLang = languages.find(l => l.name === selectedLang) || languages[0];

  const toggleDropdown = (menu: string) => {
    if (openDropdown === menu) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(menu);
    }
  };

  return (
    <header className="w-full bg-white flex flex-col z-50 shadow-sm">
      {/* Top Bar - Hidden on Mobile to save space */}
      <div className="bg-secondary text-white hidden md:flex items-center h-10 w-full">
        <div className="max-w-[1536px] w-full mx-auto px-4 lg:px-8 flex items-center justify-between h-full">
          {/* Social Icons */}
          <div className="flex items-center gap-2 h-full shrink-0">
            <a className="bg-white text-[#061941] rounded-full w-6 h-6 flex items-center justify-center hover:opacity-90 transition-opacity" href="https://www.facebook.com/share/19A2tuUpJN/" target="_blank" rel="noreferrer">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z"></path></svg>
            </a>
            <a className="bg-white text-[#061941] rounded-full w-6 h-6 flex items-center justify-center hover:opacity-90 transition-opacity" href="https://www.instagram.com/valmikisamajcharitable" target="_blank" rel="noreferrer">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"></path></svg>
            </a>
            <a className="bg-white text-[#061941] rounded-full w-6 h-6 flex items-center justify-center hover:opacity-90 transition-opacity" href="https://youtube.com/@valmikisamajarvalli" target="_blank" rel="noreferrer">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
            </a>
            <a className="bg-white text-[#061941] rounded-full w-6 h-6 flex items-center justify-center hover:opacity-90 transition-opacity" href="https://www.linkedin.com/in/valmiki-samaj-charitable-trust-valmiki-samaj-arvalli-919415355" target="_blank" rel="noreferrer">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
          </div>
          {/* Ticker */}
          <div className="flex-1 min-w-0 flex items-center overflow-hidden bg-white h-full mx-6 lg:mx-12">
            <div className="bg-[#061941] text-white px-4 h-full flex items-center gap-2 whitespace-nowrap z-10 shrink-0 font-bold text-[13px]">
              <span className="material-symbols-outlined text-[16px]">bolt</span> News & Updates
            </div>
            <div className="overflow-hidden flex-1 min-w-0 text-[#061941] h-full flex items-center font-medium px-4 text-sm whitespace-nowrap">
              <div className="flex animate-marquee w-max" style={{ animationDuration: marqueeDuration }}>
                <div className="flex shrink-0">
                  {renderMarqueeContent()}
                </div>
                <div className="flex shrink-0">
                  {renderMarqueeContent()}
                </div>
              </div>
            </div>
          </div>
          {/* Phone */}
          <div className="h-full font-bold flex items-center gap-2 text-white shrink-0 text-sm">
            <span className="material-symbols-outlined text-[18px]">call</span> +91 82003 15792
          </div>
        </div>
      </div>
      
      {/* Branding Row */}
      <div className="w-full bg-white py-4">
        <div className="max-w-[1536px] w-full mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
          <Link to="/" className="flex flex-row items-center gap-3 md:gap-4 w-full md:w-auto">
            <img alt="Valmiki Samaj Trust Logo" className="h-[45px] w-[45px] md:h-[60px] md:w-[60px] object-contain shrink-0" src="/logo.jpg" />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-[#061941] text-[18px] sm:text-[22px] lg:text-[28px] font-extrabold tracking-tight leading-tight">Valmiki Samaj Charitable Trust</h1>
              <p className="text-secondary font-bold text-[10px] sm:text-[12px] lg:text-[14px] mt-0.5">( सेवा, शिक्षा, संस्कार और आत्मनिर्भरता। )</p>
            </div>
          </Link>
          <div className="flex flex-row items-center justify-between sm:justify-end w-full sm:w-auto gap-2 sm:gap-4">
            <div className="flex flex-row items-center justify-start gap-1.5 sm:gap-3">
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={handleDashboardRedirect}
                    disabled={isRedirecting}
                    className="bg-[#061941] text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold flex items-center gap-1.5 sm:gap-2 hover:bg-black transition-colors text-[12px] sm:text-sm shadow-md disabled:opacity-50"
                  >
                    {isRedirecting ? 'Connecting...' : 'Dashboard'} <span className="material-symbols-outlined text-[14px] sm:text-[18px]">dashboard</span>
                  </button>
                  <button 
                    onClick={logout}
                    className="bg-red-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold flex items-center gap-1.5 sm:gap-2 hover:bg-red-700 transition-colors text-[12px] sm:text-sm shadow-md"
                  >
                    Logout <span className="material-symbols-outlined text-[14px] sm:text-[18px]">logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/register" className="bg-[#061941] text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold flex items-center gap-1.5 sm:gap-2 hover:bg-black transition-colors text-[12px] sm:text-sm shadow-md">
                    <span className="hidden sm:inline">Apply For Membership</span>
                    <span className="sm:hidden">Apply</span>
                    <span className="material-symbols-outlined text-[14px] sm:text-[18px]">account_circle</span>
                  </Link>
                  <Link to="/login" className="bg-[#061941] text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-full font-bold flex items-center gap-1.5 sm:gap-2 hover:bg-black transition-colors text-[12px] sm:text-sm shadow-md">
                    Login <span className="material-symbols-outlined text-[14px] sm:text-[18px]">how_to_reg</span>
                  </Link>
                </>
              )}
            </div>
            <div className="flex flex-col items-center sm:ml-2 sm:border-l border-gray-200 sm:pl-4 relative">
              <div className="hidden sm:block bg-secondary text-white px-3 py-0.5 rounded text-[10px] sm:text-[11px] font-bold mb-1.5">Translate This Website</div>
              <div 
                className="border border-gray-300 rounded px-2 sm:px-3 py-1 flex items-center gap-1 sm:gap-2 text-[11px] sm:text-[13px] bg-white cursor-pointer w-[90px] sm:w-[120px] justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <img alt={`${currentLang.name} Flag`} className="w-4 sm:w-5 h-3 sm:h-3.5 object-cover rounded-sm shadow-sm" src={currentLang.flag} />
                  <span className="font-medium text-gray-700">{currentLang.name}</span>
                </div>
                <span className="material-symbols-outlined text-[14px] sm:text-[18px] text-gray-500">{isLangDropdownOpen ? 'expand_less' : 'expand_more'}</span>
              </div>
              
              {/* Language Dropdown Menu */}
              {isLangDropdownOpen && (
                <div className="absolute top-[100%] right-0 mt-1 w-[120px] bg-white border border-gray-200 rounded shadow-lg z-50 overflow-hidden">
                  {languages.map(lang => (
                    <div 
                      key={lang.code}
                      className="px-3 py-2 flex items-center gap-2 hover:bg-gray-50 cursor-pointer text-[12px] sm:text-[13px] transition-colors"
                      onClick={() => handleLanguageChange(lang)}
                    >
                      <img alt={`${lang.name} Flag`} className="w-5 h-3.5 object-cover rounded-sm shadow-sm" src={lang.flag} />
                      <span className={`font-medium ${selectedLang === lang.name ? 'text-secondary' : 'text-gray-700'}`}>{lang.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <div className="bg-[#061941] text-white w-full border-t border-gray-700/50 relative">
        <div className="max-w-[1536px] w-full mx-auto px-4 lg:px-8 flex items-center justify-between h-14 xl:h-auto gap-4">
          
          {/* Mobile Menu Toggle */}
          <button 
            className="xl:hidden text-white flex items-center justify-center p-2 rounded focus:outline-none hover:bg-gray-800 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-[28px]">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center justify-between flex-1 gap-1 xl:gap-2.5 2xl:gap-4 text-[10.5px] xl:text-[11.5px] 2xl:text-[13.5px] font-bold text-white whitespace-nowrap">
            <Link to="/" className="hover:text-secondary transition-colors py-4">Home</Link>
            
            <div className="flex items-center gap-1 cursor-pointer hover:text-secondary transition-colors relative group py-4">
              <span>About Us</span>
              <span className="material-symbols-outlined text-[14px] lg:text-[16px]">expand_more</span>
              <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                <div className="bg-white text-primary shadow-lg rounded-b py-2 w-48 border-t-2 border-secondary">
                  <Link to="/about" className="dropdown-link">About Us</Link>
                  <Link to="/mission" className="dropdown-link">Mission & Vision</Link>
                  <Link to="/impact" className="dropdown-link">Our Impact</Link>
                  <Link to="/achievements" className="dropdown-link">Achievements</Link>
                  <Link to="/certifications" className="dropdown-link">Certifications</Link>
                  <Link to="/audit" className="dropdown-link">Audit</Link>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 cursor-pointer hover:text-secondary transition-colors relative group py-4">
              <span>Organization Members</span>
              <span className="material-symbols-outlined text-[14px] lg:text-[16px]">expand_more</span>
              <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                <div className="bg-white text-primary shadow-lg rounded-b py-2 w-48 border-t-2 border-secondary">
                  <Link to="/management-body" className="dropdown-link">Management Body</Link>
                  <Link to="/general-members" className="dropdown-link">General Members</Link>
                </div>
              </div>
            </div>

            <Link to="/projects" className="hover:text-secondary transition-colors py-4">Our Projects</Link>
            <Link to="/gallery" className="hover:text-secondary transition-colors py-4">Activity Gallery</Link>
            <Link to="/campaigns" className="hover:text-secondary transition-colors py-4">Campaigns</Link>
            <Link to="/events" className="hover:text-secondary transition-colors py-4">Program & Events</Link>

            <div className="flex items-center gap-1 cursor-pointer hover:text-secondary transition-colors relative group py-4">
              <span>Internships</span>
              <span className="material-symbols-outlined text-[14px] lg:text-[16px]">expand_more</span>
              <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                <div className="bg-white text-primary shadow-lg rounded-b py-2 w-48 border-t-2 border-secondary">
                  <Link to="/internship" className="dropdown-link">Apply for Internship</Link>
                  <Link to="/view-internship" className="dropdown-link">View Certificate</Link>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 cursor-pointer hover:text-secondary transition-colors relative group py-4">
              <span>Beneficiaries</span>
              <span className="material-symbols-outlined text-[14px] lg:text-[16px]">expand_more</span>
              <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                <div className="bg-white text-primary shadow-lg rounded-b py-2 w-48 border-t-2 border-secondary">
                  <Link to="/beneficiary" className="dropdown-link">Apply Beneficiary</Link>
                  <Link to="/view-beneficiary" className="dropdown-link">View Beneficiary</Link>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 cursor-pointer hover:text-secondary transition-colors relative group py-4">
              <span>Get Involved</span>
              <span className="material-symbols-outlined text-[14px] lg:text-[16px]">expand_more</span>
              <div className="absolute top-full left-0 pt-2 hidden group-hover:block z-50">
                <div className="bg-white text-primary shadow-lg rounded-b py-2 w-52 border-t-2 border-secondary">
                  <Link to="/volunteer" className="dropdown-link">Become A Volunteer</Link>
                  <Link to="/csr-partnership" className="dropdown-link">CSR Partnership</Link>
                </div>
              </div>
            </div>

            <Link to="/contact" className="hover:text-secondary transition-colors py-4">Contact Us</Link>
          </nav>

          <Link to="/donate" className="bg-secondary text-white px-5 lg:px-8 py-1.5 lg:py-2.5 rounded-full font-bold hover:bg-[#d67b00] transition-colors text-[12px] lg:text-sm tracking-wide shrink-0 shadow-md">
            Donate Us
          </Link>
        </div>

        {/* Mobile Nav Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden absolute top-full left-0 w-full bg-[#061941] border-t border-gray-700/50 z-50 flex flex-col shadow-xl max-h-[80vh] overflow-y-auto">
            <Link to="/" className="px-6 py-3 border-b border-gray-700/50 font-bold hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            
            <div className="flex flex-col border-b border-gray-700/50">
              <button className="flex items-center justify-between px-6 py-3 font-bold hover:bg-gray-800 transition-colors" onClick={() => toggleDropdown('about')}>
                <span>About Us</span>
                <span className="material-symbols-outlined">{openDropdown === 'about' ? 'expand_less' : 'expand_more'}</span>
              </button>
              {openDropdown === 'about' && (
                <div className="bg-[#0a2560] flex flex-col text-sm py-2">
                  <Link to="/about" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
                  <Link to="/mission" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>Mission & Vision</Link>
                  <Link to="/impact" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>Our Impact</Link>
                  <Link to="/achievements" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>Achievements</Link>
                  <Link to="/certifications" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>Certifications</Link>
                  <Link to="/audit" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>Audit</Link>
                </div>
              )}
            </div>

            <div className="flex flex-col border-b border-gray-700/50">
              <button className="flex items-center justify-between px-6 py-3 font-bold hover:bg-gray-800 transition-colors" onClick={() => toggleDropdown('org')}>
                <span>Organization Members</span>
                <span className="material-symbols-outlined">{openDropdown === 'org' ? 'expand_less' : 'expand_more'}</span>
              </button>
              {openDropdown === 'org' && (
                <div className="bg-[#0a2560] flex flex-col text-sm py-2">
                  <Link to="/management-body" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>Management Body</Link>
                  <Link to="/general-members" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>General Members</Link>
                </div>
              )}
            </div>

            <Link to="/projects" className="px-6 py-3 border-b border-gray-700/50 font-bold hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Our Projects</Link>
            <Link to="/gallery" className="px-6 py-3 border-b border-gray-700/50 font-bold hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Activity Gallery</Link>
            <Link to="/campaigns" className="px-6 py-3 border-b border-gray-700/50 font-bold hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Campaigns</Link>
            <Link to="/events" className="px-6 py-3 border-b border-gray-700/50 font-bold hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Program & Events</Link>

            <div className="flex flex-col border-b border-gray-700/50">
              <button className="flex items-center justify-between px-6 py-3 font-bold hover:bg-gray-800 transition-colors" onClick={() => toggleDropdown('involved')}>
                <span>Get Involved</span>
                <span className="material-symbols-outlined">{openDropdown === 'involved' ? 'expand_less' : 'expand_more'}</span>
              </button>
              {openDropdown === 'involved' && (
                <div className="bg-[#0a2560] flex flex-col text-sm py-2">
                  <Link to="/volunteer" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>Become A Volunteer</Link>
                  <Link to="/csr-partnership" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>CSR Partnership</Link>
                </div>
              )}
            </div>

            <div className="flex flex-col border-b border-gray-700/50">
              <button className="flex items-center justify-between px-6 py-3 font-bold hover:bg-gray-800 transition-colors" onClick={() => toggleDropdown('intern')}>
                <span>Internships</span>
                <span className="material-symbols-outlined">{openDropdown === 'intern' ? 'expand_less' : 'expand_more'}</span>
              </button>
              {openDropdown === 'intern' && (
                <div className="bg-[#0a2560] flex flex-col text-sm py-2">
                  <Link to="/internship" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>Apply for Internship</Link>
                  <Link to="/view-internship" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>View Certificate</Link>
                </div>
              )}
            </div>

            <div className="flex flex-col border-b border-gray-700/50">
              <button className="flex items-center justify-between px-6 py-3 font-bold hover:bg-gray-800 transition-colors" onClick={() => toggleDropdown('bene')}>
                <span>Beneficiaries</span>
                <span className="material-symbols-outlined">{openDropdown === 'bene' ? 'expand_less' : 'expand_more'}</span>
              </button>
              {openDropdown === 'bene' && (
                <div className="bg-[#0a2560] flex flex-col text-sm py-2">
                  <Link to="/beneficiary" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>Apply Beneficiary</Link>
                  <Link to="/view-beneficiary" className="nav-link-padding" onClick={() => setIsMobileMenuOpen(false)}>View Beneficiary</Link>
                </div>
              )}
            </div>

            <Link to="/contact" className="px-6 py-3 font-bold hover:bg-gray-800 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default React.memo(Header);
