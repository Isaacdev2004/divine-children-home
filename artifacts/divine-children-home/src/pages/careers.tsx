import { PageHeader } from "@/components/page-header";
import { useListJobs } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, PoundSterling, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";

export default function Careers() {
  const { data: jobs, isLoading } = useListJobs();

  usePageMeta(pageMeta.careers.title, pageMeta.careers.description);

  return (
    <div className="flex flex-col">
      <PageHeader 
        title="Careers at Divine"
        description="Join a team of passionate professionals dedicated to making a profound difference in the lives of vulnerable children."
        breadcrumbs={[{ label: "Careers" }]}
      />

      {/* Why work with us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-heading font-bold text-primary mb-6">More Than Just a Job</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Working in residential childcare is challenging, demanding, and incredibly rewarding. At Divine Children Home, we believe that we can only provide outstanding care to our children if we provide outstanding support to our staff.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="bg-muted/50 border-none">
              <CardContent className="p-6 text-center">
                <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">1</div>
                <h3 className="font-bold text-lg mb-2">Industry-Leading Pay</h3>
                <p className="text-sm text-muted-foreground">Competitive salaries reflecting the professional nature of the work.</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 border-none">
              <CardContent className="p-6 text-center">
                <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">2</div>
                <h3 className="font-bold text-lg mb-2">Clinical Supervision</h3>
                <p className="text-sm text-muted-foreground">Regular reflective practice and emotional support for all care staff.</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 border-none">
              <CardContent className="p-6 text-center">
                <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">3</div>
                <h3 className="font-bold text-lg mb-2">Funded Training</h3>
                <p className="text-sm text-muted-foreground">Fully funded Level 3/4/5 Diplomas and specialist therapeutic courses.</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 border-none">
              <CardContent className="p-6 text-center">
                <div className="bg-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">4</div>
                <h3 className="font-bold text-lg mb-2">Career Progression</h3>
                <p className="text-sm text-muted-foreground">Clear pathways from Support Worker to Registered Home Manager.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20 bg-muted/30 border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-primary mb-10 text-center">Current Opportunities</h2>
          
          {isLoading ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-40 w-full rounded-xl" />
              ))}
            </div>
          ) : !jobs || jobs.length === 0 ? (
            <div className="text-center bg-white p-12 rounded-xl border max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-2">No active vacancies right now</h3>
              <p className="text-muted-foreground mb-6">We are always looking for great talent. Send us your CV on spec.</p>
              <Button asChild>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {jobs.map(job => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-heading font-bold text-primary mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="h-4 w-4"/> {job.location}</span>
                          <span className="flex items-center gap-1"><Briefcase className="h-4 w-4"/> {job.type}</span>
                          <span className="flex items-center gap-1"><PoundSterling className="h-4 w-4"/> {job.salary}</span>
                        </div>
                      </div>
                      <Badge variant={job.department === 'Care' ? 'default' : 'secondary'} className="w-fit">
                        {job.department}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 line-clamp-2">
                      {job.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-t pt-4">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3"/> Posted {format(new Date(job.postedAt), 'MMM d, yyyy')}
                      </span>
                      <Button asChild variant="accent">
                        {/* Assuming there's a detailed job page or application form modal. We'll link to contact for now as per simple routing */}
                        <Link href={`/contact?job=${job.id}`}>Apply for this role</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}