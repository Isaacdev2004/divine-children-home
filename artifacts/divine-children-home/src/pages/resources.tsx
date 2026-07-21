import { PageHeader } from "@/components/page-header";
import { Download, FileText, ShieldAlert, FileQuestion } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";
import { siteConfig } from "@/config/site";

export default function Resources() {
  usePageMeta(pageMeta.resources.title, pageMeta.resources.description);

  const resourceGroups = [
    {
      title: "Key Policies",
      icon: ShieldAlert,
      items: [
        { name: "Safeguarding and Child Protection Policy 2024", size: "1.2 MB", type: "PDF" },
        { name: "Statement of Purpose (Sample)", size: "850 KB", type: "PDF" },
        { name: "Complaints Procedure Summary", size: "420 KB", type: "PDF" },
        { name: "Health and Safety Policy", size: "2.1 MB", type: "PDF" },
      ],
    },
    {
      title: "For Referrers",
      icon: FileText,
      items: [
        { name: "Referral Process Guide", size: "500 KB", type: "PDF" },
        { name: "Offline Referral Form", size: "120 KB", type: "DOCX" },
        { name: "Emergency Admission Protocol", size: "300 KB", type: "PDF" },
      ],
    },
    {
      title: "Information for Children & Families",
      icon: FileQuestion,
      items: [
        { name: "Children's Guide – Welcome to Your New Home", size: "2.5 MB", type: "PDF" },
        { name: "How to Make a Complaint (Child Friendly)", size: "800 KB", type: "PDF" },
        { name: "Family Contact Guidelines", size: "450 KB", type: "PDF" },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Resources & Documents"
        description="Downloadable policies, guides, and forms for commissioners, social workers, families, and young people."
        breadcrumbs={[{ label: "Resources" }]}
      />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-blue-900">
            <h2 className="font-bold mb-2 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" aria-hidden="true" />
              Restricted Documents
            </h2>
            <p className="text-sm leading-relaxed">
              Some documents, including full Statements of Purpose for specific homes and detailed environmental risk assessments, are restricted for safeguarding reasons. Please{" "}
              <Link href="/contact" className="underline font-semibold">contact our placements team</Link> or email{" "}
              <a href={`mailto:${siteConfig.email}`} className="underline font-semibold">{siteConfig.email}</a> if you require these documents for commissioning purposes.
            </p>
          </div>

          {resourceGroups.map((group, index) => (
            <section key={index} aria-labelledby={`resource-group-${index}`}>
              <h2 id={`resource-group-${index}`} className="text-2xl font-heading font-bold text-primary mb-6 flex items-center gap-3 border-b pb-4">
                <group.icon className="h-6 w-6 text-accent" aria-hidden="true" />
                {group.title}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {group.items.map((item, i) => (
                  <Card key={i} className="card-interactive group">
                    <CardContent className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="bg-muted p-2 rounded-lg text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                          <FileText className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.type} • {item.size}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 min-h-11 min-w-11"
                        asChild
                        aria-label={`Request download: ${item.name}`}
                      >
                        <Link href={`/contact?subject=${encodeURIComponent(`Document request: ${item.name}`)}`}>
                          <Download className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
