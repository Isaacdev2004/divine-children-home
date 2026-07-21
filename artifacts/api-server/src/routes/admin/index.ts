import { Router, type IRouter } from "express";
import authRouter from "./auth";
import dashboardRouter from "./dashboard";
import cmsRouter from "./cms";
import submissionsRouter from "./submissions";
import uploadRouter from "./upload";
import usersRouter from "./users";
import { requireAdmin } from "../../middleware/admin-auth";

const router: IRouter = Router();

router.use("/auth", authRouter);

router.use(requireAdmin);
router.use("/dashboard", dashboardRouter);
router.use(cmsRouter);
router.use("/submissions", submissionsRouter);
router.use("/upload", uploadRouter);
router.use(usersRouter);

export default router;
