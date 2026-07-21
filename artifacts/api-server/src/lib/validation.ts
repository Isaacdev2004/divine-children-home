import type { ZodTypeAny, infer as ZodInfer } from "zod";
import { ApiError } from "./api-error";

export function parseBody<T extends ZodTypeAny>(
  schema: T,
  body: unknown,
): ZodInfer<T> {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.message, parsed.error.flatten(), "VALIDATION_ERROR");
  }
  return parsed.data;
}

export function parseParams<T extends ZodTypeAny>(
  schema: T,
  params: unknown,
): ZodInfer<T> {
  const parsed = schema.safeParse(params);
  if (!parsed.success) {
    throw new ApiError(400, parsed.error.message, parsed.error.flatten(), "VALIDATION_ERROR");
  }
  return parsed.data;
}
