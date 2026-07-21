import type { AdminRole } from "../lib/api";

export type Permission =
  | "dashboard.view"
  | "content.read"
  | "content.write"
  | "submissions.read"
  | "submissions.write"
  | "users.read"
  | "users.write"
  | "settings.read"
  | "settings.write"
  | "audit.read"
  | "media.write";

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  super_admin: [
    "dashboard.view", "content.read", "content.write", "submissions.read",
    "submissions.write", "users.read", "users.write", "settings.read",
    "settings.write", "audit.read", "media.write",
  ],
  administrator: [
    "dashboard.view", "content.read", "content.write", "submissions.read",
    "submissions.write", "settings.read", "settings.write", "audit.read", "media.write",
  ],
  content_editor: ["dashboard.view", "content.read", "content.write", "media.write"],
};

export function canAccess(role: AdminRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canAccessAny(role: AdminRole | undefined, permissions: Permission[]): boolean {
  return permissions.some((p) => canAccess(role, p));
}
