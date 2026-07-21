import { PageHeader } from "@/components/page-header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubmitReferralForm } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, Users } from "lucide-react";
import { useState } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";
import { siteConfig } from "@/config/site";
import { scrollToFirstError } from "@/lib/form-utils";
import { FormSuccessPanel } from "@/components/common/FormSuccessPanel";

const referralSchema = z.object({
  referrerName: z.string().min(2, "Name is required"),
  referrerRole: z.string().min(2, "Role is required"),
  referrerOrganisation: z.string().min(2, "Organisation/Local Authority is required"),
  referrerEmail: z.string().email("Invalid email address"),
  referrerPhone: z.string().min(10, "Valid phone number is required"),
  childAge: z.coerce.number().min(0).max(18, "Age must be between 0 and 18"),
  childGender: z.string().min(1, "Gender is required"),
  localAuthority: z.string().min(2, "Local Authority is required"),
  placementType: z.string().min(1, "Placement type is required"),
  urgency: z.string().min(1, "Urgency is required"),
  supportNeeds: z.string().min(10, "Please provide brief details of support needs"),
  additionalInfo: z.string().optional(),
});

type ReferralFormValues = z.infer<typeof referralSchema>;

export default function Referral() {
  const submitForm = useSubmitReferralForm();
  const [referenceNumber, setReferenceNumber] = useState<string | null>(null);

  usePageMeta(pageMeta.referral.title, pageMeta.referral.description);

  const form = useForm<ReferralFormValues>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      referrerName: "",
      referrerRole: "",
      referrerOrganisation: "",
      referrerEmail: "",
      referrerPhone: "",
      childAge: undefined,
      childGender: "",
      localAuthority: "",
      placementType: "",
      urgency: "",
      supportNeeds: "",
      additionalInfo: "",
    },
  });

  function onSubmit(data: ReferralFormValues) {
    submitForm.mutate(
      { data },
      {
        onSuccess: (res) => {
          setReferenceNumber(res.referenceNumber ?? null);
          form.reset();
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      }
    );
  }

  function onInvalid() {
    scrollToFirstError(form.formState.errors);
  }

  function handleReset() {
    setReferenceNumber(null);
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Make a Referral"
        description="We work closely with Local Authorities across the UK to provide tailored placements for vulnerable children."
        breadcrumbs={[{ label: "Make a Referral" }]}
      />

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-primary mb-4">The Referral Process</h2>
              <p className="text-muted-foreground mb-6">
                Our admissions team operates a streamlined, highly responsive process to ensure children are placed quickly and safely in the right environment.
              </p>
            </div>

            <div className="space-y-4">
              <Card className="border-none shadow-sm bg-muted/50">
                <CardContent className="p-6 flex gap-4">
                  <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">1. Initial Enquiry</h3>
                    <p className="text-sm text-muted-foreground">Submit the form or call us to discuss the young person&apos;s needs.</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-muted/50">
                <CardContent className="p-6 flex gap-4">
                  <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">2. Assessment matching</h3>
                    <p className="text-sm text-muted-foreground">Our clinical and care teams review the referral to ensure we can meet the child&apos;s needs.</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-muted/50">
                <CardContent className="p-6 flex gap-4">
                  <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-bold text-primary mb-1">3. Placement Offer</h3>
                    <p className="text-sm text-muted-foreground">We aim to provide a definitive response within 2 hours for emergency placements.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary text-white p-8 rounded-xl mt-8">
              <h3 className="font-heading font-bold text-xl mb-4">Emergency Referrals</h3>
              <p className="text-primary-foreground/80 text-sm mb-6">
                For immediate, out-of-hours, or highly urgent placements, please bypass this form and call our 24/7 duty manager directly.
              </p>
              <a href={`tel:${siteConfig.phoneTel}`} className="text-2xl font-bold text-accent hover:underline">
                {siteConfig.phone}
              </a>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="border shadow-lg">
              <CardContent className="p-8">
                {referenceNumber ? (
                  <FormSuccessPanel
                    title="Referral submitted successfully"
                    message="Our admissions team will review your referral and contact you shortly. Please keep your reference number for your records."
                    referenceNumber={referenceNumber}
                    onReset={handleReset}
                  />
                ) : (
                  <>
                    <h2 className="text-2xl font-heading font-bold text-primary mb-6 border-b pb-4">Secure Referral Form</h2>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8" noValidate>
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-primary">1. Referrer Details</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="referrerName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="John Doe" autoComplete="name" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="referrerRole"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Job Title / Role <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="Social Worker" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="referrerOrganisation"
                              render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>Organisation <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="Name of Local Authority or Trust" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="referrerEmail"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Professional Email <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input type="email" placeholder="john.doe@council.gov.uk" autoComplete="email" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="referrerPhone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Direct Phone Number <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input type="tel" placeholder="01234 567890" autoComplete="tel" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                          <h3 className="text-lg font-semibold text-primary">2. Placement Requirements</h3>
                          <FormDescription>Please do not include the child&apos;s full name in this initial form for data protection.</FormDescription>

                          <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="childAge"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Child&apos;s Age <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input type="number" placeholder="e.g. 14" min={0} max={18} {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="childGender"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Gender Identity <span className="text-destructive">*</span></FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="male">Male</SelectItem>
                                      <SelectItem value="female">Female</SelectItem>
                                      <SelectItem value="non-binary">Non-binary</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="localAuthority"
                              render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                  <FormLabel>Responsible Local Authority <span className="text-destructive">*</span></FormLabel>
                                  <FormControl><Input placeholder="e.g. Camden Council" {...field} /></FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="placementType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Type of Placement <span className="text-destructive">*</span></FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="residential">Residential Care</SelectItem>
                                      <SelectItem value="supported-living">Supported Living (16+)</SelectItem>
                                      <SelectItem value="emergency">Emergency / Short Term</SelectItem>
                                      <SelectItem value="therapeutic">Specialist Therapeutic</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="urgency"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Urgency <span className="text-destructive">*</span></FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select urgency" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="immediate">Immediate / Same Day</SelectItem>
                                      <SelectItem value="within-week">Within 7 Days</SelectItem>
                                      <SelectItem value="within-month">Within 1 Month</SelectItem>
                                      <SelectItem value="planned">Planned Future Placement</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                          <h3 className="text-lg font-semibold text-primary">3. Support Needs</h3>

                          <FormField
                            control={form.control}
                            name="supportNeeds"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Brief description of primary needs and risks <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="E.g. EBD, CSE risk, missing from care history, specific therapeutic requirements..."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="additionalInfo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Any other relevant information (Optional)</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Location preferences, specific requests..." {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {submitForm.isError && (
                          <p role="alert" className="text-sm text-destructive">
                            There was an error submitting your referral. Please try again or call us on {siteConfig.phone}.
                          </p>
                        )}

                        <Button
                          type="submit"
                          variant="accent"
                          size="lg"
                          className="w-full font-bold text-lg h-14 min-h-11"
                          disabled={submitForm.isPending}
                        >
                          {submitForm.isPending ? "Submitting..." : "Submit Referral Enquiry"}
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
