const GA_MEASUREMENT_ID = (process.env.REACT_APP_GA_MEASUREMENT_ID || "").trim();

let isInitialized = false;
let lastTrackedPageKey = "";

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function isGoogleAnalyticsEnabled() {
  return GA_MEASUREMENT_ID.length > 0;
}

function loadGoogleTag() {
  if (!isBrowser()) {
    return;
  }

  const existingTag = document.querySelector('script[data-google-analytics="gtag"]');

  if (existingTag) {
    return;
  }

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_MEASUREMENT_ID)}`;
  script.dataset.googleAnalytics = "gtag";

  document.head.appendChild(script);
}

export function initializeGoogleAnalytics() {
  if (!isBrowser() || !isGoogleAnalyticsEnabled() || isInitialized) {
    return;
  }

  loadGoogleTag();

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
  isInitialized = true;
}

export function trackPageView({ pagePath, pageTitle }) {
  if (!isBrowser() || !isGoogleAnalyticsEnabled()) {
    return;
  }

  initializeGoogleAnalytics();

  const pageLocation = `${window.location.origin}${pagePath}`;
  const pageKey = `${pageLocation}::${pageTitle}`;

  if (pageKey === lastTrackedPageKey) {
    return;
  }

  window.gtag("event", "page_view", {
    page_title: pageTitle,
    page_path: pagePath,
    page_location: pageLocation,
  });

  lastTrackedPageKey = pageKey;
}

export function trackAnalyticsEvent(eventName, eventParams = {}) {
  if (!isBrowser() || !isGoogleAnalyticsEnabled()) {
    return;
  }

  initializeGoogleAnalytics();
  window.gtag("event", eventName, eventParams);
}
