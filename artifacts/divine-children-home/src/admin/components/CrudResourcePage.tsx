import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { AdminLayout } from "../components/AdminLayout";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { adminApi } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

interface CrudResourcePageProps<T extends { id: number }> {
  title: string;
  endpoint: string;
  permission?: "content.write";
  columns: { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }[];
  defaultForm: Record<string, unknown>;
  renderForm: (
    form: Record<string, unknown>,
    setForm: (f: Record<string, unknown>) => void,
  ) => React.ReactNode;
}

export function CrudResourcePage<T extends { id: number }>({
  title,
  endpoint,
  columns,
  defaultForm,
  renderForm,
}: CrudResourcePageProps<T>) {
  const qc = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", endpoint],
    queryFn: () => adminApi.get<T[]>(`/${endpoint}`),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      editingId
        ? adminApi.patch<T>(`/${endpoint}/${editingId}`, payload)
        : adminApi.post<T>(`/${endpoint}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", endpoint] });
      setOpen(false);
      setEditingId(null);
      setForm(defaultForm);
      toast({ title: editingId ? "Updated" : "Created" });
    },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.delete(`/${endpoint}/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", endpoint] });
      setDeleteId(null);
      toast({ title: "Deleted" });
    },
  });

  function openCreate() {
    setEditingId(null);
    setForm(defaultForm);
    setOpen(true);
  }

  function openEdit(row: T) {
    setEditingId(row.id);
    setForm(row as unknown as Record<string, unknown>);
    setOpen(true);
  }

  return (
    <ProtectedRoute permission="content.write">
      <AdminLayout title={title}>
        <div className="flex justify-between mb-6">
          <p className="text-muted-foreground">Manage {title.toLowerCase()} content.</p>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" /> Add new</Button>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((c) => (
                    <TableHead key={String(c.key)}>{c.label}</TableHead>
                  ))}
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data ?? []).map((row) => (
                  <TableRow key={row.id}>
                    {columns.map((c) => (
                      <TableCell key={String(c.key)}>
                        {c.render
                          ? c.render(row)
                          : String((row as Record<string, unknown>)[c.key as string] ?? "")}
                      </TableCell>
                    ))}
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(row)} aria-label="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(row.id)} aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {(data ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">
                      No items yet. Click &quot;Add new&quot; to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit" : "Create"} {title.slice(0, -1)}</DialogTitle>
            </DialogHeader>
            {renderForm(form, setForm)}
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => saveMutation.mutate(form)} disabled={saveMutation.isPending}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this item?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteId && deleteMutation.mutate(deleteId)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </ProtectedRoute>
  );
}

export function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2 mb-4">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export { Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch };
