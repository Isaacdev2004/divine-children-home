import { PageHeader } from "@/components/page-header";
import { usePageMeta } from "@/hooks/usePageMeta";
import { pageMeta } from "@/config/page-meta";

const getLegalContent = (type: string) => {
  switch (type) {
    case 'privacy':
      return {
        title: "Privacy Policy",
        content: `
          <h2 class="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
          <p>Divine Children Home Ltd ("we", "our", "us") is committed to protecting and respecting your privacy. This policy sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed by us.</p>
          
          <h2 class="text-2xl font-bold mt-8 mb-4">2. Information We Collect</h2>
          <p>We may collect and process the following data about you:</p>
          <ul>
            <li>Information you provide by filling in forms on our site.</li>
            <li>If you contact us, we may keep a record of that correspondence.</li>
            <li>Details of referrals and placement enquiries.</li>
            <li>Information related to career applications.</li>
          </ul>

          <h2 class="text-2xl font-bold mt-8 mb-4">3. Data Security and Safeguarding</h2>
          <p>Due to the nature of our work in residential childcare, the security of personal data is treated with the utmost seriousness. All information provided regarding vulnerable children is processed securely in accordance with GDPR and safeguarding regulations.</p>

          <h2 class="text-2xl font-bold mt-8 mb-4">4. Disclosure of Your Information</h2>
          <p>We may disclose your personal information to third parties if we are under a duty to disclose or share your personal data in order to comply with any legal obligation, particularly concerning safeguarding and child protection (e.g., sharing with Local Authorities, Ofsted, or Police).</p>
        `
      };
    case 'terms':
      return {
        title: "Terms & Conditions",
        content: `
          <h2 class="text-2xl font-bold mt-8 mb-4">1. Website Use</h2>
          <p>Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use.</p>
          
          <h2 class="text-2xl font-bold mt-8 mb-4">2. Accuracy of Information</h2>
          <p>While we endeavour to keep the information up to date and correct, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, services, or related graphics contained on the website.</p>

          <h2 class="text-2xl font-bold mt-8 mb-4">3. Placements and Referrals</h2>
          <p>The submission of a referral form via this website does not constitute an agreement or guarantee of placement. All placements are subject to comprehensive assessment, matching, and formal contracting with the relevant Local Authority.</p>
        `
      };
    case 'cookies':
      return {
        title: "Cookie Policy",
        content: `
          <h2 class="text-2xl font-bold mt-8 mb-4">1. What are cookies?</h2>
          <p>A cookie is a small file which asks permission to be placed on your computer's hard drive. Once you agree, the file is added and the cookie helps analyse web traffic or lets you know when you visit a particular site.</p>
          
          <h2 class="text-2xl font-bold mt-8 mb-4">2. How we use cookies</h2>
          <p>We use traffic log cookies to identify which pages are being used. This helps us analyse data about web page traffic and improve our website in order to tailor it to customer needs.</p>

          <h2 class="text-2xl font-bold mt-8 mb-4">3. Managing cookies</h2>
          <p>You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. You can also manage your preferences via the cookie banner on our site.</p>
        `
      };
    case 'complaints':
      return {
        title: "Complaints Procedure",
        content: `
          <h2 class="text-2xl font-bold mt-8 mb-4">1. Our Approach</h2>
          <p>Divine Children Home Ltd welcomes feedback, including complaints, as a vital tool for improving our services. We treat all complaints seriously, respectfully, and confidentially.</p>
          
          <h2 class="text-2xl font-bold mt-8 mb-4">2. Stage 1: Informal Resolution</h2>
          <p>Many issues can be resolved quickly through open communication. In the first instance, please raise your concern directly with the Registered Home Manager or via our contact form.</p>

          <h2 class="text-2xl font-bold mt-8 mb-4">3. Stage 2: Formal Complaint</h2>
          <p>If the issue is not resolved, or is of a serious nature, it should be submitted in writing to our Head Office. An Investigating Officer will be appointed, and you will receive an acknowledgement within 3 working days.</p>

          <h2 class="text-2xl font-bold mt-8 mb-4">4. For Children and Young People</h2>
          <p>Children in our care have access to an independent advocate and child-friendly complaints procedures. Every child is given information on how to complain when they arrive.</p>

          <h2 class="text-2xl font-bold mt-8 mb-4">5. Escalation to Ofsted</h2>
          <p>If you remain dissatisfied with our internal response, complaints can be escalated to Ofsted. Contact details for Ofsted are provided in our full Complaints Policy.</p>
        `
      };
    default:
      return { title: "Legal", content: "" };
  }
};

export default function Legal({ type }: { type: 'privacy' | 'terms' | 'cookies' | 'complaints' }) {
  const content = getLegalContent(type);
  const meta = pageMeta[type] ?? pageMeta.privacy;

  usePageMeta(meta.title, meta.description);

  return (
    <div className="flex flex-col">
      <PageHeader 
        title={content.title}
        breadcrumbs={[{ label: content.title }]}
      />
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <div 
          className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-accent"
          dangerouslySetInnerHTML={{ __html: content.content }} 
        />
      </div>
    </div>
  );
}