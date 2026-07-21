import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinkClass = (path: string, matchPrefix = false) =>
    cn(
      "hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
      (matchPrefix ? location.startsWith(path) : location === path) &&
        "text-primary border-b-2 border-primary"
    );

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col">
      <div className="bg-primary text-primary-foreground py-2 px-4 hidden md:flex items-center justify-between text-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {siteConfig.phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2 hover:text-accent transition-colors"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {siteConfig.email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/referral" className="font-semibold text-accent hover:underline">
              Make a Referral
            </Link>
            <Link href="/careers" className="hover:underline">
              Join Our Team
            </Link>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "bg-background border-b transition-all duration-300",
          isScrolled ? "shadow-md py-2" : "py-4"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 z-50 relative">
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-heading font-bold text-primary tracking-tight leading-none">
                Divine Children Home
              </span>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest mt-1">
                Ltd
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 font-medium" aria-label="Main navigation">
            <Link href="/" className={navLinkClass("/")}>
              Home
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
                About Us <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link href="/about"><DropdownMenuItem className="cursor-pointer">Our Story</DropdownMenuItem></Link>
                <Link href="/safeguarding"><DropdownMenuItem className="cursor-pointer">Safeguarding</DropdownMenuItem></Link>
                <Link href="/careers"><DropdownMenuItem className="cursor-pointer">Careers</DropdownMenuItem></Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/homes" className={navLinkClass("/homes")}>
              Our Homes
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm">
                Services <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link href="/services"><DropdownMenuItem className="cursor-pointer font-bold">All Services</DropdownMenuItem></Link>
                <Link href="/services#residential"><DropdownMenuItem className="cursor-pointer">Residential Care</DropdownMenuItem></Link>
                <Link href="/services#supported-living"><DropdownMenuItem className="cursor-pointer">Supported Living</DropdownMenuItem></Link>
                <Link href="/services#emergency"><DropdownMenuItem className="cursor-pointer">Emergency Placements</DropdownMenuItem></Link>
                <Link href="/services#therapeutic"><DropdownMenuItem className="cursor-pointer">Therapeutic Support</DropdownMenuItem></Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/news" className={navLinkClass("/news", true)}>
              News
            </Link>
            <Link href="/gallery" className={navLinkClass("/gallery")}>
              Gallery
            </Link>
            <Link href="/resources" className={navLinkClass("/resources")}>
              Resources
            </Link>
            <Link href="/faqs" className={navLinkClass("/faqs")}>
              FAQs
            </Link>
            <Link href="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>
          </nav>

          <div className="hidden lg:flex">
            <Link href="/referral">
              <Button variant="accent" className="font-semibold shadow-md" size="lg">
                Make a Referral
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden z-50 relative p-2 text-primary min-h-11 min-w-11 flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="fixed inset-0 top-[72px] bg-background z-40 overflow-y-auto pb-24 lg:hidden animate-in slide-in-from-top-2"
        >
          <nav className="flex flex-col p-6 space-y-6 text-lg font-medium" aria-label="Mobile navigation">
            <Link href="/" className="pb-2 border-b min-h-11 flex items-center">Home</Link>
            <Link href="/about" className="pb-2 border-b min-h-11 flex items-center">About Us</Link>
            <Link href="/homes" className="pb-2 border-b min-h-11 flex items-center">Our Homes</Link>
            <Link href="/services" className="pb-2 border-b min-h-11 flex items-center">Services</Link>
            <Link href="/safeguarding" className="pb-2 border-b min-h-11 flex items-center">Safeguarding</Link>
            <Link href="/news" className="pb-2 border-b min-h-11 flex items-center">News</Link>
            <Link href="/gallery" className="pb-2 border-b min-h-11 flex items-center">Gallery</Link>
            <Link href="/resources" className="pb-2 border-b min-h-11 flex items-center">Resources</Link>
            <Link href="/faqs" className="pb-2 border-b min-h-11 flex items-center">FAQs</Link>
            <Link href="/careers" className="pb-2 border-b min-h-11 flex items-center">Careers</Link>
            <Link href="/contact" className="pb-2 border-b min-h-11 flex items-center">Contact</Link>

            <div className="pt-4 flex flex-col gap-4">
              <Link href="/referral">
                <Button variant="accent" className="w-full font-bold h-12 text-lg">Make a Referral</Button>
              </Link>

              <div className="flex flex-col gap-2 mt-4 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                <a href={`tel:${siteConfig.phoneTel}`} className="flex items-center gap-2 min-h-11 hover:text-primary">
                  <Phone className="h-4 w-4" aria-hidden="true" /> {siteConfig.phone}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 min-h-11 hover:text-primary">
                  <Mail className="h-4 w-4" aria-hidden="true" /> {siteConfig.email}
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
