import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { Mail, Lock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In — Fashion" },
      { name: "description", content: "Sign in to your Fashion account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) return setError(error);
    navigate({ to: "/" });
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] grid lg:grid-cols-2 bg-cream">
      <div className="hidden lg:flex relative bg-wine-dark text-cream items-end p-12 overflow-hidden">
        <motion.div
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-wine-dark via-wine to-wine-dark/70"
        />
        <div className="relative z-10">
          <h2 className="text-display text-5xl leading-tight">
            WELCOME <br /> BACK TO <br />
            <span className="sand-highlight text-wine-dark">FASHION</span>
          </h2>
          <p className="mt-6 text-cream/70 max-w-md">
            Pick up where you left off — your bag, your favourites, your next look.
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center p-8 lg:p-16"
      >
        <form onSubmit={onSubmit} className="w-full max-w-md">
          <h1 className="text-display text-4xl text-wine-dark">SIGN IN</h1>
          <p className="mt-2 text-wine-dark/60">New here? <Link to="/signup" className="underline">Create an account</Link></p>

          <div className="mt-10 space-y-5">
            <Field icon={<Mail size={18} />} type="email" placeholder="Email" value={email} onChange={setEmail} />
            <Field icon={<Lock size={18} />} type="password" placeholder="Password" value={password} onChange={setPassword} />
          </div>

          <Link to="/forgot-password" className="block mt-3 text-sm text-wine-dark/70 hover:text-wine-dark text-right">
            Forgot password?
          </Link>

          {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-wine-dark text-cream py-4 text-display text-sm tracking-wider hover:bg-wine transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            SIGN IN
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export function Field({
  icon, type, placeholder, value, onChange,
}: { icon: React.ReactNode; type: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3 border-b border-wine-dark/30 pb-3 focus-within:border-wine-dark transition-colors">
      <span className="text-wine-dark/60">{icon}</span>
      <input
        required
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-wine-dark placeholder-wine-dark/40"
      />
    </div>
  );
}
