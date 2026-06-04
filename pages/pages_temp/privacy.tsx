import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — FASHION" }] }),
  component: PrivacyPage,
});

const sections = [
  {
    tag: "01 / COLLECT",
    title: "What we know about you",
    body: "When you shop with us, you hand us the basics — your name, email, phone, and shipping address. We also pick up breadcrumbs automatically: IP address, pages visited, time spent. Nothing sinister. Just enough to make your next visit smoother.",
  },
  {
    tag: "02 / USE",
    title: "Why we hold onto it",
    body: "We use your information to pack and ship your order, keep you in the loop about purchases, and occasionally send you something worth opening — new drops, exclusive offers. With your permission. Always with your permission.",
  },
  {
    tag: "03 / SHARE",
    title: "Who else sees it",
    body: "Short answer: almost no one. We share your address with our delivery partners to get your order to you. Our tech providers see what they need to keep the site running. Everyone's under a confidentiality agreement. We don't sell your data. Full stop.",
  },
  {
    tag: "04 / STORE",
    title: "Where it lives",
    body: "Your data is stored locally on your own device using browser storage. We layer in technical safeguards to keep it from the wrong eyes. But the real safety is in your hands — keep your device secure.",
  },
  {
    tag: "05 / COOKIES",
    title: "The crumbs we leave",
    body: "Cookies help us remember your preferences, understand what's working on the site, and deliver a smoother browse. You can turn them off in your browser settings. Some things might break — fair warning.",
  },
  {
    tag: "06 / RIGHTS",
    title: "What you can do",
    body: "Access it. Correct it. Delete it. Opt out of emails. These are yours by right, not by favour. Drop us a line at support@fashion.com and we'll sort it within 7 days.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-cream min-h-screen">

      {/* HERO */}
      <section className="relative bg-wine-dark text-cream overflow-hidden px-6 lg:px-16 pt-20 pb-32">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -right-40 -top-40 w-[600px] h-[600px] rounded-full border border-cream/5"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -right-20 -top-20 w-[400px] h-[400px] rounded-full border border-cream/10"
        />
        <div className="relative mx-auto max-w-7xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-display text-xs tracking-[0.4em] text-sand mb-6"
          >
            — HOW WE HANDLE YOUR DATA
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.88]"
          >
            YOUR<br />
            PRIVACY<br />
            <span className="text-sand">MATTERS.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-10 text-cream/60 text-sm tracking-widest"
          >
            EFFECTIVE DATE — 1 JANUARY 2026
          </motion.p>
        </div>
      </section>

      {/* INTRO PULL QUOTE */}
      <section className="px-6 lg:px-16 py-20 border-b border-wine-dark/10">
        <div className="mx-auto max-w-7xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display text-2xl md:text-4xl text-wine-dark max-w-4xl leading-snug"
          >
            "We built this store on trust. This policy is proof we take that seriously — not because we have to, but because you deserve to know exactly where your information goes."
          </motion.p>
        </div>
      </section>

      {/* SECTIONS — alternating layout */}
      <section className="px-6 lg:px-16 py-10">
        <div className="mx-auto max-w-7xl">
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid md:grid-cols-[200px_1fr] gap-8 py-14 border-b border-wine-dark/10 ${i % 2 === 1 ? "md:grid-cols-[1fr_200px]" : ""}`}
            >
              {i % 2 === 1 ? (
                <>
                  <div>
                    <h2 className="text-display text-2xl md:text-3xl text-wine-dark mb-4">{s.title}</h2>
                    <p className="text-wine-dark/70 leading-relaxed text-lg">{s.body}</p>
                  </div>
                  <div className="flex md:justify-end md:items-start">
                    <span className="text-display text-xs tracking-[0.3em] text-wine bg-sand/50 px-4 py-2 h-fit">{s.tag}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start">
                    <span className="text-display text-xs tracking-[0.3em] text-wine bg-sand/50 px-4 py-2 h-fit">{s.tag}</span>
                  </div>
                  <div>
                    <h2 className="text-display text-2xl md:text-3xl text-wine-dark mb-4">{s.title}</h2>
                    <p className="text-wine-dark/70 leading-relaxed text-lg">{s.body}</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER STRIP */}
      <section className="bg-sand px-6 lg:px-16 py-16">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-display text-2xl text-wine-dark">Questions about your data?</p>
            <p className="text-wine-dark/60 mt-1">We'll respond within 7 business days.</p>
          </div>
          <Link
            to="/contact"
            className="inline-block bg-wine-dark text-cream px-8 py-4 text-display text-sm tracking-widest hover:bg-wine transition-colors"
          >
            CONTACT US →
          </Link>
        </div>
      </section>
    </div>
  );
}
