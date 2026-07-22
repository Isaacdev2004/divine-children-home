import { getAccessToken, clearStoredSession, type AdminSession } from "./session";
import { resolveApiUrl } from "@/lib/api-base-url";

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

async function adminFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (auth) {
    const token = await getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(resolveApiUrl(`/api/admin${path}`), {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const data = await response.json();
      if (data.error) message = data.error;
    } catch {
      // ignore
    }
    throw new AdminApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const adminApi = {
  get: <T>(path: string) => adminFetch<T>(path),
  post: <T>(path: string, body: unknown, auth = true) =>
    adminFetch<T>(path, { method: "POST", body: JSON.stringify(body) }, auth),
  put: <T>(path: string, body: unknown) =>
    adminFetch<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    adminFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path: string) => adminFetch<void>(path, { method: "DELETE" }),
  upload: <T>(path: string, formData: FormData) =>
    adminFetch<T>(path, { method: "POST", body: formData }),
};

export type AdminRole = "super_admin" | "administrator" | "content_editor";

export interface AdminProfile {
  id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  avatarUrl: string | null;
  lastLoginAt: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  profile: AdminProfile;
}

export interface DashboardData {
  counts: Record<string, number>;
  siteStats: Record<string, unknown> | null;
  recentReferrals: Record<string, unknown>[];
  recentActivity: Record<string, unknown>[];
  charts: {
    referrals: { date: string; count: number }[];
    applications: { date: string; count: number }[];
    contacts: { date: string; count: number }[];
    subscribers: { date: string; count: number }[];
  };
}

export { clearStoredSession, getStoredSession, setStoredSession, type AdminSession } from "./session";
