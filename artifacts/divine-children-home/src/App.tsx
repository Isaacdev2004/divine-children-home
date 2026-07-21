import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router as WouterRouter, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Layout } from '@/components/layout/layout';
import { CookieConsent } from '@/components/cookie-consent';
import { BackToTop } from '@/components/back-to-top';
import { ScrollToTop } from '@/components/scroll-to-top';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { OfflineBanner } from '@/components/OfflineBanner';
import { AppRoutes } from '@/app/routes';
import { AdminApp } from '@/admin/AdminApp';
import { useEffect } from 'react';
import { initMonitoring } from '@/lib/monitoring';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: (failureCount, error) => {
        if (typeof navigator !== "undefined" && !navigator.onLine) return false;
        if (failureCount >= 2) return false;
        const status = (error as { status?: number })?.status;
        if (status && status >= 400 && status < 500) return false;
        return true;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

function PublicApp() {
  return (
    <ErrorBoundary>
      <Layout>
        <ScrollToTop />
        <AppRoutes />
      </Layout>
    </ErrorBoundary>
  );
}

function App() {
  useEffect(() => {
    initMonitoring();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary fallbackTitle="Application error">
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Switch>
              <Route path="/admin/:rest*" component={AdminApp} />
              <Route path="/admin" component={AdminApp} />
              <Route component={PublicApp} />
            </Switch>
          </WouterRouter>
          <OfflineBanner />
          <CookieConsent />
          <BackToTop />
          <Toaster />
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
