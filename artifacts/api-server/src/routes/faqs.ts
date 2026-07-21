import { Router, type IRouter } from "express";
import { listFaqs } from "@workspace/supabase";
import { ListFaqsResponse } from "@workspace/api-zod";
import { asyncHandler } from "../lib/async-handler";

const router: IRouter = Router();

router.get(
  "/faqs",
  asyncHandler(async (_req, res) => {
    const faqs = await listFaqs();
    res.json(ListFaqsResponse.parse(faqs));
  }),
);

export default router;
