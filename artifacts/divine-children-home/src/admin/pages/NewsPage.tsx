import {
  CrudResourcePage,
  FormField,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from "../components/CrudResourcePage";

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  category: string;
  status?: string;
  isFeatured?: boolean;
}

export default function NewsPage() {
  return (
    <CrudResourcePage<NewsItem>
      title="News"
      endpoint="news"
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status", render: (r) => String((r as unknown as Record<string, unknown>).status ?? "published") },
      ]}
      defaultForm={{
        title: "",
        excerpt: "",
        content: "",
        category: "General",
        imageUrl: "",
        author: "",
        status: "draft",
        isFeatured: false,
        tags: [],
        seoTitle: "",
        seoDescription: "",
      }}
      renderForm={(form, setForm) => (
        <>
          <FormField label="Title">
            <Input value={String(form.title ?? "")} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Excerpt">
            <Textarea value={String(form.excerpt ?? "")} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </FormField>
          <FormField label="Content (HTML)">
            <Textarea className="min-h-40 font-mono text-sm" value={String(form.content ?? "")} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          </FormField>
          <FormField label="Category">
            <Input value={String(form.category ?? "")} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </FormField>
          <FormField label="Image URL">
            <Input value={String(form.imageUrl ?? "")} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
          </FormField>
          <FormField label="Status">
            <Select value={String(form.status ?? "draft")} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="SEO title">
            <Input value={String(form.seoTitle ?? "")} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} />
          </FormField>
          <FormField label="SEO description">
            <Textarea value={String(form.seoDescription ?? "")} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} />
          </FormField>
          <div className="flex items-center gap-2">
            <Switch checked={Boolean(form.isFeatured)} onCheckedChange={(v) => setForm({ ...form, isFeatured: v })} />
            <span className="text-sm">Featured article</span>
          </div>
        </>
      )}
    />
  );
}
