import { CrudResourcePage, FormField, Input, Switch } from "../components/CrudResourcePage";

interface GalleryItem {
  id: number;
  title: string;
  category: string;
}

export default function GalleryAdminPage() {
  return (
    <CrudResourcePage<GalleryItem>
      title="Gallery"
      endpoint="gallery"
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
      ]}
      defaultForm={{ title: "", imageUrl: "", category: "General", caption: "", sortOrder: 0 }}
      renderForm={(form, setForm) => (
        <>
          <FormField label="Title"><Input value={String(form.title ?? "")} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Image URL"><Input value={String(form.imageUrl ?? "")} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></FormField>
          <FormField label="Category"><Input value={String(form.category ?? "")} onChange={(e) => setForm({ ...form, category: e.target.value })} /></FormField>
          <FormField label="Caption"><Input value={String(form.caption ?? "")} onChange={(e) => setForm({ ...form, caption: e.target.value })} /></FormField>
          <FormField label="Sort order"><Input type="number" value={String(form.sortOrder ?? 0)} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) })} /></FormField>
        </>
      )}
    />
  );
}
