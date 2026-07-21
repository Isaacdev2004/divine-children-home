import { Router, type IRouter, type RequestHandler } from "express";
import { asyncHandler } from "../../lib/async-handler";
import { ApiError } from "../../lib/api-error";
import { audit } from "../../lib/audit";
import { requirePermission } from "../../middleware/require-permission";
import type { Permission } from "@workspace/supabase";
import {
  adminListNews,
  adminCreateNews,
  adminUpdateNews,
  adminDeleteRow,
  adminListJobs,
  adminCreateJob,
  adminUpdateJob,
  adminListFaqs,
  adminCreateFaq,
  adminUpdateFaq,
  adminListGallery,
  adminCreateGalleryItem,
  adminUpdateGalleryItem,
  adminListTestimonials,
  adminCreateTestimonial,
  adminUpdateTestimonial,
  adminUpdateSiteStats,
  adminListHomes,
  adminCreateHome,
  adminUpdateHome,
  adminListServices,
  adminCreateService,
  adminUpdateService,
  adminListResources,
  adminCreateResource,
  adminUpdateResource,
  adminListPageSections,
  adminUpsertPageSection,
  adminGetSiteSettings,
  adminUpdateSiteSetting,
  adminListSeo,
  adminUpsertSeo,
  adminListRedirects,
  adminCreateRedirect,
  adminUpdateRedirect,
  adminListMedia,
  adminCreateMediaRecord,
  adminDeleteMedia,
} from "@workspace/supabase";

function crudRoutes(config: {
  permission: Permission;
  entity: string;
  list: () => Promise<unknown>;
  create: (body: Record<string, unknown>) => Promise<unknown>;
  update: (id: number, body: Record<string, unknown>) => Promise<unknown>;
  remove?: (id: number) => Promise<void>;
}): IRouter {
  const router = Router();
  const read = requirePermission(config.permission === "content.write" ? "content.read" : config.permission);
  const write = requirePermission(config.permission);

  router.get("/", read, asyncHandler(async (_req, res) => {
    res.json(await config.list());
  }));

  router.post("/", write, asyncHandler(async (req, res) => {
    const created = await config.create(req.body);
    await audit(req, "create", config.entity, String((created as { id?: number }).id ?? ""));
    res.status(201).json(created);
  }));

  router.patch("/:id", write, asyncHandler(async (req, res) => {
    const id = parseInt(String(req.params.id), 10);
    if (Number.isNaN(id)) throw new ApiError(400, "Invalid id");
    const updated = await config.update(id, req.body);
    await audit(req, "update", config.entity, String(id));
    res.json(updated);
  }));

  if (config.remove) {
    router.delete("/:id", write, asyncHandler(async (req, res) => {
      const id = parseInt(String(req.params.id), 10);
      if (Number.isNaN(id)) throw new ApiError(400, "Invalid id");
      await config.remove!(id);
      await audit(req, "delete", config.entity, String(id));
      res.status(204).send();
    }));
  }

  return router;
}

const router: IRouter = Router();

router.use("/news", crudRoutes({
  permission: "content.write",
  entity: "news",
  list: adminListNews,
  create: adminCreateNews,
  update: adminUpdateNews,
  remove: (id) => adminDeleteRow("news", id),
}));

router.use("/jobs", crudRoutes({
  permission: "content.write",
  entity: "jobs",
  list: adminListJobs,
  create: adminCreateJob,
  update: adminUpdateJob,
  remove: (id) => adminDeleteRow("jobs", id),
}));

router.use("/faqs", crudRoutes({
  permission: "content.write",
  entity: "faqs",
  list: adminListFaqs,
  create: adminCreateFaq,
  update: adminUpdateFaq,
  remove: (id) => adminDeleteRow("faqs", id),
}));

router.use("/gallery", crudRoutes({
  permission: "content.write",
  entity: "gallery",
  list: adminListGallery,
  create: adminCreateGalleryItem,
  update: adminUpdateGalleryItem,
  remove: (id) => adminDeleteRow("gallery", id),
}));

