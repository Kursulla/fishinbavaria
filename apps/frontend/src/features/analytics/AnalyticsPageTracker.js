import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageTitle } from "./pageMetadata";
import { trackPageView } from "./googleAnalytics";

function AnalyticsPageTracker() {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname, location.search);
    const pagePath = `${location.pathname}${location.search}${location.hash}`;

    document.title = pageTitle;
    trackPageView({
      pagePath,
      pageTitle,
    });
  }, [location.hash, location.pathname, location.search]);

  return null;
}

export default AnalyticsPageTracker;
