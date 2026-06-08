import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, setToken, clearToken } from "./api";

export type User = {
  id: string;
  email: string;
  name: string;
  role?: string;
  created_at: string;
};

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
};

const Ctx = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("zenwear_token");
    if (!token) { setLoading(false); return; }
    api.get<User>("/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user: u } = await api.post<{ token: string; user: User }>("/auth/signin", { email, password });
      setToken(token);
      setUser(u);
      return { error: null };
    } catch (e: any) {
      return { error: e.message };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { token, user: u } = await api.post<{ token: string; user: User }>("/auth/signup", { email, password, name });
      setToken(token);
      setUser(u);
      return { error: null };
    } catch (e: any) {
      return { error: e.message };
    }
  };

  const signOut = async () => {
    clearToken();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      await api.post("/auth/reset-password", { email });
      return { error: null };
    } catch (e: any) {
      return { error: e.message };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      await api.post("/auth/update-password", { password });
      return { error: null };
    } catch (e: any) {
      return { error: e.message };
    }
  };

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, updatePassword }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
