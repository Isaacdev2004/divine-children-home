import { PageHeader } from "@/components/page-header";
import { useListFaqs } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";

export default function FAQs() {
  const { data: faqs, isLoading } = useListFaqs();

  usePageMeta(pageMeta.faqs.title, pageMeta.faqs.description);

  // Group FAQs by category if data exists
  const groupedFaqs = faqs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof faqs>);

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Frequently Asked Questions"
        description="Answers to common queries from commissioners, social workers, and families."
        breadcrumbs={[{ label: "FAQs" }]}
      />

      <div className="container mx-auto px-4 py-20 max-w-3xl">
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : !groupedFaqs || Object.keys(groupedFaqs).length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No FAQs available at this time.
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedFaqs).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-2xl font-heading font-bold text-primary mb-6 border-b pb-2">{category}</h2>
                <Accordion type="single" collapsible className="w-full">
                  {items.sort((a,b) => a.sortOrder - b.sortOrder).map((faq) => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                      <AccordionTrigger className="text-left font-semibold text-base hover:text-accent">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}