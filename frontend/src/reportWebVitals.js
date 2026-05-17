/**
 * Utility function to measure and report on the "Web Vitals" performance metrics.
 * Web Vitals is a library from Google to help measure user experience on the web.
 * @param {Function} onPerfEntry - Callback function to handle the performance metrics.
 */
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Dynamically import 'web-vitals' to avoid bloat in the main bundle
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry); // Cumulative Layout Shift
      getFID(onPerfEntry); // First Input Delay
      getFCP(onPerfEntry); // First Contentful Paint
      getLCP(onPerfEntry); // Largest Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

export default reportWebVitals;

