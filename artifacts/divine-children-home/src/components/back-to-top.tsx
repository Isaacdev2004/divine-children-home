import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="secondary"
      size="icon"
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg h-12 w-12 hover:scale-110 transition-transform duration-200 motion-reduce:hover:scale-100"
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  );
}
