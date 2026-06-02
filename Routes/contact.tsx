import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";
import { Mail, Phone, MapPin, Instagram, Send, Check, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Reach Out — FASHION" }] }),
  component: ContactPage,
});

const channels = [
  { icon: Mail, label: "Email", value: "support@fashion.com", sub: "We reply within 24 hours" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210", sub: "Mon – Sat, 10am – 7pm IST" },
  { icon: MapPin, label: "Studio", value: "Bengaluru, Karnataka", sub: "India — 560001" },
  { icon: Instagram, label: "Instagram", value: "@fashionstore", sub: "DM us anytime" },
];

const reasons = ["Order issue", "Return / Exchange", "Product question", "Wholesale", "Press & Media", "Just saying hi"];

type FormFields = { name: string; email: string; reason: string; message: string };
type FormErrors = Partial<Record<keyof FormFields, string>>;

function validate(form: FormFields): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = "We'd love to know who you are.";
  else if (form.name.trim().length < 2) errors.name = "At least 2 characters, please.";
  if (!form.email.trim()) errors.email = "Drop your email so we can reply.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "That doesn't look like a valid email.";
  if (!form.reason) errors.reason = "Pick what this is about.";
  if (!form.message.trim()) errors.message = "Don't be shy — tell us something.";
  else if (form.message.trim().length < 10) errors.message = "A little more detail would help.";
  return errors;
}

