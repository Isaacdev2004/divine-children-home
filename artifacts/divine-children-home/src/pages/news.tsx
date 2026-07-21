import { PageHeader } from "@/components/page-header";
import { useListNews } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";

export default function News() {
  const { data: news, isLoading } = useListNews();

  usePageMeta(pageMeta.news.title, pageMeta.news.description);

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="News & Updates"
        description="Stay up to date with the latest developments, events, and success stories from across our homes."
        breadcrumbs={[{ label: "News" }]}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-64 w-full rounded-xl" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
            </div>
          ) : !news || news.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No news articles found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((article, i) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1 }}
                  className="group flex flex-col h-full"
                >
                  <Link href={`/news/${article.slug}`} className="flex flex-col h-full block">
                    <div className="overflow-hidden rounded-xl mb-6 shadow-sm relative aspect-[4/3]">
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded shadow">
                        {article.category}
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                      <div className="text-sm text-muted-foreground mb-3">
                        {format(new Date(article.publishedAt), 'MMMM d, yyyy')} 
                        {article.author && <span className="ml-2 pl-2 border-l">By {article.author}</span>}
                      </div>
                      
                      <h3 className="text-2xl font-heading font-bold text-primary mb-3 group-hover:text-accent transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-6 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="mt-auto font-semibold text-primary flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read full article <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
          
        </div>
      </section>
    </div>
  );
}