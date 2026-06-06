import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Field } from "./login";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Fashion" },
      { name: "description", content: "Reset your Fashion account password." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) return setError(error);
    setSent(true);
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] grid place-items-center bg-cream px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <h1 className="text-display text-4xl text-wine-dark">FORGOT PASSWORD?</h1>
        <p className="mt-2 text-wine-dark/60">
          Type your email and we'll send a reset link.
        </p>

        {sent ? (
          <div className="mt-10 bg-wine-dark/5 border border-wine-dark/10 p-6 text-center">
            <CheckCircle2 className="mx-auto text-wine-dark" size={32} />
            <p className="mt-3 text-wine-dark">Reset link sent. Check your inbox.</p>
            <Link to="/login" className="mt-6 inline-block underline text-wine-dark">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10">
            <Field icon={<Mail size={18} />} type="email" placeholder="Email" value={email} onChange={setEmail} />
            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full bg-wine-dark text-cream py-4 text-display text-sm tracking-wider hover:bg-wine transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              SEND RESET LINK
            </button>
            <Link to="/login" className="mt-4 block text-center text-sm text-wine-dark/70 hover:text-wine-dark">
              Back to sign in
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
