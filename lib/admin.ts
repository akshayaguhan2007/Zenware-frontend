import { useAuth } from "@/lib/auth";

const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? "akshay.guhan27@gmail.com")
  .split(",")
  .map((e: string) => e.trim())
  .filter(Boolean);

export function useIsAdmin() {
  const { user } = useAuth();
  if (!user?.email) return false;
  return ADMIN_EMAILS.includes(user.email);
}
