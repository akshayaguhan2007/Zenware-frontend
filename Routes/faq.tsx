import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — FASHION" }] }),
  component: FAQPage,
});

const faqs = [
  { no: "01", q: "How do I place an order?", a: "Browse our catalogue, pick your size and quantity, drop it in your bag, and head to checkout. Fill in your details — done. We'll take it from there." },
  { no: "02", q: "What payment methods do you accept?", a: "We run on Cash on Delivery (COD) for now. Pay when your piece arrives at your door — no card stress, no upfront commitment." },
  { no: "03", q: "How long does delivery take?", a: "Standard delivery lands in 5–7 business days. Express (2–3 days) is live in select cities. We move as fast as the trend cycle." },
  { no: "04", q: "Can I return or exchange?", a: "14 days from delivery. Unworn, unwashed, tags still on. We make returns as painless as the impulse buy that got you here." },
  { no: "05", q: "How do I track my order?", a: "Sign in, head to My Orders. Every status update lives there — from the moment we pack it to the moment it hits your door." },
  { no: "06", q: "What sizes do you carry?", a: "XS through XL on most pieces. Each product page shows exactly what's available. We're working on expanding — watch this space." },
  { no: "07", q: "Is free shipping a thing?", a: "Orders above Rs. 2,000 ship free. Below that, it's a flat Rs. 199. One more reason to fill the bag." },
  { no: "08", q: "How do I reach you?", a: "support@fashion.com or slide into our DMs @fashionstore. We're real humans — you'll hear back within 24 hours." },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="bg-cream min-h-screen">

      {/* BIG HEADER */}
      <section className="px-6 lg:px-16 pt-20 pb-0 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display text-xs tracking-[0.4em] text-wine mb-4"
          >
            — YOU ASKED
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-display text-[clamp(4rem,14vw,12rem)] text-wine-dark leading-[0.85]"
          >
            WE<br />
            <span className="text-outline">ANS<br />WER.</span>
          </motion.h1>
        </div>
      </section>

      {/* FAQ LIST */}
      <section className="px-6 lg:px-16 py-20">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-[1fr_1.2fr] gap-16 items-start">

          {/* sticky label */}
          <div className="hidden lg:block sticky top-28">
            <p className="text-display text-xs tracking-[0.3em] text-wine-dark/40 mb-8">QUESTIONS</p>
            <div className="space-y-1">
              {faqs.map((f, i) => (
                <button
                  key={i}
                  onClick={() => setOpen(i)}
                  className={`block w-full text-left px-4 py-3 text-display text-sm tracking-wider transition-all ${
                    open === i
                      ? "bg-wine-dark text-cream"
                      : "text-wine-dark/40 hover:text-wine-dark"
                  }`}
                >
                  {f.no} — {f.q}
                </button>
              ))}
            </div>
          </div>

          {/* accordion answers */}
          <div className="divide-y divide-wine-dark/10">
            {faqs.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-start justify-between gap-6 py-7 text-left group"
                >
                  <div className="flex items-start gap-5">
                    <span className="text-display text-xs text-wine mt-1 shrink-0">{f.no}</span>
                    <span className={`text-display text-xl md:text-2xl transition-colors ${open === i ? "text-wine-dark" : "text-wine-dark/60 group-hover:text-wine-dark"}`}>
                      {f.q}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: open === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-display text-2xl text-wine-dark/40 shrink-0 mt-0.5"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 pl-10 text-wine-dark/70 text-lg leading-relaxed max-w-xl">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM STRIP */}
      <section className="bg-wine-dark text-cream px-6 lg:px-16 py-16">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-display text-3xl md:text-4xl">Still lost?</p>
          <a
            href="mailto:support@fashion.com"
            className="inline-block border border-cream/30 px-8 py-4 text-display text-sm tracking-widest hover:bg-cream hover:text-wine-dark transition-colors"
          >
            EMAIL US →
          </a>
        </div>
      </section>

      <style>{`.text-outline { -webkit-text-stroke: 2px #561C24; color: transparent; }`}</style>
    </div>
  );
}
