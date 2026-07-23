import { PageHeader } from "@/components/page-header";
import { motion } from "framer-motion";
import { Heart, Target, Lightbulb, ShieldCheck } from "lucide-react";
import teamBg from "@assets/generated_images/about-team.jpg";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";

export default function About() {
  usePageMeta(pageMeta.about.title, pageMeta.about.description);

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="About Divine Children Home"
        description="A trusted provider of premium residential care and supported living in the UK, dedicated to transforming the lives of vulnerable children."
        breadcrumbs={[{ label: "About Us" }]}
      />

      {/* Our Story */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-heading font-bold text-primary">Our Story</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Divine Children Home Ltd was founded with a singular vision: to elevate the standard of residential care for children in the UK. We recognised that too many vulnerable young people were placed in institutional settings that lacked warmth, clinical expertise, and genuine care.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We set out to create homes—real homes. Places that are beautifully furnished, nestled in safe communities, and staffed by compassionate professionals who are experts in trauma-informed care.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Today, we partner with Local Authorities nationwide, offering a continuum of care from emergency crisis placements to supported living, always maintaining our core belief: that every child deserves a chance to heal, grow, and thrive.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-secondary rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
              <img 
                src={teamBg} 
                alt="Our Leadership Team" 
                className="rounded-2xl shadow-xl w-full h-auto object-cover aspect-[4/3]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold text-primary mb-4">Our Guiding Principles</h2>
            <p className="text-lg text-muted-foreground">The foundational beliefs that drive everything we do, every single day.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-primary text-primary-foreground border-none">
              <div className="p-8">
                <Target className="h-10 w-10 text-accent mb-6" />
                <h3 className="text-2xl font-heading font-bold mb-4">Our Mission</h3>
                <p className="text-primary-foreground/80 leading-relaxed">
                  To provide exceptional, therapeutic residential care that empowers vulnerable children and young people to overcome adversity, build resilience, and achieve their full potential in a safe, nurturing environment.
                </p>
              </div>
            </Card>
            
            <Card className="bg-secondary text-secondary-foreground border-none">
              <div className="p-8">
                <Lightbulb className="h-10 w-10 text-white mb-6" />
                <h3 className="text-2xl font-heading font-bold mb-4">Our Vision</h3>
                <p className="text-secondary-foreground/90 leading-relaxed">
                  To be a trusted provider of children's care in the UK, setting a high standard for therapeutic environments and positive outcomes for every child we support.
                </p>
              </div>
            </Card>

            <Card className="bg-white border-none shadow-md">
              <div className="p-8">
                <Heart className="h-10 w-10 text-accent mb-6" />
                <h3 className="text-2xl font-heading font-bold text-primary mb-4">Our Core Values</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0"></div>
                    <span><strong>Compassion:</strong> Unwavering warmth and empathy in all interactions.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0"></div>
                    <span><strong>Excellence:</strong> A commitment to the highest clinical and care standards.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0"></div>
                    <span><strong>Integrity:</strong> Honesty, transparency, and robust safeguarding.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-2 w-2 rounded-full bg-accent mt-2 shrink-0"></div>
                    <span><strong>Respect:</strong> Valuing the unique identity and voice of every child.</span>
                  </li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration status */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <ShieldCheck className="h-12 w-12 text-secondary mx-auto mb-6" aria-hidden="true" />
          <h2 className="text-3xl font-heading font-bold text-primary mb-4">Registration Status</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Divine Children Home Ltd is currently progressing through the Ofsted registration process. We will update this website with our registration details and home imagery once the process is complete.
          </p>
        </div>
      </section>

    </div>
  );
}

// Inline Card component since we don't have the full import here
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-xl overflow-hidden ${className}`}>{children}</div>;
}