import { Router, type IRouter } from "express";
import { getSiteStats } from "@workspace/supabase";
import { GetStatsResponse } from "@workspace/api-zod";
import { asyncHandler } from "../lib/async-handler";

const router: IRouter = Router();

router.get(
  "/stats",
  asyncHandler(async (_req, res) => {
    const stats = await getSiteStats();
    res.json(GetStatsResponse.parse(stats));
  }),
);

export default router;
