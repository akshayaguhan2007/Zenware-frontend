import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles, Leaf, Globe2, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Fashion" },
      { name: "description", content: "The story behind Fashion: slow design, big personality, made for the wild generation." },
      { property: "og:title", content: "About Us — Fashion" },
      { property: "og:description", content: "Slow design, big personality, made for the wild generation." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Sparkles, title: "DESIGNED WITH SOUL", text: "Every cut, stitch and shade is chosen by humans who actually wear the clothes." },
  { icon: Leaf, title: "MADE TO LAST", text: "We pick deadstock and natural fibres so your favourite piece outlives the trend cycle." },
  { icon: Globe2, title: "MADE NEARBY", text: "Small ateliers in Bandung and Yogyakarta. Fair pay, slow batches, real people." },
  { icon: Heart, title: "WORN BY YOU", text: "Our best ideas come from the community. Tag us. We listen. We remix." },
];

function AboutPage() {
  return (
    <div className="bg-cream text-wine-dark">
      {/* Hero */}
      <section className="px-6 lg:px-16 pt-20 pb-24">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-end">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-display text-sm tracking-widest text-wine">EST. 2026 — JAKARTA</p>
            <h1 className="mt-4 text-display text-5xl md:text-7xl leading-[0.95]">
              CLOTHES <br /> WITH A <br />
              <span className="brush-highlight">POINT OF VIEW.</span>
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg text-wine-dark/70 max-w-md"
          >
            Fashion started as a group chat between four friends arguing about what "good basics"
            actually means. Five years later we still argue, but now we make the pieces we couldn't find.
          </motion.p>
        </div>
      </section>

      {/* Big image strip */}
      <section className="px-6 lg:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-6xl h-[420px] bg-gradient-to-br from-wine-dark via-wine to-sand relative overflow-hidden"
        >
          <div className="absolute inset-0 grid place-items-center text-cream">
            <p className="text-display text-3xl md:text-5xl text-center max-w-2xl px-6 leading-tight">
              "WE'RE NOT A BRAND. <br /> WE'RE A WARDROBE BUILT BY ITS OWN PEOPLE."
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values */}
      <section className="px-6 lg:px-16 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-display text-4xl md:text-5xl">WHAT WE STAND FOR</h2>
          <div className="mt-14 grid md:grid-cols-2 gap-10">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5"
              >
                <div className="w-14 h-14 grid place-items-center bg-wine-dark text-cream shrink-0">
                  <v.icon size={22} />
                </div>
                <div>
                  <h3 className="text-display text-xl">{v.title}</h3>
                  <p className="mt-2 text-wine-dark/70">{v.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-wine-dark text-cream px-6 lg:px-16 py-24">
        <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-12 text-center">
          {[
            ["180K+", "Wild ones in the community"],
            ["42", "Small ateliers we work with"],
            ["100%", "Natural & deadstock fibres"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="text-display text-6xl">{n}</p>
              <p className="mt-3 text-cream/70">{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-16 py-24 text-center">
        <h2 className="text-display text-4xl md:text-5xl">JOIN THE STORY</h2>
        <p className="mt-4 text-wine-dark/70 max-w-xl mx-auto">
          Tap in below to see what we just dropped.
        </p>
        <Link
          to="/catalogue"
          className="inline-block mt-8 bg-wine-dark text-cream px-10 py-4 text-display text-sm tracking-wider hover:bg-wine transition-colors"
        >
          SHOP THE CATALOGUE
        </Link>
      </section>
    </div>
  );
}
