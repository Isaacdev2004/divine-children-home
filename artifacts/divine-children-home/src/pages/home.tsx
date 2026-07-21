import { motion } from "framer-motion";
import { Heart, ShieldCheck, Home as HomeIcon, Users, ArrowRight, Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { StatsSection } from "@/components/stats-section";
import { useListTestimonials, useListNews } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import heroBg from "@assets/generated_images/hero-bg.jpg";
import { usePageMeta } from "@/hooks/usePageMeta";
import { siteConfig } from "@/config/site";

export default function Home() {
  const { data: testimonials, isLoading: testimonialsLoading } = useListTestimonials();
  const { data: news, isLoading: newsLoading } = useListNews();

  usePageMeta("Premium Residential Care", siteConfig.description);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-primary/70 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="inline-block py-1 px-3 rounded-full bg-accent/20 text-accent font-semibold tracking-wider text-sm mb-6 border border-accent/30 backdrop-blur-sm">
              PREMIUM RESIDENTIAL CARE & SUPPORTED LIVING
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight drop-shadow-lg">
              Providing Safety, Stability, and Hope
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed font-medium">
              We create warm, nurturing environments where vulnerable children and young people can heal, grow, and reach their full potential.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="accent" asChild className="text-lg h-14 px-8 font-bold shadow-lg">
                <Link href="/referral">Make a Referral</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg h-14 px-8 font-bold bg-transparent text-white border-white hover:bg-white hover:text-primary">
                <Link href="/about">Discover Our Approach</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-b py-6">
        <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-70 grayscale">
          {/* Trusted partners logos would go here, using text placeholders for now */}
          <div className="font-heading font-bold text-xl text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6"/> CQC Registered
          </div>
          <div className="font-heading font-bold text-xl text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6"/> Ofsted Registered
          </div>
          <div className="font-heading font-bold text-xl text-muted-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6"/> Trusted Partner
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-6">A New Standard in Care</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe every child deserves a loving home. Our approach combines clinical expertise with genuine warmth to create environments that feel like family.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: HomeIcon,
                title: "Purpose-Built Homes",
                desc: "Our homes are carefully selected and beautifully decorated to provide a warm, safe, and inspiring environment that feels nothing like an institution."
              },
              {
                icon: ShieldCheck,
                title: "Rigorous Safeguarding",
                desc: "Safety is our absolute priority. We operate with robust safeguarding frameworks, comprehensive staff training, and an open culture of vigilance."
              },
              {
                icon: Heart,
                title: "Therapeutic Approach",
                desc: "We embed trauma-informed practice into everyday care, working alongside clinical psychologists to support emotional healing and resilience."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border-none shadow-md card-interactive">
                  <CardContent className="p-8">
                    <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                      <feature.icon className="h-8 w-8 text-secondary" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-primary mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* Services Overview */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Comprehensive Support Services</h2>
              <p className="text-lg text-muted-foreground">Tailored placements designed to meet the unique needs of every child and young person in our care.</p>
            </div>
            <Button variant="outline" asChild className="shrink-0 border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/services">View All Services <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: "residential", title: "Residential Care", desc: "Long-term, stable homes for children needing dedicated support.", color: "bg-primary text-white" },
              { id: "supported-living", title: "Supported Living", desc: "Transition support for 16-18 year olds moving towards independence.", color: "bg-white text-primary border" },
              { id: "emergency", title: "Emergency Placements", desc: "Immediate safe havens for children in sudden crisis.", color: "bg-white text-primary border" },
              { id: "therapeutic", title: "Therapeutic Support", desc: "Specialist interventions for complex trauma and behavioural needs.", color: "bg-secondary text-white" }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-8 h-full flex flex-col justify-between group cursor-pointer transition-transform hover:-translate-y-2 ${service.color}`}
              >
                <div>
                  <h3 className="text-xl font-heading font-bold mb-4">{service.title}</h3>
                  <p className={`mb-8 ${service.color.includes('text-white') ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {service.desc}
                  </p>
                </div>
                <Link href={`/services#${service.id}`} className="font-semibold flex items-center gap-2 mt-auto">
                  Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">Latest Updates</h2>
              <p className="text-lg text-muted-foreground">News, events, and stories from our homes.</p>
            </div>
            <Button variant="ghost" asChild className="text-primary">
              <Link href="/news">Read All News <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {newsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-xl" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            ) : news?.slice(0, 3).map((article, i) => (
              <motion.div 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <Link href={`/news/${article.slug}`} className="block">
                  <div className="overflow-hidden rounded-xl mb-6 shadow-sm">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title} 
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="font-semibold text-secondary uppercase tracking-wider">{article.category}</span>
                    <span>{format(new Date(article.publishedAt), 'MMMM d, yyyy')}</span>
                  </div>
                  <h3 className="text-xl font-heading font-bold text-primary mb-3 group-hover:text-secondary transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-muted/30" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 id="testimonials-heading" className="section-heading">Trusted by Professionals</h2>
            <p className="section-lead mx-auto">
              Social workers, commissioners, and partners share their experience of working with our team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsLoading ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-32 w-full rounded-xl" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ))
            ) : testimonials && testimonials.length > 0 ? (
              testimonials.slice(0, 3).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-none shadow-md card-interactive">
                    <CardContent className="p-8">
                      <Quote className="h-8 w-8 text-accent/60 mb-4" aria-hidden="true" />
                      <blockquote className="text-muted-foreground leading-relaxed mb-6">
                        &ldquo;{item.quote}&rdquo;
                      </blockquote>
                      {item.rating > 0 && (
                        <div className="flex gap-1 mb-4" aria-label={`${item.rating} out of 5 stars`}>
                          {Array.from({ length: item.rating }).map((_, si) => (
                            <Star key={si} className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                          ))}
                        </div>
                      )}
                      <footer>
                        <p className="font-heading font-bold text-primary">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.role}{item.organisation ? `, ${item.organisation}` : ""}
                        </p>
                      </footer>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground">
                <p>We are proud to partner with Local Authorities across the UK. Contact us to speak with a reference commissioner.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto max-w-4xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Need to place a child?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Our admissions team is available to discuss placements, answer questions, and provide availability updates.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="accent" asChild className="font-bold text-lg h-14 px-8">
              <Link href="/referral">Make a Referral Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="font-bold text-lg h-14 px-8 bg-transparent text-white border-white hover:bg-white hover:text-primary">
              <Link href="/contact">Contact Our Team</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
