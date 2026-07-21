import { Router, type IRouter } from "express";
import healthRouter from "./health";
import jobsRouter from "./jobs";
import newsRouter from "./news";
import faqsRouter from "./faqs";
import testimonialsRouter from "./testimonials";
import galleryRouter from "./gallery";
import statsRouter from "./stats";
import formsRouter from "./forms";

const router: IRouter = Router();

router.use(healthRouter);
router.use(jobsRouter);
router.use(newsRouter);
router.use(faqsRouter);
router.use(testimonialsRouter);
router.use(galleryRouter);
router.use(statsRouter);
router.use(formsRouter);

export default router;
