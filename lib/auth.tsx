import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type User = {
  id: string;
  email: string;
  name: string;
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

const USERS_KEY = "fashion_users";
const SESSION_KEY = "fashion_session";

type StoredUser = { id: string; email: string; name: string; password: string; created_at: string };

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]"); } catch { return []; }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): User | null {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) ?? "null"); } catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { error: "Invalid email or password." };
    const u: User = { id: found.id, email: found.email, name: found.name ?? "", created_at: found.created_at };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
    return { error: null };
  };

  const signUp = async (email: string, password: string, name: string) => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) return { error: "An account with this email already exists." };
    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      email,
      name,
      password,
      created_at: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const u: User = { id: newUser.id, email: newUser.email, name: newUser.name, created_at: newUser.created_at };
    localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const users = getUsers();
    if (!users.find((u) => u.email === email)) return { error: "No account found with this email." };
    return { error: null };
  };

  const updatePassword = async (password: string) => {
    if (!user) return { error: "Not signed in." };
    const users = getUsers();
    const updated = users.map((u) => u.id === user.id ? { ...u, password } : u);
    saveUsers(updated);
    return { error: null };
  };

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, updatePassword }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
