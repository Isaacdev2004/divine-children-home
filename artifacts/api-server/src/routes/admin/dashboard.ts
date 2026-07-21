import { Router, type IRouter } from "express";
import { getDashboardStats, getChartData } from "@workspace/supabase";
import { asyncHandler } from "../../lib/async-handler";
import { requirePermission } from "../../middleware/require-permission";

const router: IRouter = Router();

router.get(
  "/",
  requirePermission("dashboard.view"),
  asyncHandler(async (_req, res) => {
    const [stats, charts] = await Promise.all([getDashboardStats(), getChartData()]);
    res.json({ ...stats, charts });
  }),
);

export default router;
