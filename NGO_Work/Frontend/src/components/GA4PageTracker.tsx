import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Tracks SPA page views on route changes by sending page_view events to GA4.
 * Place this inside <Router> alongside <ScrollToTop />.
 */
export default function GA4PageTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, [location.pathname, location.search]);

  return null;
}
