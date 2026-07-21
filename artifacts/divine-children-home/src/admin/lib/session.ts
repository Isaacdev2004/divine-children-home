const SESSION_KEY = "dch-admin-session";

export interface AdminSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

function storage(persistent: boolean): Storage {
  return persistent ? localStorage : sessionStorage;
}

export function getStoredSession(): AdminSession | null {
  const raw =
    localStorage.getItem(SESSION_KEY) ?? sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function setStoredSession(session: AdminSession, remember = true): void {
  clearStoredSession();
  storage(remember).setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
}

export async function getAccessToken(): Promise<string | null> {
  const session = getStoredSession();
  if (!session) return null;

  const expiresMs = session.expiresAt * 1000;
  if (Date.now() < expiresMs - 60_000) {
    return session.accessToken;
  }

  try {
    const response = await fetch("/api/admin/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!response.ok) {
      clearStoredSession();
      return null;
    }

    const data = (await response.json()) as AdminSession & { profile?: unknown };
    const remember = localStorage.getItem(SESSION_KEY) !== null;
    setStoredSession(
      {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      },
      remember,
    );
    return data.accessToken;
  } catch {
    clearStoredSession();
    return null;
  }
}

export function isSessionExpired(session: AdminSession): boolean {
  return Date.now() >= session.expiresAt * 1000;
}
