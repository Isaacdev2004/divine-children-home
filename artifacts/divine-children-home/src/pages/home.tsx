import { motion } from "framer-motion";
import { Heart, ShieldCheck, Home as HomeIcon, Sparkles, HandHeart, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroBg from "@assets/generated_images/hero-bg.jpg";
import { usePageMeta } from "@/hooks/usePageMeta";
import { siteConfig } from "@/config/site";

const values = [
  { icon: ShieldCheck, title: "Safe", desc: "A secure, nurturing environment where every child feels protected." },
  { icon: Heart, title: "Compassionate", desc: "Warm, person-centred care delivered with genuine empathy." },
  { icon: Sparkles, title: "Empowering", desc: "Supporting young people to build confidence and independence." },
  { icon: HandHeart, title: "Respectful", desc: "Honouring each child's identity, voice, and individuality." },
  { icon: Award, title: "Excellence", desc: "Committed to the highest standards in everything we do." },
];

export default function Home() {
  usePageMeta("Nurturing Care for Children & Young People", siteConfig.description);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-primary/55 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white py-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block py-1.5 px-4 rounded-full bg-accent/25 text-accent font-semibold tracking-widest text-xs md:text-sm mb-6 border border-accent/40 uppercase">
              A Safe Home. A Brighter Future.
            </span>
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6 leading-tight drop-shadow-md">
              Providing Safe, Nurturing and Therapeutic Care for Children and Young People
            </h1>
            <p className="text-lg md:text-xl mb-10 text-white/90 leading-relaxed max-w-3xl mx-auto">
              Divine Children Home Ltd offers a warm, supportive environment where vulnerable children and young people can heal, grow, and look forward to a brighter future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="accent" asChild className="text-base h-14 px-8 font-bold uppercase tracking-wide">
                <Link href="/referral">Make a Referral</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base h-14 px-8 font-bold uppercase tracking-wide bg-transparent text-white border-white/80 hover:bg-white hover:text-primary"
              >
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Registration status */}
      <div className="bg-muted border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center justify-center gap-2 text-sm text-muted-foreground text-center">
          <ShieldCheck className="h-4 w-4 text-secondary shrink-0" aria-hidden="true" />
          <p>Ongoing Ofsted registration process — we will update our website once registration is complete.</p>
        </div>
      </div>

      {/* Welcome */}
      <section className="section-padding bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-secondary mb-3">Welcome to</p>
            <h2 className="section-heading">Divine Children Home Ltd</h2>
            <p className="section-lead mx-auto">
              We are dedicated to providing a nurturing environment for children and young people facing emotional and behavioural challenges, ensuring their safety, wellbeing, and personal growth.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6">
            {values.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/15">
                  <item.icon className="h-7 w-7 text-secondary" aria-hidden="true" />
                </div>
                <h3 className="font-heading font-bold text-primary text-sm uppercase tracking-wide mb-2">{item.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button variant="default" asChild className="font-semibold">
              <Link href="/about">
                Read More About Us <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What we offer — brief */}
      <section className="section-padding bg-muted/40 border-y border-border">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h2 className="section-heading">What We Are About</h2>
          <p className="section-lead mx-auto mb-8">
            Residential care and supported living for children and young people who need a safe place to call home. Our focus is compassionate support, strong safeguarding, and helping each young person move forward with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
            <Button variant="outline" asChild className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/services">Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
