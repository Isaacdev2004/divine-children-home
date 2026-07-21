import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  HelpCircle,
  Image,
  MessageSquare,
  Home,
  Wrench,
  FileText,
  Users,
  Mail,
  Send,
  Settings,
  Search,
  FolderOpen,
  Shield,
  BarChart3,
  BookOpen,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "../context/AuthProvider";
import { canAccess } from "../lib/permissions";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

const navGroups = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard.view" as const },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/homepage", label: "Homepage", icon: Home, permission: "content.write" as const },
      { href: "/admin/about", label: "About", icon: BookOpen, permission: "content.write" as const },
      { href: "/admin/homes", label: "Our Homes", icon: Home, permission: "content.write" as const },
      { href: "/admin/services", label: "Services", icon: Wrench, permission: "content.write" as const },
      { href: "/admin/news", label: "News", icon: Newspaper, permission: "content.write" as const },
      { href: "/admin/gallery", label: "Gallery", icon: Image, permission: "content.write" as const },
      { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare, permission: "content.write" as const },
      { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, permission: "content.write" as const },
      { href: "/admin/resources", label: "Resources", icon: FileText, permission: "content.write" as const },
      { href: "/admin/careers", label: "Careers", icon: Briefcase, permission: "content.write" as const },
    ],
  },
  {
    label: "Submissions",
    items: [
      { href: "/admin/referrals", label: "Referrals", icon: Send, permission: "submissions.read" as const },
      { href: "/admin/contacts", label: "Contacts", icon: Mail, permission: "submissions.read" as const },
      { href: "/admin/applications", label: "Applications", icon: Briefcase, permission: "submissions.read" as const },
      { href: "/admin/newsletter", label: "Newsletter", icon: Users, permission: "submissions.read" as const },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/media", label: "Media Library", icon: FolderOpen, permission: "media.write" as const },
      { href: "/admin/seo", label: "SEO Manager", icon: Search, permission: "settings.read" as const },
      { href: "/admin/settings", label: "Site Settings", icon: Settings, permission: "settings.read" as const },
      { href: "/admin/users", label: "Users", icon: Shield, permission: "users.read" as const },
      { href: "/admin/audit", label: "Audit Logs", icon: BarChart3, permission: "audit.read" as const },
    ],
  },
];

export function AdminSidebar() {
  const [location] = useLocation();
  const { profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <div className="flex flex-col">
          <span className="font-heading font-bold text-primary">DCH Admin</span>
          <span className="text-xs text-muted-foreground truncate">{profile?.email}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group) => {
          const items = group.items.filter((item) =>
            canAccess(profile?.role, item.permission),
          );
          if (items.length === 0) return null;
          return (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={location === item.href || (item.href !== "/admin" && location.startsWith(item.href))}>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter className="border-t p-2 gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </Button>
        <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={() => signOut()}>
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export function AdminShell({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
          <SidebarTrigger />
          {title && <h1 className="text-lg font-semibold">{title}</h1>}
        </header>
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