router.use("/testimonials", crudRoutes({
  permission: "content.write",
  entity: "testimonials",
  list: adminListTestimonials,
  create: adminCreateTestimonial,
  update: adminUpdateTestimonial,
  remove: (id) => adminDeleteRow("testimonials", id),
}));

router.use("/homes", crudRoutes({
  permission: "content.write",
  entity: "homes",
  list: adminListHomes,
  create: adminCreateHome,
  update: adminUpdateHome,
  remove: (id) => adminDeleteRow("homes", id),
}));

router.use("/services", crudRoutes({
  permission: "content.write",
  entity: "services",
  list: adminListServices,
  create: adminCreateService,
  update: adminUpdateService,
  remove: (id) => adminDeleteRow("services", id),
}));

router.use("/resources", crudRoutes({
  permission: "content.write",
  entity: "resources",
  list: adminListResources,
  create: adminCreateResource,
  update: adminUpdateResource,
  remove: (id) => adminDeleteRow("resources", id),
}));

router.get(
  "/stats",
  requirePermission("content.read"),
  asyncHandler(async (_req, res) => {
    const { getSiteStats } = await import("@workspace/supabase");
    res.json(await getSiteStats());
  }),
);

router.put(
  "/stats",
  requirePermission("content.write"),
  asyncHandler(async (req, res) => {
    const updated = await adminUpdateSiteStats(req.body);
    await audit(req, "update", "site_stats", "1");
    res.json(updated);
  }),
);

router.get(
  "/page-sections",
  requirePermission("content.read"),
  asyncHandler(async (req, res) => {
    const pageKey = req.query.pageKey as string | undefined;
    res.json(await adminListPageSections(pageKey));
  }),
);

router.put(
  "/page-sections",
  requirePermission("content.write"),
  asyncHandler(async (req, res) => {
    const updated = await adminUpsertPageSection({
      ...req.body,
      updatedBy: req.admin?.id,
    });
    await audit(req, "upsert", "page_sections", `${req.body.pageKey}/${req.body.sectionKey}`);
    res.json(updated);
  }),
);

router.get(
  "/settings",
  requirePermission("settings.read"),
  asyncHandler(async (_req, res) => {
    res.json(await adminGetSiteSettings());
  }),
);

router.put(
  "/settings/:key",
  requirePermission("settings.write"),
  asyncHandler(async (req, res) => {
    const key = String(req.params.key);
    const updated = await adminUpdateSiteSetting(key, req.body.value, req.admin?.id);
    await audit(req, "update", "site_settings", key);
    res.json(updated);
  }),
);

router.get(
  "/seo",
  requirePermission("settings.read"),
  asyncHandler(async (_req, res) => {
    res.json(await adminListSeo());
  }),
);

router.put(
  "/seo",
  requirePermission("settings.write"),
  asyncHandler(async (req, res) => {
    const { path, ...rest } = req.body;
    const updated = await adminUpsertSeo(path, { ...rest, updatedBy: req.admin?.id });
    await audit(req, "upsert", "seo_metadata", path);
    res.json(updated);
  }),
);

router.use("/redirects", crudRoutes({
  permission: "settings.write",
  entity: "url_redirects",
  list: adminListRedirects,
  create: adminCreateRedirect,
  update: adminUpdateRedirect,
  remove: (id) => adminDeleteRow("url_redirects", id),
}));

router.get(
  "/media",
  requirePermission("content.read"),
  asyncHandler(async (req, res) => {
    const folder = req.query.folder as string | undefined;
    res.json(await adminListMedia(folder));
  }),
);

router.delete(
  "/media/:id",
  requirePermission("media.write"),
  asyncHandler(async (req, res) => {
    const id = String(req.params.id);
    await adminDeleteMedia(id);
    await audit(req, "delete", "media_files", id);
    res.status(204).send();
  }),
);

export default router;
