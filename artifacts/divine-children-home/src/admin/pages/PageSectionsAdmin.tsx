import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { adminApi } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageSectionsAdmin({ pageKey, title }: { pageKey: string; title: string }) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "page-sections", pageKey],
    queryFn: () => adminApi.get<Record<string, unknown>[]>(`/page-sections?pageKey=${pageKey}`),
  });

  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => adminApi.put("/page-sections", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "page-sections", pageKey] });
      setEditing(null);
      toast({ title: "Section saved" });
    },
  });

  if (isLoading) return <ProtectedRoute permission="content.write"><AdminLayout title={title}><Skeleton className="h-64" /></AdminLayout></ProtectedRoute>;

  return (
    <ProtectedRoute permission="content.write">
      <AdminLayout title={title}>
        <div className="grid gap-4">
          {(data ?? []).map((section) => (
            <Card key={String(section.section_key)}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base capitalize">{String(section.section_key)}</CardTitle>
                <Button size="sm" variant="outline" onClick={() => setEditing(section as Record<string, unknown>)}>Edit</Button>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-32">
                  {JSON.stringify(section.content, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>

        {editing && (
          <Card className="mt-6">
            <CardHeader><CardTitle>Edit {String(editing.section_key)}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Title</Label><Input value={String(editing.title ?? "")} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Content (JSON)</Label><Textarea className="min-h-48 font-mono text-sm" value={JSON.stringify(editing.content, null, 2)} onChange={(e) => { try { setEditing({ ...editing, content: JSON.parse(e.target.value) }); } catch { /* typing */ } }} /></div>
              <Button onClick={() => saveMutation.mutate({ pageKey, sectionKey: editing.section_key, title: editing.title, content: editing.content, sortOrder: editing.sort_order })}>Save section</Button>
            </CardContent>
          </Card>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}

export function HomepageAdminPage() {
  return <PageSectionsAdmin pageKey="homepage" title="Homepage CMS" />;
}

export function AboutAdminPage() {
  return <PageSectionsAdmin pageKey="about" title="About CMS" />;
}
