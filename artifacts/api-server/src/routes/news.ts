import { Router, type IRouter } from "express";
import { listNewsArticles, getNewsBySlug } from "@workspace/supabase";
import {
  GetNewsArticleParams,
  ListNewsResponse,
  GetNewsArticleResponse,
} from "@workspace/api-zod";
import { asyncHandler } from "../lib/async-handler";
import { ApiError } from "../lib/api-error";
import { parseParams } from "../lib/validation";

const router: IRouter = Router();

router.get(
  "/news",
  asyncHandler(async (_req, res) => {
    const articles = await listNewsArticles();
    res.json(ListNewsResponse.parse(articles));
  }),
);

router.get(
  "/news/:slug",
  asyncHandler(async (req, res) => {
    const raw = Array.isArray(req.params.slug)
      ? req.params.slug[0]
      : req.params.slug;
    const { slug } = parseParams(GetNewsArticleParams, { slug: raw });
    const article = await getNewsBySlug(slug);

    if (!article) {
      throw new ApiError(404, "Article not found");
    }

    res.json(GetNewsArticleResponse.parse(article));
  }),
);

export default router;
