import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Star, X, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/favourite")({
  head: () => ({
    meta: [
      { title: "Favourite — FASHION" },
      { name: "description", content: "Your saved pieces and community favourites." },
      { property: "og:title", content: "Favourite — FASHION" },
      { property: "og:description", content: "Your saved pieces and community favourites." },
    ],
  }),
  component: Favourite,
});

const community = [
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
  "https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&q=80",
  "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
  "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80",
  "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
  "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80",
];

function Favourite() {
  const { ids, remove, count, clear } = useWishlist();
  const { data: products = [] } = useProducts();
  const { add } = useCart();
  const saved = products.filter((p) => ids.includes(p.id));

  return (
    <div>
      <section className="bg-sand py-24 px-6 relative overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -right-32 -top-32 w-96 h-96 rounded-full border-2 border-wine-dark/20"
        />
        <div className="mx-auto max-w-7xl relative">
          <Heart className="text-wine-dark mb-6" size={48} fill="currentColor" />
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display text-6xl md:text-8xl text-wine-dark"
          >
            YOUR
            <br />
            <span className="brush-highlight">FAVOURITES</span>
          </motion.h1>
          <p className="mt-8 text-wine-dark/80 text-lg max-w-xl">
            {count > 0
              ? `${count} piece${count === 1 ? "" : "s"} saved. Add to bag whenever you're ready.`
              : "Tap the heart on any piece to save it for later."}
          </p>
        </div>
      </section>

      {/* Saved items */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-display text-3xl md:text-4xl text-wine-dark">SAVED PIECES</h2>
            {count > 0 && (
              <button
                onClick={() => { clear(); toast.success("Favourites cleared"); }}
                className="text-sm text-wine-dark/70 underline hover:text-wine-dark"
              >
                Clear all
              </button>
            )}
          </div>

          {saved.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-wine-dark/20">
              <Heart className="mx-auto mb-4 text-wine-dark/40" size={40} />
              <p className="text-wine-dark/70">No favourites yet.</p>
              <Link to="/catalogue" className="inline-block mt-6 bg-wine-dark text-cream px-6 py-3 text-display tracking-wider hover:bg-wine transition-colors">
                EXPLORE CATALOGUE
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {saved.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                    <Link to="/product/$id" params={{ id: p.id }} className="block w-full h-full">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </Link>
                    <button
                      onClick={() => { remove(p.id); toast.success("Removed from favourites"); }}
                      className="absolute top-4 right-4 w-10 h-10 grid place-items-center bg-cream/90 rounded-full hover:bg-wine-dark hover:text-cream transition-colors"
                      aria-label="Remove"
                    >
                      <X size={16} />
                    </button>
                    <button
                      onClick={() => { add(p, p.sizes[0], 1); toast.success(`${p.name} added to bag`); }}
                      className="absolute bottom-0 left-0 right-0 bg-wine-dark text-cream py-4 text-display tracking-wider opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={18} /> ADD TO BAG
                    </button>
                  </div>
                  <div className="mt-4 flex justify-between items-baseline">
                    <h3 className="text-display text-lg text-wine-dark">{p.name}</h3>
                    <span className="text-wine font-semibold">Rs. {p.price.toLocaleString()}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{p.cat}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community gallery */}
      <section className="bg-wine-dark text-cream py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
            <h2 className="text-display text-5xl md:text-6xl">
              STYLED BY <span className="text-sand">YOU</span>
            </h2>
            <p className="text-cream/70 max-w-sm">
              Tag #FASHIONcommunity for a chance to be featured.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {community.map((src, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="aspect-square overflow-hidden group cursor-pointer"
              >
                <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-8">
          {[
            { q: "Quality that lives up to the lookbook.", a: "Anya — Berlin" },
            { q: "I get stopped on the street every time I wear the coat.", a: "Maya — NYC" },
            { q: "Finally a brand that does burgundy right.", a: "Sofia — Lisbon" },
          ].map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-cream p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={18} fill="currentColor" className="text-wine" />
                ))}
              </div>
              <p className="text-display text-xl text-wine-dark leading-snug">"{r.q}"</p>
              <p className="mt-4 text-muted-foreground text-sm">{r.a}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
