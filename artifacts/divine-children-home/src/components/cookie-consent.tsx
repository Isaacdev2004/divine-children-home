import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
    void import("@/lib/monitoring").then(({ enableMonitoringAfterConsent }) => {
      enableMonitoringAfterConsent();
    });
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <p id="cookie-consent-desc">
            <span id="cookie-consent-title" className="sr-only">Cookie consent</span>
            We use cookies to improve your experience on our site, analyse site usage, and support our marketing efforts. By clicking &ldquo;Accept All&rdquo;, you agree to our use of cookies. Read our{" "}
            <Link href="/cookies" className="text-primary underline">Cookie Policy</Link> for more information.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" onClick={handleDecline} className="min-h-11">
            Essential Only
          </Button>
          <Button onClick={handleAccept} className="min-h-11">Accept All</Button>
        </div>
      </div>
    </div>
  );
}
