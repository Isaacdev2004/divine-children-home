import { PageHeader } from "@/components/page-header";
import { ShieldCheck, AlertTriangle, Phone, Mail, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";

export default function Safeguarding() {
  usePageMeta(pageMeta.safeguarding.title, pageMeta.safeguarding.description);

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Safeguarding & Child Protection"
        description="Safeguarding is not just a policy—it is the absolute foundation of everything we do."
        breadcrumbs={[{ label: "Safeguarding" }]}
      />

      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto space-y-16">
          
          <div className="text-center">
            <ShieldCheck className="h-20 w-20 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">Our Commitment</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              At Divine Children Home Ltd, the safety, welfare, and protection of the children in our care supersedes all other considerations. We operate a zero-tolerance approach to abuse and a culture of absolute transparency and vigilance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-primary text-white border-none">
              <CardContent className="p-8">
                <h3 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="h-6 w-6 text-accent" />
                  Reporting a Concern
                </h3>
                <p className="text-primary-foreground/80 mb-6">
                  If you have any concerns about the safety or welfare of a child in one of our homes, you must report it immediately.
                </p>
                <div className="space-y-4">
                  <div className="bg-primary-foreground/10 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-1">Designated Safeguarding Lead</p>
                    <p className="text-lg font-bold">Sarah Jenkins</p>
                    <p className="flex items-center gap-2 mt-2"><Phone className="h-4 w-4"/> 0800 123 4567</p>
                    <p className="flex items-center gap-2 mt-1"><Mail className="h-4 w-4"/> safeguarding@divinechildrenhome.co.uk</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h3 className="text-2xl font-heading font-bold text-primary">External Contacts</h3>
              <p className="text-muted-foreground">If you feel you cannot report internally, or if a child is in immediate danger, please contact:</p>
              
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 border rounded-xl bg-muted/30">
                  <div className="bg-red-100 text-red-600 p-2 rounded-full h-fit"><Phone className="h-5 w-5"/></div>
                  <div>
                    <strong className="block text-primary">Emergency Services (Police)</strong>
                    <span className="text-lg font-bold text-red-600">999</span>
                    <p className="text-sm text-muted-foreground mt-1">If a child is at immediate risk of harm.</p>
                  </div>
                </li>
                <li className="flex gap-4 p-4 border rounded-xl bg-muted/30">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full h-fit"><Phone className="h-5 w-5"/></div>
                  <div>
                    <strong className="block text-primary">NSPCC Helpline</strong>
                    <span className="text-lg font-bold">0808 800 5000</span>
                  </div>
                </li>
                <li className="flex gap-4 p-4 border rounded-xl bg-muted/30">
                  <div className="bg-green-100 text-green-600 p-2 rounded-full h-fit"><Phone className="h-5 w-5"/></div>
                  <div>
                    <strong className="block text-primary">Ofsted</strong>
                    <span className="text-lg font-bold">0300 123 1231</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-muted p-8 rounded-2xl">
            <h3 className="text-2xl font-heading font-bold text-primary mb-6">Our Safeguarding Framework</h3>
            <div className="space-y-4 text-muted-foreground">
              <p><strong>Safer Recruitment:</strong> All staff undergo rigorous vetting, including enhanced DBS checks, extensive reference checking, and thorough gap analysis in employment history.</p>
              <p><strong>Continuous Training:</strong> Safeguarding training is not a one-off event. It is continuously updated, covering modern threats including CSE, County Lines, radicalisation, and online safety.</p>
              <p><strong>Whistleblowing:</strong> We maintain a robust, supported whistleblowing policy that actively encourages staff to speak out without fear of repercussion if they observe poor practice.</p>
              <p><strong>Independent Oversight:</strong> We utilise independent Regulation 44 visitors who conduct unannounced inspections of our homes every month to ensure standards are met.</p>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/resources"><FileText className="h-4 w-4" /> Download Full Safeguarding Policy</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}