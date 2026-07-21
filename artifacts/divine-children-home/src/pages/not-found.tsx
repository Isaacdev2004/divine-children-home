import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";

export default function NotFound() {
  usePageMeta(pageMeta.notFound.title, pageMeta.notFound.description);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-background">
      <div className="bg-primary/5 p-8 rounded-full mb-8">
        <p className="text-6xl md:text-8xl font-heading font-bold text-primary" aria-hidden="true">404</p>
      </div>
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">Page Not Found</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild variant="accent" className="min-h-11">
          <Link href="/">Return to Homepage</Link>
        </Button>
        <Button asChild variant="outline" className="min-h-11">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
