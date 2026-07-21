import { useGetStats } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

function Counter({ end, suffix = "", duration = 2 }: { end: number, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;

    const update = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * easeOut));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(update);
      }
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function StatsSection() {
  const { data: stats, isLoading } = useGetStats();

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col items-center space-y-2">
                <Skeleton className="h-12 w-24 rounded-lg" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!stats) return null;

  const statItems = [
    { label: "Years Experience", value: stats.yearsExperience, suffix: "+" },
    { label: "Children Supported", value: stats.childrenSupported, suffix: "+" },
    { label: "Ofsted Rating", value: stats.ofstedRating === "Outstanding" ? 100 : 95, customDisplay: stats.ofstedRating },
    { label: "Homes Operating", value: stats.homesOperating },
  ];

  return (
    <section className="py-16 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,theme(colors.white)_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statItems.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-heading font-bold text-accent mb-2">
                {stat.customDisplay ? stat.customDisplay : <Counter end={stat.value} suffix={stat.suffix} />}
              </div>
              <div className="text-sm md:text-base font-medium text-primary-foreground/90 uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}