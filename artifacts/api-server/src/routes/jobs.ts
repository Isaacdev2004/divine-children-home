import { Router, type IRouter } from "express";
import { listActiveJobs, getJobById } from "@workspace/supabase";
import {
  GetJobParams,
  ListJobsResponse,
  GetJobResponse,
} from "@workspace/api-zod";
import { asyncHandler } from "../lib/async-handler";
import { ApiError } from "../lib/api-error";
import { parseParams } from "../lib/validation";

const router: IRouter = Router();

router.get(
  "/jobs",
  asyncHandler(async (_req, res) => {
    const jobs = await listActiveJobs();
    res.json(ListJobsResponse.parse(jobs));
  }),
);

router.get(
  "/jobs/:id",
  asyncHandler(async (req, res) => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { id } = parseParams(GetJobParams, { id: parseInt(raw, 10) });
    const job = await getJobById(id);

    if (!job) {
      throw new ApiError(404, "Job not found");
    }

    res.json(GetJobResponse.parse(job));
  }),
);

export default router;
