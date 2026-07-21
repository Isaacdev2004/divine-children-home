import { CrudResourcePage, FormField, Input, Textarea, Switch } from "../components/CrudResourcePage";

interface Job {
  id: number;
  title: string;
  department: string;
  isActive?: boolean;
}

export default function CareersAdminPage() {
  return (
    <CrudResourcePage<Job>
      title="Jobs"
      endpoint="jobs"
      columns={[
        { key: "title", label: "Title" },
        { key: "department", label: "Department" },
        { key: "isActive", label: "Active", render: (r) => (r.isActive ? "Yes" : "No") },
      ]}
      defaultForm={{
        title: "",
        department: "",
        location: "",
        type: "Full-time",
        description: "",
        requirements: "",
        salary: "",
        isActive: true,
        status: "published",
      }}
      renderForm={(form, setForm) => (
        <>
          <FormField label="Title"><Input value={String(form.title ?? "")} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Department"><Input value={String(form.department ?? "")} onChange={(e) => setForm({ ...form, department: e.target.value })} /></FormField>
          <FormField label="Location"><Input value={String(form.location ?? "")} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
          <FormField label="Type"><Input value={String(form.type ?? "")} onChange={(e) => setForm({ ...form, type: e.target.value })} /></FormField>
          <FormField label="Salary"><Input value={String(form.salary ?? "")} onChange={(e) => setForm({ ...form, salary: e.target.value })} /></FormField>
          <FormField label="Description"><Textarea className="min-h-32" value={String(form.description ?? "")} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <FormField label="Requirements"><Textarea value={String(form.requirements ?? "")} onChange={(e) => setForm({ ...form, requirements: e.target.value })} /></FormField>
          <div className="flex items-center gap-2">
            <Switch checked={Boolean(form.isActive)} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            <span className="text-sm">Active listing</span>
          </div>
        </>
      )}
    />
  );
}
