import { Redirect } from "wouter";
import { useAuth } from "../context/AuthProvider";
import { PageLoader } from "@/components/common/PageLoader";
import type { Permission } from "../lib/permissions";
import { canAccess } from "../lib/permissions";

export function ProtectedRoute({
  children,
  permission = "dashboard.view",
}: {
  children: React.ReactNode;
  permission?: Permission;
}) {
  const { isAuthenticated, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return <Redirect to="/admin/login" />;
  }

  if (!canAccess(profile.role, permission)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Access denied</h1>
          <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
