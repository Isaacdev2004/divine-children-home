import { Router, type IRouter } from "express";
import { listGalleryImages } from "@workspace/supabase";
import { ListGalleryImagesResponse } from "@workspace/api-zod";
import { asyncHandler } from "../lib/async-handler";

const router: IRouter = Router();

router.get(
  "/gallery",
  asyncHandler(async (_req, res) => {
    const images = await listGalleryImages();
    res.json(ListGalleryImagesResponse.parse(images));
  }),
);

export default router;
