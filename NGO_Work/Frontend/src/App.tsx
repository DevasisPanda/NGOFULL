import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';

// Eagerly loaded components needed immediately or for layout
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import GA4PageTracker from './components/GA4PageTracker';
import PageTransition from './components/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Donate = lazy(() => import('./pages/Donate'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Mission = lazy(() => import('./pages/Mission'));
const Impact = lazy(() => import('./pages/Impact'));
const Projects = lazy(() => import('./pages/Projects'));
const Events = lazy(() => import('./pages/Events'));
const Beneficiaries = lazy(() => import('./pages/Beneficiaries'));
const ViewBeneficiary = lazy(() => import('./pages/ViewBeneficiary'));
const SignIn = lazy(() => import('./pages/SignIn'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Audit = lazy(() => import('./pages/Audit'));
const GeneralMembers = lazy(() => import('./pages/GeneralMembers'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const Internship = lazy(() => import('./pages/Internship'));
const ViewInternship = lazy(() => import('./pages/ViewInternship'));
const ManagementBody = lazy(() => import('./pages/ManagementBody'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const CampaignDetail = lazy(() => import('./pages/CampaignDetail'));
const CertificateVerification = lazy(() => import('./pages/CertificateVerification'));
const IDCardVerification = lazy(() => import('./pages/IDCardVerification'));
const AppointmentLetterVerification = lazy(() => import('./pages/AppointmentLetterVerification'));
const MemberProfile = lazy(() => import('./pages/MemberProfile'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const CsrPartnership = lazy(() => import('./pages/CsrPartnership'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Custom oddly rotating square loader for Suspense fallback
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 bg-slate-50/50">
    <div className="relative w-16 h-16 flex items-center justify-center mb-6">
      {/* Outer Glowing Square Frame */}
      <div className="absolute inset-0 border-2 border-[#061941]/20 rounded-2xl animate-odd-glow"></div>
      {/* Inner Oddly Rotating & Morphing Square Box */}
      <div className="w-10 h-10 bg-[#061941] border-2 border-[#fed813] shadow-lg animate-odd-square"></div>
    </div>
    <p className="text-[#061941] font-extrabold text-sm tracking-wider uppercase animate-pulse">
      Valmiki Samaj Charitable Trust
    </p>
    <p className="text-gray-400 font-medium text-xs mt-1">Loading experience...</p>
  </div>
);

function App() {
  const { logout } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('logout') === 'true') {
      logout();
      // Remove query param from URL without refreshing the page
      const newUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [logout]);

  return (
    <Router>
      <Toaster richColors position="top-right" />
      <ScrollToTop />
      <GA4PageTracker />
      <div className="app-container flex flex-col min-h-screen">
        <ErrorBoundary><Header /></ErrorBoundary>
        <main className="flex-1 flex flex-col">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<PageTransition />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/mission" element={<Mission />} />
                  <Route path="/impact" element={<Impact />} />
                  <Route path="/donate" element={<Donate />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/mission" element={<Mission />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/beneficiary" element={<Beneficiaries />} />
                  <Route path="/view-beneficiary" element={<ViewBeneficiary />} />
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/register" element={<SignUp />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/certifications" element={<Certifications />} />
                  <Route path="/audit" element={<Audit />} />
                  <Route path="/general-members" element={<GeneralMembers />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/internship" element={<Internship />} />
                  <Route path="/view-internship" element={<ViewInternship />} />
                  <Route path="/management-body" element={<ManagementBody />} />
                  <Route path="/project/:id" element={<ProjectDetail />} />
                  <Route path="/campaigns/:id" element={<CampaignDetail />} />
                  <Route path="/member/:id" element={<MemberProfile />} />
                  <Route path="/volunteer" element={<Volunteer />} />
                  <Route path="/csr-partnership" element={<CsrPartnership />} />
                  <Route path="/verify/certificate/:code" element={<CertificateVerification />} />
                  <Route path="/verify/idcard/:code" element={<IDCardVerification />} />
                  <Route path="/verify/appointment/:code" element={<AppointmentLetterVerification />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <ErrorBoundary><Footer /></ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