export default function ContactPage() {
  const [form, setForm] = useState<FormFields>({ name: "", email: "", reason: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const touch = (field: keyof FormFields) => {
    setTouched((p) => ({ ...p, [field]: true }));
    const e = validate({ ...form });
    setErrors((prev) => ({ ...prev, [field]: e[field] }));
  };

  const change = (field: keyof FormFields, value: string) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (touched[field]) {
      const e = validate(updated);
      setErrors((prev) => ({ ...prev, [field]: e[field] }));
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, reason: true, message: true };
    setTouched(allTouched);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSent(true); }, 1200);
  };

  const reset = () => {
    setSent(false);
    setForm({ name: "", email: "", reason: "", message: "" });
    setErrors({});
    setTouched({});
  };

  const isValid = (f: keyof FormFields) => touched[f] && !errors[f] && form[f];
  const hasError = (f: keyof FormFields) => touched[f] && !!errors[f];

  return (
    <div className="bg-cream min-h-screen">

      {/* HERO */}
      <section className="relative overflow-hidden bg-wine-dark text-cream px-6 lg:px-16 pt-20 pb-32">
        {[400, 600, 800].map((s, i) => (
          <motion.div
            key={s}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 30 + i * 15, repeat: Infinity, ease: "linear" }}
            className="absolute rounded-full border border-cream/5 pointer-events-none"
            style={{ width: s, height: s, top: "50%", right: -s / 2.5, transform: "translateY(-50%)" }}
          />
        ))}
        <div className="relative mx-auto max-w-7xl">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-display text-xs tracking-[0.4em] text-sand mb-6">
            — DON'T BE A STRANGER
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-display text-[clamp(4rem,13vw,11rem)] leading-[0.85]"
          >
            REACH<br />
            <span style={{ WebkitTextStroke: "2px rgba(232,216,196,0.5)", color: "transparent" }}>OUT.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 text-cream/60 text-lg max-w-md leading-relaxed">
            Whether it's an order, a question, or you just want to talk fashion — we're here. Real humans, real replies.
          </motion.p>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="px-6 lg:px-16 -mt-12 relative z-10">
        <div className="mx-auto max-w-7xl grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {channels.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-wine-dark/10 p-6 hover:border-wine-dark transition-colors group"
            >
              <c.icon size={22} className="text-wine mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-display text-xs tracking-widest text-wine-dark/50 mb-1">{c.label.toUpperCase()}</p>
              <p className="text-wine-dark font-medium">{c.value}</p>
              <p className="text-wine-dark/50 text-xs mt-1">{c.sub}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FORM + ASIDE */}
      <section className="px-6 lg:px-16 py-24">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1.4fr_1fr] gap-16 items-start">

          <div>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-display text-xs tracking-[0.3em] text-wine mb-3">
              — SEND A MESSAGE
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-display text-4xl md:text-5xl text-wine-dark mb-10">
              LET'S TALK.
            </motion.h2>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-wine-dark text-cream p-10 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
                    className="w-16 h-16 bg-cream/10 rounded-full grid place-items-center mx-auto mb-6"
                  >
                    <Check size={28} className="text-sand" />
                  </motion.div>
                  <h3 className="text-display text-3xl mb-3">Message sent.</h3>
                  <p className="text-cream/70">We'll get back to you within 24 hours. Check your inbox.</p>
                  <button onClick={reset} className="mt-8 border border-cream/30 px-6 py-3 text-display text-xs tracking-widest hover:bg-cream hover:text-wine-dark transition-colors">
                    SEND ANOTHER
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" ref={formRef} onSubmit={submit} noValidate className="space-y-8">

                  {/* NAME + EMAIL */}
                  <div className="grid sm:grid-cols-2 gap-8">
                    <InputField
                      label="Your name"
                      required
                      value={form.name}
                      error={errors.name}
                      isValid={!!isValid("name")}
                      hasError={!!hasError("name")}
                      onChange={(v) => change("name", v)}
                      onBlur={() => touch("name")}
                      placeholder="Akshay"
                    />
                    <InputField
                      label="Email address"
                      required
                      type="email"
                      value={form.email}
                      error={errors.email}
                      isValid={!!isValid("email")}
                      hasError={!!hasError("email")}
                      onChange={(v) => change("email", v)}
                      onBlur={() => touch("email")}
                      placeholder="you@example.com"
                    />
                  </div>

                  {/* REASON PILLS */}
                  <div>
                    <label className="block text-display text-xs tracking-[0.25em] text-wine-dark/50 mb-3">
                      WHAT'S THIS ABOUT? <span className="text-wine">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {reasons.map((r) => {
                        const selected = form.reason === r;
                        return (
                          <motion.button
                            type="button"
                            key={r}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => change("reason", r)}
                            className={`px-4 py-2 text-display text-xs tracking-wider transition-all ${
                              selected
                                ? "bg-wine-dark text-cream shadow-lg scale-105"
                                : "bg-white border border-wine-dark/20 text-wine-dark/70 hover:border-wine-dark hover:text-wine-dark"
                            }`}
                          >
                            {selected && <span className="mr-1.5">✓</span>}{r}
                          </motion.button>
                        );
                      })}
                    </div>
                    <AnimatePresence>
                      {hasError("reason") && (
                        <ErrorMsg message={errors.reason!} />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <label className="block text-display text-xs tracking-[0.25em] text-wine-dark/50 mb-3">
                      YOUR MESSAGE <span className="text-wine">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={(e) => change("message", e.target.value)}
                        onBlur={() => touch("message")}
                        placeholder="Tell us what's on your mind..."
                        className={`w-full bg-white border-b-2 px-0 py-3 focus:outline-none text-wine-dark placeholder-wine-dark/25 transition-colors resize-none ${
                          hasError("message")
                            ? "border-red-400"
                            : isValid("message")
                            ? "border-green-500"
                            : "border-wine-dark/20 focus:border-wine-dark"
                        }`}
                      />
                      {/* character count */}
                      <span className={`absolute bottom-4 right-0 text-xs ${form.message.length > 0 ? "text-wine-dark/40" : "text-transparent"}`}>
                        {form.message.length} chars
                      </span>
                    </div>
                    <AnimatePresence>
                      {hasError("message") && <ErrorMsg message={errors.message!} />}
                    </AnimatePresence>
                  </div>

                  {/* SUBMIT */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.97 }}
                      disabled={submitting}
                      className="group relative flex items-center gap-3 bg-wine-dark text-cream px-8 py-4 text-display tracking-widest hover:bg-wine transition-colors disabled:opacity-70 overflow-hidden"
                    >
                      {submitting ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full"
                          />
                          SENDING…
                        </>
                      ) : (
                        <>
                          SEND MESSAGE
                          <Send size={15} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </motion.button>

                    {/* inline form error count */}
                    <AnimatePresence>
                      {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-xs text-red-400 flex items-center gap-1.5"
                        >
                          <AlertCircle size={13} />
                          {Object.keys(errors).length} field{Object.keys(errors).length > 1 ? "s" : ""} need attention
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* ASIDE */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:sticky lg:top-28 space-y-6"
          >
            <div className="bg-sand/50 p-8">
              <p className="text-display text-xs tracking-[0.3em] text-wine mb-4">RESPONSE TIME</p>
              <p className="text-display text-4xl text-wine-dark leading-tight">Under<br />24 hours.</p>
              <p className="mt-4 text-wine-dark/60 text-sm leading-relaxed">Every message is read by a real person. No bots, no templated replies.</p>
            </div>
            <div className="bg-wine-dark text-cream p-8">
              <p className="text-display text-xs tracking-[0.3em] text-sand mb-4">WORKING HOURS</p>
              <div className="space-y-2 text-sm text-cream/70">
                <div className="flex justify-between"><span>Monday – Friday</span><span className="text-cream">10am – 7pm</span></div>
                <div className="flex justify-between"><span>Saturday</span><span className="text-cream">11am – 5pm</span></div>
                <div className="flex justify-between"><span>Sunday</span><span className="text-cream/40">Closed</span></div>
              </div>
              <p className="mt-6 text-xs text-cream/40">All times in IST</p>
            </div>
            <div className="border border-wine-dark/15 p-8">
              <p className="text-display text-xs tracking-[0.3em] text-wine mb-4">PRESS & WHOLESALE</p>
              <p className="text-wine-dark/70 text-sm leading-relaxed">Partnership enquiries and bulk orders get a dedicated team.</p>
              <a href="mailto:press@fashion.com" className="block mt-3 text-display text-wine-dark hover:text-wine transition-colors">press@fashion.com</a>
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

/* ── reusable input field with validation states ── */
function InputField({
  label, required, type = "text", value, error, isValid, hasError, onChange, onBlur, placeholder,
}: {
  label: string; required?: boolean; type?: string;
  value: string; error?: string; isValid: boolean; hasError: boolean;
  onChange: (v: string) => void; onBlur: () => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-display text-xs tracking-[0.25em] text-wine-dark/50 mb-3">
        {label.toUpperCase()}{required && <span className="text-wine ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full bg-transparent border-b-2 px-0 py-3 pr-8 focus:outline-none text-wine-dark placeholder-wine-dark/25 transition-all duration-200 ${
            hasError
              ? "border-red-400 text-red-600"
              : isValid
              ? "border-green-500"
              : "border-wine-dark/20 focus:border-wine-dark"
          }`}
        />
        {/* status icon */}
        <AnimatePresence>
          {isValid && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-0 top-3.5 text-green-500"
            >
              <Check size={15} />
            </motion.span>
          )}
          {hasError && (
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute right-0 top-3.5 text-red-400"
            >
              <AlertCircle size={15} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {hasError && error && <ErrorMsg message={error} />}
      </AnimatePresence>
    </div>
  );
}

function ErrorMsg({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="mt-2 text-xs text-red-400 flex items-center gap-1.5"
    >
      <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
      {message}
    </motion.p>
  );
}
