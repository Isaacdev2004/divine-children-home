import { CrudResourcePage, FormField, Input, Textarea, Switch } from "../components/CrudResourcePage";

interface Testimonial {
  id: number;
  name: string;
  organisation: string;
}

export default function TestimonialsAdminPage() {
  return (
    <CrudResourcePage<Testimonial>
      title="Testimonials"
      endpoint="testimonials"
      columns={[
        { key: "name", label: "Name" },
        { key: "organisation", label: "Organisation" },
      ]}
      defaultForm={{
        name: "", role: "", organisation: "", quote: "", rating: 5,
        avatarUrl: "", isApproved: false, isFeatured: false, sortOrder: 0,
      }}
      renderForm={(form, setForm) => (
        <>
          <FormField label="Name"><Input value={String(form.name ?? "")} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <FormField label="Role"><Input value={String(form.role ?? "")} onChange={(e) => setForm({ ...form, role: e.target.value })} /></FormField>
          <FormField label="Organisation"><Input value={String(form.organisation ?? "")} onChange={(e) => setForm({ ...form, organisation: e.target.value })} /></FormField>
          <FormField label="Quote"><Textarea value={String(form.quote ?? "")} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></FormField>
          <FormField label="Rating"><Input type="number" min={1} max={5} value={String(form.rating ?? 5)} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value, 10) })} /></FormField>
          <div className="flex items-center gap-2 mb-2">
            <Switch checked={Boolean(form.isApproved)} onCheckedChange={(v) => setForm({ ...form, isApproved: v })} />
            <span className="text-sm">Approved</span>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={Boolean(form.isFeatured)} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} />
            <span className="text-sm">Featured</span>
          </div>
        </>
      )}
    />
  );
}
