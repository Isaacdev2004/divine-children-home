import { Router, type IRouter } from "express";
import {
  createReferenceNumber,
  insertCareerApplication,
  insertContactSubmission,
  insertNewsletterSubscriber,
  insertReferralSubmission,
} from "@workspace/supabase";
import {
  SubmitContactFormBody,
  SubmitReferralFormBody,
  SubmitCareerApplicationBody,
  SubscribeNewsletterBody,
  SubmitContactFormResponse,
  SubmitReferralFormResponse,
  SubmitCareerApplicationResponse,
  SubscribeNewsletterResponse,
} from "@workspace/api-zod";
import { asyncHandler } from "../lib/async-handler";
import { parseBody } from "../lib/validation";
import { formRateLimit } from "../middleware/rate-limit";

const router: IRouter = Router();

router.use(formRateLimit);

router.post(
  "/forms/contact",
  asyncHandler(async (req, res) => {
    const body = parseBody(SubmitContactFormBody, req.body);
    const referenceNumber = createReferenceNumber("CNT");

    await insertContactSubmission(body, referenceNumber);

    req.log.info({ referenceNumber }, "Contact form submitted");
    res.status(201).json(
      SubmitContactFormResponse.parse({
        success: true,
        message:
          "Thank you for your enquiry. We will be in touch within 24 hours.",
        referenceNumber,
      }),
    );
  }),
);

router.post(
  "/forms/referral",
  asyncHandler(async (req, res) => {
    const body = parseBody(SubmitReferralFormBody, req.body);
    const referenceNumber = createReferenceNumber("REF");

    await insertReferralSubmission(body, referenceNumber);

    req.log.info({ referenceNumber }, "Referral form submitted");
    res.status(201).json(
      SubmitReferralFormResponse.parse({
        success: true,
        message:
          "Your referral has been received. Our placement team will contact you within 2 hours for urgent placements.",
        referenceNumber,
      }),
    );
  }),
);

router.post(
  "/forms/career",
  asyncHandler(async (req, res) => {
    const body = parseBody(SubmitCareerApplicationBody, req.body);
    const referenceNumber = createReferenceNumber("APP");

    await insertCareerApplication(body, referenceNumber);

    req.log.info({ referenceNumber }, "Career application submitted");
    res.status(201).json(
      SubmitCareerApplicationResponse.parse({
        success: true,
        message:
          "Your application has been received. We aim to respond within 5 working days.",
        referenceNumber,
      }),
    );
  }),
);

router.post(
  "/forms/newsletter",
  asyncHandler(async (req, res) => {
    const body = parseBody(SubscribeNewsletterBody, req.body);
    const result = await insertNewsletterSubscriber(body.email, body.name);

    if (result.duplicate) {
      req.log.info({ email: body.email }, "Newsletter subscription duplicate");
    }

    res.status(201).json(
      SubscribeNewsletterResponse.parse({
        success: true,
        message: "You have been subscribed to our newsletter.",
        referenceNumber: null,
      }),
    );
  }),
);

export default router;
