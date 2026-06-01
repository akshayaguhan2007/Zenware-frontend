import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Coffee, Music, Camera, BookOpen } from "lucide-react";

export const Route = createFileRoute("/lifestyle")({
  head: () => ({
    meta: [
      { title: "Lifestyle — FASHION" },
      { name: "description", content: "Fashion is more than clothes. Explore the rituals, places, and playlists that shape the FASHION lifestyle." },
      { property: "og:title", content: "Lifestyle — FASHION" },
      { property: "og:description", content: "The rituals and moments that shape the FASHION lifestyle." },
    ],
  }),
  component: Lifestyle,
});

const pillars = [
  { Icon: Coffee, title: "Slow Mornings", desc: "Linen robes and pour-over rituals." },
  { Icon: Camera, title: "Documented", desc: "35mm film, golden hour, soft grain." },
  { Icon: Music, title: "On Rotation", desc: "Playlists for getting dressed slowly." },
  { Icon: BookOpen, title: "Read Aloud", desc: "Editorials, essays and second-hand novels." },
];

const journal = [
  {
    tag: "Travel",
    title: "A weekend wardrobe for Lisbon",
    img: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1000&q=80",
  },
  {
    tag: "Home",
    title: "Building a quiet bedroom corner",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&q=80",
  },
  {
    tag: "Ritual",
    title: "The five-minute morning edit",
    img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80",
  },
];

function Lifestyle() {
  return (
    <div>
      {/* Hero with parallax-feel image */}
      <section className="relative h-[85vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=80"
          alt="Lifestyle"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-wine-dark/40" />
        <div className="relative h-full mx-auto max-w-7xl px-6 flex items-end pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="text-cream/80 text-display tracking-widest">— THE LIFESTYLE ISSUE</span>
            <h1 className="mt-4 text-display text-6xl md:text-9xl text-cream leading-[0.9]">
              LIVE IT.
              <br />
              <span className="text-sand">WEAR IT.</span>
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24 px-6 bg-cream">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-wine-dark/10">
            {pillars.map(({ Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-cream p-10 hover:bg-sand transition-colors group"
              >
                <Icon className="text-wine-dark mb-6 group-hover:scale-110 transition-transform" size={36} />
                <h3 className="text-display text-2xl text-wine-dark">{title}</h3>
                <p className="mt-3 text-wine-dark/70">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journal grid */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-display text-5xl md:text-6xl text-wine-dark mb-16">
            FROM THE <span className="brush-highlight">JOURNAL</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {journal.map((j, i) => (
              <motion.article
                key={j.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={j.img}
                    alt={j.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="mt-6">
                  <span className="text-display text-xs tracking-widest text-wine">{j.tag.toUpperCase()}</span>
                  <h3 className="mt-2 text-display text-2xl text-wine-dark leading-snug group-hover:text-wine transition-colors">
                    {j.title}
                  </h3>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="bg-wine-dark text-cream py-32 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-display text-4xl md:text-6xl leading-tight"
          >
            "Style is a way to say who you are
            <span className="text-sand"> without having to speak.</span>"
          </motion.blockquote>
          <p className="mt-8 text-cream/60 text-display tracking-widest text-sm">
            — RACHEL ZOE
          </p>
        </div>
      </section>
    </div>
  );
}
