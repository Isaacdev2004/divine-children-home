import { CrudResourcePage, FormField, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/CrudResourcePage";

interface Home { id: number; name: string; status?: string; }
interface Service { id: number; title: string; isFeatured?: boolean; }
interface Resource { id: number; title: string; category: string; }

export function HomesAdminPage() {
  return (
    <CrudResourcePage<Home>
      title="Homes"
      endpoint="homes"
      columns={[{ key: "name", label: "Name" }, { key: "status", label: "Status" }]}
      defaultForm={{ name: "", description: "", address: "", capacity: 0, services: [], facilities: [], imageUrls: [], status: "draft", sortOrder: 0 }}
      renderForm={(form, setForm) => (
        <>
          <FormField label="Name"><Input value={String(form.name ?? "")} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Description"><Textarea value={String(form.description ?? "")} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <FormField label="Address"><Input value={String(form.address ?? "")} onChange={(e) => setForm({ ...form, address: e.target.value })} /></FormField>
          <FormField label="Capacity"><Input type="number" value={String(form.capacity ?? 0)} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value, 10) })} /></FormField>
          <FormField label="Status">
            <Select value={String(form.status ?? "draft")} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </>
      )}
    />
  );
}

export function ServicesAdminPage() {
  return (
    <CrudResourcePage<Service>
      title="Services"
      endpoint="services"
      columns={[{ key: "title", label: "Title" }]}
      defaultForm={{ title: "", description: "", icon: "Heart", displayOrder: 0, isFeatured: false, status: "published" }}
      renderForm={(form, setForm) => (
        <>
          <FormField label="Title"><Input value={String(form.title ?? "")} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Description"><Textarea value={String(form.description ?? "")} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <FormField label="Icon (Lucide name)"><Input value={String(form.icon ?? "")} onChange={(e) => setForm({ ...form, icon: e.target.value })} /></FormField>
        </>
      )}
    />
  );
}

export function ResourcesAdminPage() {
  return (
    <CrudResourcePage<Resource>
      title="Resources"
      endpoint="resources"
      columns={[{ key: "title", label: "Title" }, { key: "category", label: "Category" }]}
      defaultForm={{ title: "", description: "", category: "Policies", fileUrl: "", fileName: "", status: "published", sortOrder: 0 }}
      renderForm={(form, setForm) => (
        <>
          <FormField label="Title"><Input value={String(form.title ?? "")} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Category"><Input value={String(form.category ?? "")} onChange={(e) => setForm({ ...form, category: e.target.value })} /></FormField>
          <FormField label="File URL"><Input value={String(form.fileUrl ?? "")} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} /></FormField>
          <FormField label="File name"><Input value={String(form.fileName ?? "")} onChange={(e) => setForm({ ...form, fileName: e.target.value })} /></FormField>
        </>
      )}
    />
  );
}
