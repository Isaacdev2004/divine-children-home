import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  adminApi,
  clearStoredSession,
  getStoredSession,
  setStoredSession,
  type AdminProfile,
} from "../lib/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  profile: AdminProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    const session = getStoredSession();
    if (!session) {
      setProfile(null);
      return;
    }

    try {
      const { profile: p } = await adminApi.get<{ profile: AdminProfile }>("/auth/me");
      setProfile(p);
    } catch {
      clearStoredSession();
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    refreshProfile().finally(() => setIsLoading(false));
  }, [refreshProfile]);

  const signIn = useCallback(async (email: string, password: string, remember = true) => {
    const data = await adminApi.post<{
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
      profile: AdminProfile;
    }>("/auth/login", { email, password }, false);

    setStoredSession(
      {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: data.expiresAt,
      },
      remember,
    );
    setProfile(data.profile);
  }, []);

  const signOut = useCallback(async () => {
    clearStoredSession();
    setProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    await adminApi.post("/auth/forgot-password", { email }, false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(profile),
      profile,
      isLoading,
      signIn,
      signOut,
      resetPassword,
      refreshProfile,
    }),
    [profile, isLoading, signIn, signOut, resetPassword, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
