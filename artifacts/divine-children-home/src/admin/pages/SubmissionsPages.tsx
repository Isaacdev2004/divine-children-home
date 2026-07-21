import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../components/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { adminApi } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function SubmissionsPage({
  title,
  endpoint,
  columns,
  statusField = "status",
  showStatus = true,
}: {
  title: string;
  endpoint: string;
  columns: { key: string; label: string }[];
  statusField?: string;
  showStatus?: boolean;
}) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryPath = endpoint.includes("?")
    ? endpoint
    : statusFilter !== "all" && endpoint === "referrals"
      ? `/submissions/referrals?status=${statusFilter}`
      : `/submissions/${endpoint}${search ? `?search=${encodeURIComponent(search)}` : ""}`;

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "submissions", endpoint, search, statusFilter],
    queryFn: () => adminApi.get<Record<string, unknown>[]>(queryPath),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: Record<string, unknown> }) =>
      adminApi.patch(`/submissions/${endpoint}/${id}`, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "submissions", endpoint] });
      toast({ title: "Updated" });
    },
  });

  return (
    <ProtectedRoute permission="submissions.read">
      <AdminLayout title={title}>
        <div className="flex gap-4 mb-4 flex-wrap">
          <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          {endpoint === "referrals" && (
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {["new", "assigned", "under_review", "accepted", "declined", "archived"].map((s) => (
                  <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {endpoint === "newsletter" && (
            <Button variant="outline" asChild>
              <a href="/api/admin/submissions/newsletter/export">Export CSV</a>
            </Button>
          )}
        </div>
        {isLoading ? <Skeleton className="h-64" /> : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((c) => <TableHead key={c.key}>{c.label}</TableHead>)}
                  {showStatus && <TableHead>Status</TableHead>}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data ?? []).map((row) => (
                  <TableRow key={String(row.id)}>
                    {columns.map((c) => (
                      <TableCell key={c.key} className="max-w-xs truncate">{String(row[c.key] ?? "")}</TableCell>
                    ))}
                    {showStatus && (
                    <TableCell>
                      <Select
                        value={String(row[statusField] ?? "new")}
                        onValueChange={(v) => updateMutation.mutate({ id: row.id as number, body: { status: v } })}
                      >
                        <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["new", "assigned", "under_review", "accepted", "declined", "archived"].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    )}
                    <TableCell>
                      {endpoint === "applications" && Boolean(row.cv_url) && (
                        <Button size="sm" variant="outline" onClick={async () => {
                          const { url } = await adminApi.get<{ url: string }>(`/submissions/applications/${row.id}/cv`);
                          window.open(url, "_blank");
                        }}>Download CV</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}

export function ReferralsAdminPage() {
  return (
    <SubmissionsPage
      title="Referrals"
      endpoint="referrals"
      columns={[
        { key: "reference_number", label: "Reference" },
        { key: "referrer_name", label: "Referrer" },
        { key: "urgency", label: "Urgency" },
        { key: "placement_type", label: "Placement" },
      ]}
    />
  );
}

export function ContactsAdminPage() {
  return (
    <SubmissionsPage
      title="Contact Enquiries"
      endpoint="contacts"
      columns={[
        { key: "reference_number", label: "Reference" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "subject", label: "Subject" },
      ]}
    />
  );
}

export function ApplicationsAdminPage() {
  return (
    <SubmissionsPage
      title="Job Applications"
      endpoint="applications"
      columns={[
        { key: "reference_number", label: "Reference" },
        { key: "first_name", label: "First name" },
        { key: "last_name", label: "Last name" },
        { key: "position", label: "Position" },
      ]}
    />
  );
}

export function NewsletterAdminPage() {
  return (
    <SubmissionsPage
      title="Newsletter Subscribers"
      endpoint="newsletter"
      showStatus={false}
      columns={[
        { key: "email", label: "Email" },
        { key: "name", label: "Name" },
        { key: "subscribed_at", label: "Subscribed" },
      ]}
    />
  );
}
