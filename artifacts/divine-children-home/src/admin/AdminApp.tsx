import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import { AuthProvider } from "./context/AuthProvider";
import { ThemeProvider } from "next-themes";
import { PageLoader } from "@/components/common/PageLoader";
import { Toaster } from "@/components/ui/toaster";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const CareersAdminPage = lazy(() => import("./pages/CareersAdminPage"));
const FaqsAdminPage = lazy(() => import("./pages/FaqsAdminPage"));
const GalleryAdminPage = lazy(() => import("./pages/GalleryAdminPage"));
const TestimonialsAdminPage = lazy(() => import("./pages/TestimonialsAdminPage"));
const HomepageAdminPage = lazy(() => import("./pages/PageSectionsAdmin").then((m) => ({ default: m.HomepageAdminPage })));
const AboutAdminPage = lazy(() => import("./pages/PageSectionsAdmin").then((m) => ({ default: m.AboutAdminPage })));
const HomesAdminPage = lazy(() => import("./pages/ContentPages").then((m) => ({ default: m.HomesAdminPage })));
const ServicesAdminPage = lazy(() => import("./pages/ContentPages").then((m) => ({ default: m.ServicesAdminPage })));
const ResourcesAdminPage = lazy(() => import("./pages/ContentPages").then((m) => ({ default: m.ResourcesAdminPage })));
const ReferralsAdminPage = lazy(() => import("./pages/SubmissionsPages").then((m) => ({ default: m.ReferralsAdminPage })));
const ContactsAdminPage = lazy(() => import("./pages/SubmissionsPages").then((m) => ({ default: m.ContactsAdminPage })));
const ApplicationsAdminPage = lazy(() => import("./pages/SubmissionsPages").then((m) => ({ default: m.ApplicationsAdminPage })));
const NewsletterAdminPage = lazy(() => import("./pages/SubmissionsPages").then((m) => ({ default: m.NewsletterAdminPage })));
const SettingsAdminPage = lazy(() => import("./pages/SystemPages"));
const MediaAdminPage = lazy(() => import("./pages/SystemPages").then((m) => ({ default: m.MediaAdminPage })));
const SeoAdminPage = lazy(() => import("./pages/SystemPages").then((m) => ({ default: m.SeoAdminPage })));
const UsersAdminPage = lazy(() => import("./pages/SystemPages").then((m) => ({ default: m.UsersAdminPage })));
const AuditAdminPage = lazy(() => import("./pages/SystemPages").then((m) => ({ default: m.AuditAdminPage })));

export function AdminApp() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="dch-admin-theme">
      <AuthProvider>
        <div className="admin-root min-h-screen bg-background text-foreground">
          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/admin/login" component={LoginPage} />
              <Route path="/admin/forgot-password" component={ForgotPasswordPage} />
              <Route path="/admin" component={DashboardPage} />
              <Route path="/admin/news" component={NewsPage} />
              <Route path="/admin/careers" component={CareersAdminPage} />
              <Route path="/admin/faqs" component={FaqsAdminPage} />
              <Route path="/admin/gallery" component={GalleryAdminPage} />
              <Route path="/admin/testimonials" component={TestimonialsAdminPage} />
              <Route path="/admin/homepage" component={HomepageAdminPage} />
              <Route path="/admin/about" component={AboutAdminPage} />
              <Route path="/admin/homes" component={HomesAdminPage} />
              <Route path="/admin/services" component={ServicesAdminPage} />
              <Route path="/admin/resources" component={ResourcesAdminPage} />
              <Route path="/admin/referrals" component={ReferralsAdminPage} />
              <Route path="/admin/contacts" component={ContactsAdminPage} />
              <Route path="/admin/applications" component={ApplicationsAdminPage} />
              <Route path="/admin/newsletter" component={NewsletterAdminPage} />
              <Route path="/admin/media" component={MediaAdminPage} />
              <Route path="/admin/seo" component={SeoAdminPage} />
              <Route path="/admin/settings" component={SettingsAdminPage} />
              <Route path="/admin/users" component={UsersAdminPage} />
              <Route path="/admin/audit" component={AuditAdminPage} />
            </Switch>
          </Suspense>
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
