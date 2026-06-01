import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Field } from "./login";
import { Mail, Lock, User, Loader2 } from "lucide-react";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account — Fashion" },
      { name: "description", content: "Join the Fashion community." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    setError(null);
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) return setError(error);
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] grid lg:grid-cols-2 bg-cream">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-8 lg:p-16 order-2 lg:order-1"
      >
        <form onSubmit={onSubmit} className="w-full max-w-md">
          <h1 className="text-display text-4xl text-wine-dark">CREATE ACCOUNT</h1>
          <p className="mt-2 text-wine-dark/60">Have one? <Link to="/login" className="underline">Sign in</Link></p>

          <div className="mt-10 space-y-5">
            <Field icon={<User size={18} />} type="text" placeholder="Full name" value={name} onChange={setName} />
            <Field icon={<Mail size={18} />} type="email" placeholder="Email" value={email} onChange={setEmail} />
            <Field icon={<Lock size={18} />} type="password" placeholder="Password (min 6)" value={password} onChange={setPassword} />
          </div>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-wine-dark text-cream py-4 text-display text-sm tracking-wider hover:bg-wine transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            JOIN FASHION
          </button>

          <p className="mt-6 text-xs text-wine-dark/50">
            By signing up you agree to our Terms & Privacy Policy.
          </p>
        </form>
      </motion.div>

      <div className="hidden lg:flex relative bg-wine text-cream items-end p-12 overflow-hidden order-1 lg:order-2">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-tl from-wine-dark via-wine to-sand/40"
        />
        <div className="relative z-10">
          <h2 className="text-display text-5xl leading-tight">
            BECOME PART <br /> OF THE <br />
            <span className="block-highlight text-wine-dark">MOVEMENT.</span>
          </h2>
          <p className="mt-6 text-cream/70 max-w-md">
            Early drops, members-only edits, and styling tips straight to your inbox.
          </p>
        </div>
      </div>
    </div>
  );
}
