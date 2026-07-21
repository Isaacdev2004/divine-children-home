import type { Request } from "express";
import { writeAuditLog } from "@workspace/supabase";

export async function audit(
  req: Request,
  action: string,
  entityType: string,
  entityId?: string,
  details?: Record<string, unknown>,
): Promise<void> {
  await writeAuditLog({
    userId: req.admin?.id,
    userEmail: req.admin?.email,
    action,
    entityType,
    entityId,
    details,
    ipAddress: req.ip,
  });
}
