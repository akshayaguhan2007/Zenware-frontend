import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Field } from "./login";
import { Lock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — Fashion" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    setError(null);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) return setError(error);
    navigate({ to: "/login" });
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] grid place-items-center bg-cream px-6 py-16">
      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-display text-4xl text-wine-dark">SET NEW PASSWORD</h1>
        <p className="mt-2 text-wine-dark/60">Pick something you'll remember.</p>

        <div className="mt-10">
          <Field icon={<Lock size={18} />} type="password" placeholder="New password" value={password} onChange={setPassword} />
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full bg-wine-dark text-cream py-4 text-display text-sm tracking-wider hover:bg-wine transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="animate-spin" size={16} />}
          UPDATE PASSWORD
        </button>
        <Link to="/login" className="mt-4 block text-center text-sm text-wine-dark/70">Back to sign in</Link>
      </motion.form>
    </div>
  );
}
