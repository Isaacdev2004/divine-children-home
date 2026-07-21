import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { useSubscribeNewsletter } from "@workspace/api-client-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const subscribe = useSubscribeNewsletter();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    subscribe.mutate(
      { data: { email } },
      {
        onSuccess: () => {
          setSubscribed(true);
          setEmail("");
        },
      }
    );
  };

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-bold text-white tracking-tight leading-none">
                Divine Children Home
              </span>
              <span className="text-xs font-semibold text-primary-foreground/80 uppercase tracking-widest mt-1">
                Ltd
              </span>
            </div>
            <p className="text-primary-foreground/80 mt-4 leading-relaxed text-sm">
              Providing premium residential care and supported living for children and young people across the UK. A trusted partner for Local Authorities, committed to safeguarding and excellence.
            </p>
            <div className="flex gap-4 mt-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e9/Ofsted_logo.svg"
                alt="Ofsted Registered"
                className="h-10 bg-white p-1 rounded"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/about" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> About Us</Link></li>
              <li><Link href="/homes" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> Our Homes</Link></li>
              <li><Link href="/safeguarding" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> Safeguarding</Link></li>
              <li><Link href="/faqs" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> FAQs</Link></li>
              <li><Link href="/careers" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> Careers</Link></li>
              <li><Link href="/news" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> News & Updates</Link></li>
              <li><Link href="/gallery" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link href="/services#residential" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> Residential Care</Link></li>
              <li><Link href="/services#supported-living" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> Supported Living</Link></li>
              <li><Link href="/services#emergency" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> Emergency Placements</Link></li>
              <li><Link href="/services#therapeutic" className="hover:text-accent transition-colors flex items-center gap-2 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> Therapeutic Support</Link></li>
              <li><Link href="/referral" className="hover:text-accent transition-colors flex items-center gap-2 text-accent font-semibold mt-4 min-h-11"><ArrowRight className="h-3 w-3" aria-hidden="true" /> Make a Referral</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4 text-sm text-primary-foreground/80 mb-6">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <span>123 Care Avenue, London<br />UK, LDN 123</span>
              </li>
              <li>
                <a href={`tel:${siteConfig.phoneTel}`} className="flex items-center gap-3 hover:text-accent transition-colors min-h-11">
                  <Phone className="h-5 w-5 text-accent shrink-0" aria-hidden="true" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.infoEmail}`} className="flex items-center gap-3 hover:text-accent transition-colors min-h-11">
                  <Mail className="h-5 w-5 text-accent shrink-0" aria-hidden="true" />
                  {siteConfig.infoEmail}
                </a>
              </li>
            </ul>

            {subscribed ? (
              <div role="status" className="flex items-start gap-2 text-sm text-primary-foreground/90 bg-primary-foreground/10 p-4 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <p>Thank you for subscribing. We will keep you updated with news from our homes.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <h4 className="text-sm font-semibold text-white">Subscribe to Newsletter</h4>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-white placeholder:text-primary-foreground/50 h-11"
                    required
                    aria-label="Email address for newsletter"
                  />
                  <Button
                    type="submit"
                    variant="accent"
                    size="icon"
                    disabled={subscribe.isPending}
                    className="h-11 w-11 shrink-0"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                {subscribe.isError && (
                  <p role="alert" className="text-xs text-red-200">
                    Unable to subscribe. Please try again or contact us directly.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Divine Children Home Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors min-h-11 flex items-center">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors min-h-11 flex items-center">Terms & Conditions</Link>
            <Link href="/cookies" className="hover:text-white transition-colors min-h-11 flex items-center">Cookie Policy</Link>
            <Link href="/complaints" className="hover:text-white transition-colors min-h-11 flex items-center">Complaints Procedure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
