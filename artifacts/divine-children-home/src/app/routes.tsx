import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { PageLoader } from "@/components/common/PageLoader";

const Home = lazy(() => import("@/pages/home"));
const About = lazy(() => import("@/pages/about"));
const Homes = lazy(() => import("@/pages/homes"));
const Services = lazy(() => import("@/pages/services"));
const Referral = lazy(() => import("@/pages/referral"));
const Careers = lazy(() => import("@/pages/careers"));
const News = lazy(() => import("@/pages/news"));
const NewsArticle = lazy(() => import("@/pages/news-article"));
const Resources = lazy(() => import("@/pages/resources"));
const Contact = lazy(() => import("@/pages/contact"));
const Safeguarding = lazy(() => import("@/pages/safeguarding"));
const FAQs = lazy(() => import("@/pages/faqs"));
const Gallery = lazy(() => import("@/pages/gallery"));
const Legal = lazy(() => import("@/pages/legal"));
const NotFound = lazy(() => import("@/pages/not-found"));

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/homes" component={Homes} />
        <Route path="/services" component={Services} />
        <Route path="/referral" component={Referral} />
        <Route path="/careers" component={Careers} />
        <Route path="/news" component={News} />
        <Route path="/news/:slug" component={NewsArticle} />
        <Route path="/resources" component={Resources} />
        <Route path="/contact" component={Contact} />
        <Route path="/safeguarding" component={Safeguarding} />
        <Route path="/faqs" component={FAQs} />
        <Route path="/gallery" component={Gallery} />
        <Route path="/privacy" component={() => <Legal type="privacy" />} />
        <Route path="/terms" component={() => <Legal type="terms" />} />
        <Route path="/cookies" component={() => <Legal type="cookies" />} />
        <Route path="/complaints" component={() => <Legal type="complaints" />} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}
