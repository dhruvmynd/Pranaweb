// Google Analytics Configuration
export const GA_TRACKING_ID = 'G-TVYK0G7RTP';

// Initialize Google Analytics
export const initializeGA = () => {
  if (typeof window !== 'undefined') {
    // Load the Google Analytics script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize the dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(...args: any[]) {
      window.dataLayer.push(arguments);
    };
    
    // Initialize GA with your measurement ID
    window.gtag('js', new Date());
    window.gtag('config', GA_TRACKING_ID, {
      send_page_view: false, // Disable automatic page views
      cookie_flags: 'SameSite=None;Secure',
      cookie_domain: 'vayu-prana.com', // Set cookie domain to root domain
      cookie_update: true,
      page_location: window.location.href
    });
  }
};

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      // Get the pathname and search from the current window location if url is invalid
      let pathname = '/';
      let search = '';

      try {
        // Try to construct a URL object
        const urlObj = new URL(url, window.location.origin);
        pathname = urlObj.pathname;
        search = urlObj.search;
      } catch {
        // If URL construction fails, try to extract pathname directly
        const urlParts = url.split('?');
        pathname = urlParts[0] || '/';
        search = urlParts[1] ? `?${urlParts[1]}` : '';
      }

      // Clean the pathname and search
      pathname = pathname.replace(/[^\w\-./]/g, '');
      search = search.replace(/[^\w\-=&?]/g, '');

      window.gtag('config', GA_TRACKING_ID, {
        page_path: pathname + search,
        page_location: window.location.href,
        send_page_view: true
      });
    } catch (error) {
      // Log error but don't throw to prevent app crashes
      console.warn('GA pageview error:', error);
    }
  }
};

// Track events
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    } catch (error) {
      // Log error but don't throw to prevent app crashes
      console.warn('GA event error:', error);
    }
  }
};