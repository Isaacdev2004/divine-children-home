import { PageHeader } from "@/components/page-header";
import { motion } from "framer-motion";
import { Home, Compass, AlertCircle, HeartPulse, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";

export default function Services() {
  const [location] = useLocation();

  usePageMeta(pageMeta.services.title, pageMeta.services.description);

  useEffect(() => {
    // Handle anchor links
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const yOffset = -100; 
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  const services = [
    {
      id: "residential",
      icon: Home,
      title: "Residential Children's Care",
      subtitle: "Stable, long-term therapeutic homes",
      description: "Our core service provides long-term residential care for children aged 8-17 who cannot live with their birth families. We create a deeply nurturing, highly structured environment that supports emotional healing and personal development.",
      features: [
        "24/7 dedicated care from highly trained professionals",
        "Personalised care plans aligned with Local Authority objectives",
        "Support with life skills, emotional regulation, and social development",
        "Promotion of positive family contact where appropriate",
        "Full integration into local community activities and clubs"
      ]
    },
    {
      id: "emergency",
      icon: AlertCircle,
      title: "Emergency Placements",
      subtitle: "Immediate safety and stabilization",
      description: "When a child is in crisis, we provide immediate, safe accommodation. Our emergency placements are designed to rapidly stabilise the young person, assess their immediate needs, and provide a secure haven while long-term plans are developed.",
      features: [
        "24/7 rapid response admissions process",
        "Immediate comprehensive risk assessment and safeguarding",
        "Intensive therapeutic support during crisis",
        "Collaborative multi-agency working from day one",
        "Detailed initial assessment reports to inform next steps"
      ]
    },
    {
      id: "supported-living",
      icon: Compass,
      title: "Supported Living (16-18+)",
      subtitle: "Transitioning to independence",
      description: "We provide semi-independent living arrangements for older teenagers transitioning out of the care system. This service focuses on building practical life skills, financial management, and self-reliance in a safe, monitored environment.",
      features: [
        "Bespoke independence training programs",
        "Support with budgeting, cooking, and household management",
        "Assistance with accessing education, training, and employment",
        "Graduated reduction in staff support as competence grows",
        "Tenancy readiness preparation"
      ]
    },
    {
      id: "therapeutic",
      icon: HeartPulse,
      title: "Therapeutic Support",
      subtitle: "Healing trauma through clinical care",
      description: "Many of our young people have experienced significant trauma. Our in-house clinical team and therapeutic care workers use evidence-based interventions to help them process their past and build emotional resilience for the future.",
      features: [
        "Trauma-informed environmental design and care practice",
        "Access to clinical psychologists and specialised therapists",
        "PACE (Playfulness, Acceptance, Curiosity, Empathy) model approach",
        "Regular therapeutic consultations for the care team",
        "Focus on attachment and relational healing"
      ]
    },
    {
      id: "education",
      icon: BookOpen,
      title: "Education Support",
      subtitle: "Unlocking academic potential",
      description: "We believe education is the key to breaking the cycle of disadvantage. We vigorously advocate for our young people's educational rights, whether in mainstream schools, specialized provisions, or tailored home-tutoring setups.",
      features: [
        "Dedicated education liaison officers within our team",
        "Support with homework and dedicated quiet study spaces",
        "Attendance at all PEP (Personal Education Plan) meetings",
        "Strong relationships with local schools and colleges",
        "Celebration of all academic and vocational achievements"
      ]
    }
  ];

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Our Services"
        description="Comprehensive, tailored care pathways designed to meet the complex needs of vulnerable children and young people at every stage of their journey."
        breadcrumbs={[{ label: "Services" }]}
      />

      <div className="container mx-auto px-4 py-20">
        <div className="space-y-24">
          {services.map((service, index) => (
            <motion.div 
              key={service.id}
              id={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="scroll-mt-32"
            >
              <div className={`flex flex-col lg:flex-row gap-12 items-start ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                
                {/* Visual Side */}
                <div className="lg:w-5/12 shrink-0">
                  <div className="bg-muted rounded-2xl p-10 h-full flex flex-col items-center justify-center text-center border shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-tr-full"></div>
                    
                    <div className="bg-white p-6 rounded-full shadow-md mb-6 relative z-10">
                      <service.icon className="h-16 w-16 text-primary" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-primary mb-2 relative z-10">{service.title}</h3>
                    <p className="text-accent font-semibold tracking-wide uppercase text-sm relative z-10">{service.subtitle}</p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:w-7/12 pt-4">
                  <h3 className="text-3xl font-heading font-bold text-primary mb-4 hidden lg:block">{service.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    {service.description}
                  </p>
                  
                  <div className="bg-white rounded-xl border p-8 shadow-sm">
                    <h4 className="font-heading font-bold text-lg mb-4 text-primary border-b pb-2">Key Features</h4>
                    <ul className="space-y-4">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="mt-1 h-5 w-5 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                            <div className="h-2 w-2 rounded-full bg-secondary"></div>
                          </div>
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    <Button asChild variant="outline" className="border-primary text-primary">
                      <Link href="/referral">Make a Referral for this Service <ArrowRight className="ml-2 h-4 w-4"/></Link>
                    </Button>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}