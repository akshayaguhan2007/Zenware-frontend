import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/fashion")({
  head: () => ({
    meta: [
      { title: "Fashion — FASHION" },
      { name: "description", content: "Editorial fashion stories, lookbooks, and the trends shaping this season." },
      { property: "og:title", content: "Fashion — FASHION" },
      { property: "og:description", content: "Editorial fashion stories and lookbooks." },
    ],
  }),
  component: Fashion,
});

const stories = [
  {
    title: "Autumn in Wine",
    desc: "Deep burgundy tones, soft knits, and the quiet drama of falling light.",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80",
  },
  {
    title: "Soft Power",
    desc: "Tailoring reimagined with cream silhouettes and confident posture.",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80",
  },
  {
    title: "Off Duty",
    desc: "Effortless layers built for the in-between moments of the week.",
    img: "https://images.unsplash.com/photo-1485518882345-15568b007407?w=1200&q=80",
  },
];

const trends = [
  { tag: "01", name: "Oversized Tailoring" },
  { tag: "02", name: "Burgundy Saturation" },
  { tag: "03", name: "Sheer Layering" },
  { tag: "04", name: "Vintage Leather" },
  { tag: "05", name: "Sculptural Knits" },
  { tag: "06", name: "Quiet Luxury" },
];

function Fashion() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-wine-dark text-cream py-24 px-6 overflow-hidden">
        <div className="mx-auto max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-display text-6xl md:text-9xl leading-[0.9]"
          >
            FASHION
            <br />
            <span className="text-sand">JOURNAL</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 max-w-xl text-cream/80 text-lg"
          >
            Editorial moments, behind-the-seams stories, and a calendar of the
            trends shaping this season.
          </motion.p>
        </div>
      </section>

      {/* Editorial stories */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl space-y-32">
          {stories.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:[&>:first-child]:order-2" : ""
              }`}
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="text-display text-sm tracking-widest text-wine">
                  STORY {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-4 text-display text-5xl md:text-6xl text-wine-dark leading-tight">
                  {s.title}
                </h2>
                <p className="mt-6 text-wine-dark/70 text-lg leading-relaxed">{s.desc}</p>
                <button className="mt-8 text-display tracking-wider border-b-2 border-wine-dark pb-1 hover:text-wine transition-colors">
                  READ STORY →
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Trend index */}
      <section className="bg-cream py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-display text-5xl md:text-6xl text-wine-dark mb-16">
            TREND <span className="brush-highlight">INDEX</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-wine-dark/10">
            {trends.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-cream p-10 hover:bg-sand transition-colors cursor-pointer group"
              >
                <div className="text-display text-sm text-wine">{t.tag}</div>
                <h3 className="mt-4 text-display text-3xl text-wine-dark group-hover:translate-x-2 transition-transform">
                  {t.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
