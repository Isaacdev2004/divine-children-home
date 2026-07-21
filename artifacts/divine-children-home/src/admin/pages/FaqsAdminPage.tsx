import { CrudResourcePage, FormField, Input, Textarea } from "../components/CrudResourcePage";

interface Faq {
  id: number;
  question: string;
  category: string;
}

export default function FaqsAdminPage() {
  return (
    <CrudResourcePage<Faq>
      title="FAQs"
      endpoint="faqs"
      columns={[
        { key: "question", label: "Question" },
        { key: "category", label: "Category" },
      ]}
      defaultForm={{ question: "", answer: "", category: "General", sortOrder: 0 }}
      renderForm={(form, setForm) => (
        <>
          <FormField label="Question"><Input value={String(form.question ?? "")} onChange={(e) => setForm({ ...form, question: e.target.value })} /></FormField>
          <FormField label="Answer"><Textarea className="min-h-24" value={String(form.answer ?? "")} onChange={(e) => setForm({ ...form, answer: e.target.value })} /></FormField>
          <FormField label="Category"><Input value={String(form.category ?? "")} onChange={(e) => setForm({ ...form, category: e.target.value })} /></FormField>
          <FormField label="Sort order"><Input type="number" value={String(form.sortOrder ?? 0)} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value, 10) })} /></FormField>
        </>
      )}
    />
  );
}
