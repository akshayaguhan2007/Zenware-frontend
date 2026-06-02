import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — FASHION" }] }),
  component: TermsPage,
});

const terms = [
  {
    no: "I",
    title: "You agree to show up.",
    body: "By using this website you accept these terms. If something here doesn't sit right, step away from the site. Simple as that.",
  },
  {
    no: "II",
    title: "Play fair.",
    body: "Use the site for what it's built for — finding and buying things you love. Don't hack it, scrape it, or use it to do anything illegal. We'll notice.",
  },
  {
    no: "III",
    title: "Prices move. Products change.",
    body: "We reserve the right to update prices, retire products, or tweak listings at any time. We try to keep things accurate — but if there's a typo on a price, we're not bound by it.",
  },
  {
    no: "IV",
    title: "Your order is a promise.",
    body: "When you place an order you're confirming your details are correct. We accept COD only. We may cancel orders if something feels off — and we'll always tell you why.",
  },
  {
    no: "V",
    title: "We ship. You wait (a little).",
    body: "Dispatch within 1–2 business days. Delivery in 5–7. Free shipping above Rs. 2,000. Delays happen — couriers are human too. We'll keep you posted.",
  },
  {
    no: "VI",
    title: "Changed your mind?",
    body: "Returns within 14 days. Unworn, unwashed, tags on. Refunds processed in 7–10 days after we receive the item. No drama.",
  },
  {
    no: "VII",
    title: "This is ours.",
    body: "Everything on this site — the words, the images, the brand — belongs to FASHION. Don't reproduce or repurpose any of it without written permission. We've worked hard on it.",
  },
  {
    no: "VIII",
    title: "We're not liable for everything.",
    body: "We can't be held responsible for indirect damages, losses, or consequences beyond our control. Our maximum liability is capped at the value of your specific order.",
  },
  {
    no: "IX",
    title: "These terms can change.",
    body: "We may update these from time to time. If you keep using the site after we post changes, you've accepted them. Worth a re-read every now and then.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-cream min-h-screen">

      {/* HERO — giant stacked type */}
      <section className="px-6 lg:px-16 pt-20 pb-16 border-b-4 border-wine-dark">
        <div className="mx-auto max-w-7xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-display text-xs tracking-[0.4em] text-wine mb-4"
          >
            — READ BEFORE YOU SHOP
          </motion.p>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-display text-[clamp(3.5rem,12vw,10rem)] text-wine-dark leading-[0.85]"
            >
              THE<br />RULES<br /><span className="text-wine">OF THE<br />STORE.</span>
            </motion.h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="lg:max-w-xs pb-4"
            >
              <p className="text-wine-dark/60 text-lg leading-relaxed">
                We keep it plain. No legal maze. Just what you need to know before we do business together.
              </p>
              <p className="mt-4 text-display text-xs tracking-widest text-wine-dark/40">
                EFFECTIVE 1 JANUARY 2026
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TERMS — big numbered list */}
      <section className="px-6 lg:px-16 py-10">
        <div className="mx-auto max-w-7xl">
          {terms.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group grid md:grid-cols-[80px_1fr] gap-6 py-10 border-b border-wine-dark/10 hover:bg-sand/20 transition-colors px-4 -mx-4"
            >
              <div className="flex items-start">
                <span className="text-display text-4xl text-wine-dark/20 group-hover:text-wine transition-colors leading-none">
                  {t.no}
                </span>
              </div>
              <div>
                <h2 className="text-display text-2xl md:text-3xl text-wine-dark mb-3">{t.title}</h2>
                <p className="text-wine-dark/65 text-lg leading-relaxed max-w-2xl">{t.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CLOSING STATEMENT */}
      <section className="bg-wine-dark text-cream px-6 lg:px-16 py-24">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 items-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display text-4xl md:text-6xl leading-tight"
          >
            SHOP WITH<br />
            <span className="text-sand">CONFIDENCE.</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-cream/70 text-lg leading-relaxed">
              These terms exist to protect both of us. We want every transaction to feel safe, fair, and worth your time. Questions? We're a message away.
            </p>
            <Link
              to="/contact"
              className="inline-block mt-8 border border-cream/30 px-8 py-4 text-display text-sm tracking-widest hover:bg-cream hover:text-wine-dark transition-colors"
            >
              REACH OUT →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
