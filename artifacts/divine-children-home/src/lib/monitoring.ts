/**
 * Monitoring integrations — initialise from env when IDs are configured.
 * Respects cookie consent (analytics only when accepted).
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    clarity?: (...args: unknown[]) => void;
  }
}

function hasAnalyticsConsent(): boolean {
  return localStorage.getItem("cookie-consent") === "accepted";
}

export function initMonitoring(): void {
  if (typeof window === "undefined") return;

  const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const clarityId = import.meta.env.VITE_CLARITY_PROJECT_ID;

  if (gaId && hasAnalyticsConsent()) {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag("js", new Date());
    window.gtag("config", gaId, { anonymize_ip: true });
  }

  if (clarityId && hasAnalyticsConsent()) {
    const script = document.createElement("script");
    script.innerHTML = `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${clarityId}");`;
    document.head.appendChild(script);
  }
}

/** Call after user accepts cookies */
export function enableMonitoringAfterConsent(): void {
  initMonitoring();
}
