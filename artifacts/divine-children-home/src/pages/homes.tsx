import { PageHeader } from "@/components/page-header";
import { motion } from "framer-motion";
import { MapPin, Users, CheckCircle2, ShieldCheck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import galleryInterior from "@assets/generated_images/gallery-interior.jpg";
import galleryOutdoor from "@assets/generated_images/gallery-outdoor.jpg";
import galleryDining from "@assets/generated_images/gallery-dining.jpg";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";

export default function Homes() {
  usePageMeta(pageMeta.homes.title, pageMeta.homes.description);

  const homesFeatures = [
    "High-quality semi-detached and detached properties",
    "Safe, quiet, residential neighborhoods",
    "Individual bedrooms beautifully decorated to each child's taste",
    "Spacious communal lounges and dining areas",
    "Large, secure, well-maintained gardens",
    "High-speed internet and dedicated study areas",
    "Modern, fully-equipped kitchens",
    "Robust but discreet security systems"
  ];

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Our Homes"
        description="Not just houses, but warm, nurturing environments designed to make children feel safe, valued, and immediately at home."
        breadcrumbs={[{ label: "Our Homes" }]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-heading font-bold text-primary mb-6">The Environment Makes the Difference</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                We reject the institutional feel of traditional care settings. Our homes are standard residential properties nestled in welcoming communities across the UK. They look exactly like the other houses on the street.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Inside, they are fitted out to the highest standards. We invest heavily in premium furnishings, creating spaces that demonstrate to our young people that they are highly valued and deserve the very best.
              </p>
              
              <div className="space-y-3">
                {homesFeatures.slice(0, 4).map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-success shrink-0" />
                    <span className="text-muted-foreground font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img src={galleryInterior} alt="Home Interior Bedroom" className="rounded-xl w-full h-64 object-cover shadow-md" />
              <img src={galleryDining} alt="Home Dining Area" className="rounded-xl w-full h-64 object-cover shadow-md translate-y-8" />
              <img src={galleryOutdoor} alt="Home Outdoor Garden" className="rounded-xl w-full h-64 object-cover shadow-md col-span-2 mt-4" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Safeguarding Environment */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ShieldCheck className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-heading font-bold mb-6">Built for Safety & Safeguarding</h2>
            <p className="text-xl text-primary-foreground/80 leading-relaxed mb-10">
              While our homes look and feel like standard family residences, they are underpinned by rigorous, discreet safety features. From environmental risk assessments to secure access controls, the physical environment works in tandem with our highly trained staff to ensure absolute security.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 text-left">
              <div className="bg-primary-foreground/10 p-6 rounded-xl border border-primary-foreground/20">
                <MapPin className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-bold text-lg mb-2">Carefully Chosen Locations</h3>
                <p className="text-sm text-primary-foreground/70">Homes are situated in safe, low-risk areas with excellent access to local amenities and schools.</p>
              </div>
              <div className="bg-primary-foreground/10 p-6 rounded-xl border border-primary-foreground/20">
                <Users className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-bold text-lg mb-2">High Staffing Ratios</h3>
                <p className="text-sm text-primary-foreground/70">The environment is supported by high staffing ratios to ensure constant, unobtrusive supervision.</p>
              </div>
              <div className="bg-primary-foreground/10 p-6 rounded-xl border border-primary-foreground/20">
                <Home className="h-8 w-8 text-accent mb-4" />
                <h3 className="font-bold text-lg mb-2">Environmental Audits</h3>
                <p className="text-sm text-primary-foreground/70">Regular independent audits of the physical space ensure it meets the highest standards of safety and quality.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-primary mb-6">Arrange a Visit or Virtual Tour</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We welcome Local Authority commissioners and social workers to inspect our homes. Due to safeguarding and privacy for our current residents, all visits must be arranged in advance.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="accent" asChild className="font-bold">
              <Link href="/contact">Contact Placements Team</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/gallery">View Gallery</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}