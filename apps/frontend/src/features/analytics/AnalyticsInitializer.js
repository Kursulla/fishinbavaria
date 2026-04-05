import { useEffect } from "react";
import { initializeGoogleAnalytics } from "./googleAnalytics";

function AnalyticsInitializer() {
  useEffect(() => {
    initializeGoogleAnalytics();
  }, []);

  return null;
}

export default AnalyticsInitializer;
