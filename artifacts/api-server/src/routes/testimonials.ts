import { Router, type IRouter } from "express";
import { listTestimonials } from "@workspace/supabase";
import { ListTestimonialsResponse } from "@workspace/api-zod";
import { asyncHandler } from "../lib/async-handler";

const router: IRouter = Router();

router.get(
  "/testimonials",
  asyncHandler(async (_req, res) => {
    const testimonials = await listTestimonials();
    res.json(ListTestimonialsResponse.parse(testimonials));
  }),
);

export default router;
