import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "../components/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { adminApi } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsAdminPage() {
  const qc = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminApi.get<Record<string, unknown>>("/settings"),
  });

  const saveMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) =>
      adminApi.put(`/settings/${key}`, { value }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast({ title: "Settings saved" });
    },
  });

  if (isLoading || !data) {
    return <ProtectedRoute permission="settings.read"><AdminLayout title="Site Settings"><Skeleton className="h-64" /></AdminLayout></ProtectedRoute>;
  }

  const keys = Object.keys(data);

  return (
    <ProtectedRoute permission="settings.read">
      <AdminLayout title="Site Settings">
        <Tabs defaultValue={keys[0]}>
          <TabsList>{keys.map((k) => <TabsTrigger key={k} value={k} className="capitalize">{k}</TabsTrigger>)}</TabsList>
          {keys.map((key) => (
            <TabsContent key={key} value={key}>
              <Card>
                <CardHeader><CardTitle className="capitalize">{key}</CardTitle></CardHeader>
                <CardContent>
                  <Label>JSON settings</Label>
                  <Textarea
                    className="min-h-64 font-mono text-sm mt-2"
                    defaultValue={JSON.stringify(data[key], null, 2)}
                    id={`settings-${key}`}
                  />
                  <Button className="mt-4" onClick={() => {
                    const el = document.getElementById(`settings-${key}`) as HTMLTextAreaElement;
                    try {
                      saveMutation.mutate({ key, value: JSON.parse(el.value) });
                    } catch {
                      toast({ title: "Invalid JSON", variant: "destructive" });
                    }
                  }}>Save {key}</Button>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export function SeoAdminPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "seo"],
    queryFn: () => adminApi.get<Record<string, unknown>[]>("/seo"),
  });

  return (
    <ProtectedRoute permission="settings.read">
      <AdminLayout title="SEO Manager">
        {isLoading ? <Skeleton className="h-64" /> : (
          <div className="space-y-4">
            {(data ?? []).map((row) => (
              <Card key={String(row.path)}>
                <CardHeader><CardTitle>{String(row.path)}</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p><strong>Title:</strong> {String(row.title ?? "")}</p>
                  <p><strong>Description:</strong> {String(row.description ?? "")}</p>
                  <p><strong>Robots:</strong> {String(row.robots ?? "")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}

export function MediaAdminPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "media"],
    queryFn: () => adminApi.get<Record<string, unknown>[]>("/media"),
  });
  const { toast } = useToast();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", "media");
    fd.append("folder", "general");
    try {
      await adminApi.upload("/upload", fd);
      toast({ title: "Uploaded" });
      refetch();
    } catch (err) {
      toast({ title: "Upload failed", description: err instanceof Error ? err.message : "", variant: "destructive" });
    }
  }

  return (
    <ProtectedRoute permission="media.write">
      <AdminLayout title="Media Library">
        <div className="mb-4">
          <Label htmlFor="upload">Upload image</Label>
          <Input id="upload" type="file" accept="image/*" onChange={handleUpload} className="max-w-sm mt-2" />
        </div>
        {isLoading ? <Skeleton className="h-64" /> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(data ?? []).map((file) => (
              <Card key={String(file.id)}>
                <CardContent className="p-3">
                  <p className="text-xs truncate font-medium">{String(file.filename)}</p>
                  <p className="text-xs text-muted-foreground">{String(file.mime_type)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}

export function UsersAdminPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminApi.get<Record<string, unknown>[]>("/users"),
  });

  return (
    <ProtectedRoute permission="users.read">
      <AdminLayout title="User Management">
        {isLoading ? <Skeleton className="h-64" /> : (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-muted/50"><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Role</th><th className="p-3 text-left">Active</th></tr></thead>
              <tbody>
                {(data ?? []).map((u) => (
                  <tr key={String(u.id)} className="border-b">
                    <td className="p-3">{String(u.fullName)}</td>
                    <td className="p-3">{String(u.email)}</td>
                    <td className="p-3 capitalize">{String(u.role).replace("_", " ")}</td>
                    <td className="p-3">{u.isActive ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}

export function AuditAdminPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "audit"],
    queryFn: () => adminApi.get<Record<string, unknown>[]>("/audit-logs?limit=100"),
  });

  return (
    <ProtectedRoute permission="audit.read">
      <AdminLayout title="Audit Logs">
        {isLoading ? <Skeleton className="h-64" /> : (
          <div className="space-y-2">
            {(data ?? []).map((log) => (
              <div key={String(log.id)} className="text-sm border-b py-2">
                <span className="font-medium">{String(log.action)}</span> · {String(log.entity_type)} · {String(log.user_email ?? "system")}
                <span className="block text-xs text-muted-foreground">{String(log.created_at)}</span>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </ProtectedRoute>
  );
}
