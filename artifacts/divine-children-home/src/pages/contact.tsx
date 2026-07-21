import { PageHeader } from "@/components/page-header";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useListJobs, useSubmitContactForm } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearch } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";
import { siteConfig } from "@/config/site";
import { scrollToFirstError } from "@/lib/form-utils";
import { FormSuccessPanel } from "@/components/common/FormSuccessPanel";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  organisation: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const submitForm = useSubmitContactForm();
  const search = useSearch();
  const jobId = new URLSearchParams(search).get("job");
  const { data: jobs } = useListJobs();
  const [submitted, setSubmitted] = useState(false);

  usePageMeta(pageMeta.contact.title, pageMeta.contact.description);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organisation: "",
      subject: "",
      message: "",
    },
  });

  useEffect(() => {
    if (!jobId || !jobs) return;
    const job = jobs.find((j) => String(j.id) === jobId);
    if (job) {
      form.setValue("subject", `Application: ${job.title}`);
      form.setValue(
        "message",
        `I would like to apply for the ${job.title} position (${job.location}).\n\nPlease find my details below and let me know the next steps.`
      );
      return;
    }
    const subjectParam = new URLSearchParams(search).get("subject");
    if (subjectParam) {
      form.setValue("subject", subjectParam);
    }
  }, [jobId, jobs, search, form]);

  function onSubmit(data: ContactFormValues) {
    submitForm.mutate(
      { data },
      {
        onSuccess: () => {
          setSubmitted(true);
          form.reset();
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
      }
    );
  }

  function onInvalid() {
    scrollToFirstError(form.formState.errors);
  }

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Contact Us"
        description="Whether you're looking to make a referral, enquire about careers, or speak to management, our team is here to help."
        breadcrumbs={[{ label: "Contact" }]}
      />

      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-primary mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                For emergency out-of-hours referrals, please call our 24/7 duty line directly rather than using the form.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0 text-primary">
                  <Phone className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Phone</h3>
                  <a
                    href={`tel:${siteConfig.phoneTel}`}
                    className="text-lg font-semibold mt-1 block hover:text-secondary transition-colors"
                  >
                    {siteConfig.phone}
                  </a>
                  <p className="text-sm text-muted-foreground">Available 24/7 for emergencies</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0 text-primary">
                  <Mail className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Email</h3>
                  <a
                    href={`mailto:${siteConfig.infoEmail}`}
                    className="text-muted-foreground mt-1 block hover:text-primary transition-colors"
                  >
                    {siteConfig.infoEmail}
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Referrals:{" "}
                    <a href={`mailto:${siteConfig.email}`} className="hover:text-primary transition-colors">
                      {siteConfig.email}
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0 text-primary">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Head Office</h3>
                  <p className="text-muted-foreground mt-1 leading-relaxed">
                    Divine Children Home Ltd<br />
                    123 Care Avenue<br />
                    London, UK<br />
                    LDN 123
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full shrink-0 text-primary">
                  <Clock className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-primary">Office Hours</h3>
                  <p className="text-muted-foreground mt-1">Monday – Friday: 9am – 5pm</p>
                  <p className="text-sm text-muted-foreground mt-1">Homes operate 24/7/365</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card className="border shadow-lg">
              <CardContent className="p-8">
                {submitted ? (
                  <FormSuccessPanel
                    title="Message sent"
                    message="Thank you for contacting us. A member of our team will respond within one working day."
                    onReset={() => setSubmitted(false)}
                  />
                ) : (
                  <>
                    <h3 className="text-2xl font-heading font-bold text-primary mb-6">Send us a Message</h3>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6" noValidate>
                        <div className="grid md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Your Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Input placeholder="John Doe" autoComplete="name" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="organisation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Organisation (Optional)</FormLabel>
                                <FormControl><Input placeholder="Local Authority / Company" autoComplete="organization" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Input type="email" placeholder="john@example.com" autoComplete="email" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number <span className="text-destructive">*</span></FormLabel>
                                <FormControl><Input type="tel" placeholder="01234 567890" autoComplete="tel" {...field} /></FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject <span className="text-destructive">*</span></FormLabel>
                              <FormControl><Input placeholder="How can we help you?" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message <span className="text-destructive">*</span></FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please provide details of your enquiry..."
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {submitForm.isError && (
                          <p role="alert" className="text-sm text-destructive">
                            Failed to send message. Please try again or call us on {siteConfig.phone}.
                          </p>
                        )}

                        <Button
                          type="submit"
                          variant="accent"
                          size="lg"
                          className="w-full sm:w-auto font-bold px-8 min-h-11"
                          disabled={submitForm.isPending}
                        >
                          {submitForm.isPending ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </Form>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-20 w-full h-[400px] bg-muted rounded-xl border flex flex-col items-center justify-center text-muted-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=London,UK&zoom=12&size=1000x400&maptype=roadmap&key=placeholder')] bg-cover bg-center opacity-50 grayscale" aria-hidden="true" />
          <div className="relative z-10 bg-white/90 backdrop-blur p-6 rounded-lg shadow-sm text-center">
            <MapPin className="h-8 w-8 text-primary mx-auto mb-2" aria-hidden="true" />
            <p className="font-semibold text-primary">Head Office Location</p>
            <p className="text-sm">London, UK</p>
          </div>
        </div>
      </div>
    </div>
  );
}
