import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ShoppingBag, Heart, Loader2, Search } from "lucide-react";
import { toast } from "sonner";
import { useProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/catalogue")({
  head: () => ({
    meta: [
      { title: "Catalogue — FASHION" },
      { name: "description", content: "Browse the full FASHION catalogue." },
      { property: "og:title", content: "Catalogue — FASHION" },
      { property: "og:description", content: "Browse the full FASHION catalogue." },
    ],
  }),
  component: Catalogue,
});

function Catalogue() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "low" | "high">("new");
  const { data: products = [], isLoading } = useProducts();
  const { add } = useCart();
  const wish = useWishlist();

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.cat)))];

  const filtered = useMemo(() => {
    let list = filter === "All" ? products : products.filter((p) => p.cat === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
    }
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, filter, query, sort]);

  return (
    <div>
      <section className="bg-sand py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display text-6xl md:text-8xl text-wine-dark"
          >
            CATA<span className="brush-highlight">LOGUE</span>
          </motion.h1>
          <p className="mt-6 text-wine-dark/80 text-lg max-w-2xl">
            Curated pieces for the modern wardrobe. Tap to explore, hover to add.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-10">
            <div className="flex gap-3 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-5 py-2 text-display text-sm tracking-wider transition-colors ${
                    filter === c
                      ? "bg-wine-dark text-cream"
                      : "bg-cream text-wine-dark hover:bg-sand"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine-dark/50" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pieces"
                  className="pl-9 pr-3 py-2 bg-cream border border-wine-dark/20 text-wine-dark text-sm w-56 focus:outline-none focus:border-wine-dark"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as "new" | "low" | "high")}
                className="bg-cream border border-wine-dark/20 text-wine-dark text-sm px-3 py-2 focus:outline-none"
              >
                <option value="new">Newest</option>
                <option value="low">Price: Low → High</option>
                <option value="high">Price: High → Low</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="py-24 grid place-items-center text-wine-dark/60">
              <Loader2 className="animate-spin" size={36} />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-24 text-center text-wine-dark/60">No pieces match your filters.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                    <Link to="/product/$id" params={{ id: p.id }} className="block w-full h-full">
                      <img
                        src={p.img}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        wish.toggle(p.id);
                        toast.success(wish.has(p.id) ? "Removed from favourites" : "Added to favourites");
                      }}
                      className={`absolute top-4 right-4 w-10 h-10 grid place-items-center rounded-full transition-all ${
                        wish.has(p.id)
                          ? "bg-wine-dark text-cream"
                          : "bg-cream/90 text-wine-dark opacity-0 group-hover:opacity-100 hover:bg-wine-dark hover:text-cream"
                      }`}
                      aria-label="Save"
                    >
                      <Heart size={18} fill={wish.has(p.id) ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        add(p, p.sizes[0], 1);
                        toast.success(`${p.name} added to bag`);
                      }}
                      className="absolute bottom-0 left-0 right-0 bg-wine-dark text-cream py-4 text-display tracking-wider opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={18} /> ADD TO BAG
                    </button>
                  </div>
                  <Link to="/product/$id" params={{ id: p.id }} className="block">
                    <div className="mt-4 flex justify-between items-baseline">
                      <h3 className="text-display text-lg text-wine-dark">{p.name}</h3>
                      <span className="text-wine font-semibold">Rs. {p.price.toLocaleString()}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{p.cat}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
