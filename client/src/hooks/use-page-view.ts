import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

export function usePageView(): void {
  const [location] = useLocation();
  const sessionStartTime = useRef<number>(Date.now());

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
        const browserInfo = `${navigator.userAgent}`;

        const response = await fetch("/api/analytics/pageview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pagePath: location,
            sessionDuration,
            browserInfo,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Page view tracked successfully:", data);
      } catch (error) {
        console.error("Failed to track page view:", error);
      }
    };

    console.log("Tracking page view for location:", location);
    trackPageView();

    // Reset session start time when location changes
    sessionStartTime.current = Date.now();
  }, [location]);

  // Track session duration when component unmounts
  useEffect(() => {
    return () => {
      const finalSessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      console.log(`Final session duration: ${finalSessionDuration}s`);
    };
  }, []);
}
