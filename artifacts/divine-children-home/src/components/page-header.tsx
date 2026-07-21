import { Link } from "wouter";
import { ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
}

export function PageHeader({ 
  title, 
  description,
  breadcrumbs
}: { 
  title: string; 
  description?: string;
  breadcrumbs: Breadcrumb[] 
}) {
  return (
    <div className="bg-primary pt-16 pb-20 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="200" cy="200" r="200" fill="url(#paint0_radial)" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 200) rotate(90) scale(200)">
              <stop stopColor="white" />
              <stop offset="1" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <nav className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-6">
          <Link href="/" className="hover:text-white transition-colors flex items-center">
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <div key={i} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white font-medium">{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-primary-foreground/80 max-w-2xl">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}