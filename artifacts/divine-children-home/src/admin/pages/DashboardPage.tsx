import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "../components/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { adminApi, type DashboardData } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Mail,
  Send,
  Briefcase,
  Newspaper,
  Image,
  MessageSquare,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

function StatCard({
  title,
  value,
  icon: Icon,
  href,
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
}) {
  const content = (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function mergeChartData(data: DashboardData["charts"]) {
  const dates = new Set<string>();
  Object.values(data).forEach((series) => series.forEach((p) => dates.add(p.date)));
  return [...dates].sort().map((date) => ({
    date,
    referrals: data.referrals.find((p) => p.date === date)?.count ?? 0,
    applications: data.applications.find((p) => p.date === date)?.count ?? 0,
    contacts: data.contacts.find((p) => p.date === date)?.count ?? 0,
    subscribers: data.subscribers.find((p) => p.date === date)?.count ?? 0,
  }));
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => adminApi.get<DashboardData>("/dashboard"),
  });

  return (
    <ProtectedRoute>
      <AdminLayout title="Dashboard">
        {isLoading || !data ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard title="Referrals" value={data.counts.referrals} icon={Send} href="/admin/referrals" />
              <StatCard title="Applications" value={data.counts.applications} icon={Briefcase} href="/admin/applications" />
              <StatCard title="Contact enquiries" value={data.counts.contacts} icon={Mail} href="/admin/contacts" />
              <StatCard title="Newsletter" value={data.counts.subscribers} icon={Users} href="/admin/newsletter" />
              <StatCard title="Published news" value={data.counts.news} icon={Newspaper} href="/admin/news" />
              <StatCard title="Gallery images" value={data.counts.gallery} icon={Image} href="/admin/gallery" />
              <StatCard title="Testimonials" value={data.counts.testimonials} icon={MessageSquare} href="/admin/testimonials" />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Activity (last 30 days)</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mergeChartData(data.charts)}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="referrals" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="applications" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="contacts" stroke="#4FA9DD" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="subscribers" stroke="#22c55e" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent referrals</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/referrals">View all</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.recentReferrals.map((r: Record<string, string>) => (
                      <li key={r.id} className="flex justify-between text-sm border-b pb-2">
                        <span>{r.referrer_name} · {r.reference_number}</span>
                        <span className="text-muted-foreground capitalize">{r.status}</span>
                      </li>
                    ))}
                    {data.recentReferrals.length === 0 && (
                      <p className="text-sm text-muted-foreground">No referrals yet.</p>
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {data.recentActivity.map((a: Record<string, string>) => (
                      <li key={a.id} className="text-sm border-b pb-2">
                        <span className="font-medium">{a.action}</span> {a.entity_type}
                        <span className="block text-xs text-muted-foreground">
                          {a.user_email} · {format(new Date(a.created_at), "dd MMM yyyy HH:mm")}
                        </span>
                      </li>
                    ))}
                    {data.recentActivity.length === 0 && (
                      <p className="text-sm text-muted-foreground">No activity logged yet.</p>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild><Link href="/admin/news">Manage news</Link></Button>
              <Button variant="outline" asChild><Link href="/admin/referrals">Review referrals</Link></Button>
              <Button variant="outline" asChild><Link href="/admin/media">Media library</Link></Button>
            </div>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
