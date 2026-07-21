export class ApiError extends Error {
  readonly name = "ApiError";

  constructor(
    readonly statusCode: number,
    message: string,
    readonly details?: unknown,
    readonly code?: string,
  ) {
    super(message);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
