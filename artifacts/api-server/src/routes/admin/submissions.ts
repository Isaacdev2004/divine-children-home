import { Router, type IRouter } from "express";
import {
  adminListContacts,
  adminUpdateContact,
  adminDeleteRow,
  adminListReferrals,
  adminUpdateReferral,
  adminListReferralComments,
  adminAddReferralComment,
  adminListApplications,
  adminUpdateApplication,
  adminListSubscribers,
  adminDeleteSubscriber,
  getSignedUrl,
} from "@workspace/supabase";
import { asyncHandler } from "../../lib/async-handler";
import { ApiError } from "../../lib/api-error";
import { audit } from "../../lib/audit";
import { requirePermission } from "../../middleware/require-permission";

const router: IRouter = Router();

router.get(
  "/contacts",
  requirePermission("submissions.read"),
  asyncHandler(async (req, res) => {
    const search = req.query.search as string | undefined;
    res.json(await adminListContacts(search));
  }),
);

router.patch(
  "/contacts/:id",
  requirePermission("submissions.write"),
  asyncHandler(async (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    if (Number.isNaN(id)) throw new ApiError(400, "Invalid id");
    const updated = await adminUpdateContact(id, req.body);
    await audit(req, "update", "contact_submissions", String(id));
    res.json(updated);
  }),
);

router.delete(
  "/contacts/:id",
  requirePermission("submissions.write"),
  asyncHandler(async (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    await adminDeleteRow("contact_submissions", id);
    await audit(req, "delete", "contact_submissions", String(id));
    res.status(204).send();
  }),
);

router.get(
  "/referrals",
  requirePermission("submissions.read"),
  asyncHandler(async (req, res) => {
    const status = req.query.status as string | undefined;
    res.json(await adminListReferrals(status));
  }),
);

router.patch(
  "/referrals/:id",
  requirePermission("submissions.write"),
  asyncHandler(async (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const updated = await adminUpdateReferral(id, req.body);
    await audit(req, "update", "referral_submissions", String(id));
    res.json(updated);
  }),
);

router.get(
  "/referrals/:id/comments",
  requirePermission("submissions.read"),
  asyncHandler(async (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    res.json(await adminListReferralComments(id));
  }),
);

router.post(
  "/referrals/:id/comments",
  requirePermission("submissions.write"),
  asyncHandler(async (req, res) => {
    const referralId = parseInt(String(req.params.id), 10);
    const comment = await adminAddReferralComment({
      referralId,
      userId: req.admin!.id,
      userName: req.admin!.fullName,
      comment: req.body.comment,
    });
    res.status(201).json(comment);
  }),
);

router.get(
  "/applications",
  requirePermission("submissions.read"),
  asyncHandler(async (_req, res) => {
    res.json(await adminListApplications());
  }),
);

router.patch(
  "/applications/:id",
  requirePermission("submissions.write"),
  asyncHandler(async (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const updated = await adminUpdateApplication(id, req.body);
    await audit(req, "update", "career_applications", String(id));
    res.json(updated);
  }),
);

router.get(
  "/applications/:id/cv",
  requirePermission("submissions.read"),
  asyncHandler(async (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    const apps = await adminListApplications();
    const app = apps.find((a: { id: number }) => a.id === id);
    if (!app?.cv_url) throw new ApiError(404, "CV not found");
    const url = await getSignedUrl("cvs", app.cv_url.replace(/^.*\/cvs\//, ""));
    res.json({ url });
  }),
);

router.get(
  "/newsletter",
  requirePermission("submissions.read"),
  asyncHandler(async (req, res) => {
    const search = req.query.search as string | undefined;
    res.json(await adminListSubscribers(search));
  }),
);

router.get(
  "/newsletter/export",
  requirePermission("submissions.read"),
  asyncHandler(async (req, res) => {
    const rows = await adminListSubscribers();
    const header = "email,name,subscribed_at\n";
    const csv = rows
      .map(
        (r: { email: string; name: string | null; subscribed_at: string }) =>
          `"${r.email}","${r.name ?? ""}","${r.subscribed_at}"`,
      )
      .join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="newsletter-subscribers.csv"');
    await audit(req, "export", "newsletter_subscribers", undefined, { count: rows.length });
    res.send(header + csv);
  }),
);

router.delete(
  "/newsletter/:id",
  requirePermission("submissions.write"),
  asyncHandler(async (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    await adminDeleteSubscriber(id);
    await audit(req, "delete", "newsletter_subscribers", String(id));
    res.status(204).send();
  }),
);

export default router;
