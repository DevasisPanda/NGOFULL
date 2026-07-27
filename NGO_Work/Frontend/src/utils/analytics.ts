/**
 * Google Analytics 4 - Custom Event Tracking Helper
 *
 * Usage:
 *   import { trackEvent } from '../utils/analytics';
 *   trackEvent('donate_click', { page: 'home', amount: '500' });
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Send a custom event to GA4.
 * @param eventName - Name of the event (e.g., 'donate_click', 'contact_form_submit')
 * @param params - Optional key-value pairs for event parameters
 */
export function trackEvent(eventName: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Track a button click with standard parameters.
 * @param buttonName - Descriptive name of the button
 * @param pagePath - The page where the button was clicked
 */
export function trackButtonClick(buttonName: string, pagePath?: string) {
  trackEvent('button_click', {
    button_name: buttonName,
    page_path: pagePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
  });
}
