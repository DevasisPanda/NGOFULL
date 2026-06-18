import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';

// Eagerly loaded components needed immediately or for layout
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loaded page components
const Home = lazy(() => import('./pages/Home'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const Donate = lazy(() => import('./pages/Donate'));
const Contact = lazy(() => import('./pages/Contact'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Mission = lazy(() => import('./pages/Mission'));
const Projects = lazy(() => import('./pages/Projects'));
const Events = lazy(() => import('./pages/Events'));
const Beneficiaries = lazy(() => import('./pages/Beneficiaries'));
const ViewBeneficiary = lazy(() => import('./pages/ViewBeneficiary'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Audit = lazy(() => import('./pages/Audit'));
const GeneralMembers = lazy(() => import('./pages/GeneralMembers'));
const Campaigns = lazy(() => import('./pages/Campaigns'));
const ProjectExpenses = lazy(() => import('./pages/ProjectExpenses'));
const Internship = lazy(() => import('./pages/Internship'));
const ViewInternship = lazy(() => import('./pages/ViewInternship'));
const ManagementBody = lazy(() => import('./pages/ManagementBody'));
const CertificateVerification = lazy(() => import('./pages/CertificateVerification'));
const IDCardVerification = lazy(() => import('./pages/IDCardVerification'));
const AppointmentLetterVerification = lazy(() => import('./pages/AppointmentLetterVerification'));
const MemberProfile = lazy(() => import('./pages/MemberProfile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Simple loading indicator for Suspense fallback
const PageLoader = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
    <div className="w-12 h-12 border-4 border-t-orange-500 border-r-slate-200 border-b-slate-200 border-l-slate-200 rounded-full animate-spin mb-4"></div>
    <p className="text-slate-500 font-semibold text-sm">Loading page...</p>
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
      <div className="app-container flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex flex-col">
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route element={<PageTransition />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<AboutUs />} />
                  <Route path="/donate" element={<Donate />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/mission" element={<Mission />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/beneficiary" element={<Beneficiaries />} />
                  <Route path="/view-beneficiary" element={<ViewBeneficiary />} />
                  <Route path="/login" element={<SignIn />} />
                  <Route path="/register" element={<SignUp />} />
                  <Route path="/achievements" element={<Achievements />} />
                  <Route path="/certifications" element={<Certifications />} />
                  <Route path="/audit" element={<Audit />} />
                  <Route path="/general-members" element={<GeneralMembers />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="/expenses" element={<ProjectExpenses />} />
                  <Route path="/internship" element={<Internship />} />
                  <Route path="/view-internship" element={<ViewInternship />} />
                  <Route path="/management-body" element={<ManagementBody />} />
                  <Route path="/member/:id" element={<MemberProfile />} />
                  <Route path="/verify/certificate/:code" element={<CertificateVerification />} />
                  <Route path="/verify/idcard/:code" element={<IDCardVerification />} />
                  <Route path="/verify/appointment/:code" element={<AppointmentLetterVerification />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
