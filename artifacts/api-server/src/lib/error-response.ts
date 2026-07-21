export interface ErrorResponseBody {
  error: string;
  code?: string;
  requestId?: string;
  details?: unknown;
}

function getRequestId(req: { id?: unknown }): string | undefined {
  if (req.id == null) return undefined;
  return String(req.id);
}

export function sendError(
  req: { id?: unknown },
  res: { status: (code: number) => { json: (body: ErrorResponseBody) => void } },
  status: number,
  message: string,
  options?: { code?: string; details?: unknown },
): void {
  const body: ErrorResponseBody = {
    error: message,
    requestId: getRequestId(req),
  };

  if (options?.code) body.code = options.code;
  if (options?.details && process.env.NODE_ENV !== "production") {
    body.details = options.details;
  }

  res.status(status).json(body);
}
