import { useGetNewsArticle, useListNews, getGetNewsArticleQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ChevronLeft, Calendar, User, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function NewsArticle() {
  const params = useParams();
  const slug = params.slug || "";
  
  const { data: article, isLoading, error } = useGetNewsArticle(slug, {
    query: {
      enabled: !!slug,
      queryKey: getGetNewsArticleQueryKey(slug),
    },
  });

  const { data: recentNews } = useListNews();

  usePageMeta(
    article?.title ?? "News Article",
    article?.excerpt ?? "Latest news from Divine Children Home Ltd."
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Skeleton className="h-8 w-24 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-12" />
        <Skeleton className="h-[400px] w-full rounded-xl mb-12" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container mx-auto px-4 py-32 text-center max-w-2xl">
        <h1 className="text-3xl font-heading font-bold text-primary mb-4">Article Not Found</h1>
        <p className="text-muted-foreground mb-8">The news article you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/news">Back to News</Link>
        </Button>
      </div>
    );
  }

  const related = recentNews?.filter(n => n.id !== article.id).slice(0, 3) || [];

  return (
    <div className="flex flex-col bg-background">
      {/* Article Header */}
      <section className="bg-primary pt-20 pb-32 text-white relative">
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <Link href="/news" className="inline-flex items-center text-primary-foreground/70 hover:text-white mb-8 transition-colors text-sm font-medium">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to all news
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-primary-foreground/80 mb-6">
            <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full font-semibold uppercase tracking-wider text-xs">
              {article.category}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {format(new Date(article.publishedAt), 'MMMM d, yyyy')}
            </span>
            {article.author && (
              <span className="flex items-center gap-1.5 border-l border-white/20 pl-4">
                <User className="h-4 w-4" />
                {article.author}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold leading-tight drop-shadow-md">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Article Content */}
      <section className="pb-20 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="lg:w-2/3 -mt-20 relative z-20">
              <img 
                src={article.imageUrl} 
                alt={article.title} 
                className="w-full h-auto aspect-video object-cover rounded-2xl shadow-xl mb-12 bg-white"
              />
              
              <div className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-primary prose-a:text-accent hover:prose-a:text-primary prose-img:rounded-xl">
                {/* Simulated markdown/HTML rendering */}
                <p className="lead text-xl text-muted-foreground font-medium mb-8">
                  {article.excerpt}
                </p>
                <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3 lg:pt-12">
              <div className="sticky top-24">
                <h3 className="text-xl font-heading font-bold text-primary mb-6 border-b pb-4">Recent Updates</h3>
                <div className="space-y-6">
                  {related.map(item => (
                    <Link key={item.id} href={`/news/${item.slug}`} className="group block">
                      <div className="flex gap-4">
                        <img 
                          src={item.imageUrl} 
                          alt="" 
                          className="w-24 h-24 rounded-lg object-cover shadow-sm group-hover:opacity-80 transition-opacity"
                        />
                        <div>
                          <h4 className="font-bold text-primary group-hover:text-accent transition-colors line-clamp-2 mb-1 text-sm leading-tight">
                            {item.title}
                          </h4>
                          <span className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(item.publishedAt), 'MMM d')}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-12 bg-muted p-6 rounded-xl text-center">
                  <h4 className="font-heading font-bold text-primary mb-2">Subscribe to Updates</h4>
                  <p className="text-sm text-muted-foreground mb-4">Get the latest news directly to your inbox.</p>
                  <Button variant="accent" className="w-full">Subscribe</Button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
}