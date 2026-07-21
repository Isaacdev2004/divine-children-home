import { AdminShell } from "./AdminSidebar";

export function AdminLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return <AdminShell title={title}>{children}</AdminShell>;
}
