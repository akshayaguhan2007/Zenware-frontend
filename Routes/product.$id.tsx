import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { ShoppingBag, Heart, Truck, RotateCcw, Shield, ChevronLeft, Minus, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProduct, useProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [{ title: "Product — FASHION" }],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="py-32 text-center text-wine-dark">
      <p className="text-display text-2xl">Piece not found</p>
      <Link to="/catalogue" className="mt-6 inline-block underline">Back to catalogue</Link>
    </div>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const { data: p, isLoading } = useProduct(id);
  const { data: all = [] } = useProducts();
  const [size, setSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const wish = useWishlist();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="py-32 grid place-items-center text-wine-dark/60">
        <Loader2 className="animate-spin" size={36} />
      </div>
    );
  }
  if (!p) {
    return (
      <div className="py-32 text-center text-wine-dark">
        <p className="text-display text-2xl">Piece not found</p>
        <Link to="/catalogue" className="mt-6 inline-block underline">Back to catalogue</Link>
      </div>
    );
  }

  const currentSize = size || p.sizes[0];
  const related = all.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3);

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-8">
        <Link to="/catalogue" className="inline-flex items-center gap-2 text-wine-dark/70 hover:text-wine-dark text-sm tracking-wider">
          <ChevronLeft size={16} /> CATALOGUE
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-10 grid lg:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[3/4] overflow-hidden bg-sand"
        >
          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
          <span className="absolute top-4 left-4 bg-wine-dark text-cream px-3 py-1 text-xs tracking-wider text-display">
            {p.cat.toUpperCase()}
          </span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
          <h1 className="text-display text-4xl md:text-5xl text-wine-dark leading-tight">{p.name}</h1>
          <p className="mt-3 text-2xl text-wine font-semibold">Rs. {p.price.toLocaleString()}</p>
          <p className="mt-6 text-wine-dark/80 leading-relaxed">{p.description}</p>

          <div className="mt-8">
            <p className="text-display text-sm tracking-wider text-wine-dark mb-3">SIZE</p>
            <div className="flex gap-2 flex-wrap">
              {p.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-12 px-4 py-2 border text-display text-sm transition-colors ${
                    currentSize === s
                      ? "bg-wine-dark text-cream border-wine-dark"
                      : "bg-cream text-wine-dark border-wine-dark/30 hover:border-wine-dark"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-display text-sm tracking-wider text-wine-dark mb-3">QUANTITY</p>
            <div className="inline-flex items-center border border-wine-dark/30">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 grid place-items-center hover:bg-sand text-wine-dark" aria-label="Decrease"><Minus size={16} /></button>
              <span className="w-10 text-center text-wine-dark font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 grid place-items-center hover:bg-sand text-wine-dark" aria-label="Increase"><Plus size={16} /></button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                add(p, currentSize, qty);
                toast.success(`${p.name} added to bag`);
                navigate({ to: "/cart" });
              }}
              className="flex-1 bg-wine-dark text-cream py-4 text-display tracking-wider hover:bg-wine transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} /> ADD TO BAG
            </button>
            <button
              onClick={() => {
                wish.toggle(p.id);
                toast.success(wish.has(p.id) ? "Removed from favourites" : "Saved to favourites");
              }}
              className={`w-14 h-14 grid place-items-center border transition-colors ${
                wish.has(p.id)
                  ? "bg-wine-dark text-cream border-wine-dark"
                  : "border-wine-dark/30 text-wine-dark hover:bg-sand"
              }`}
              aria-label="Save"
            >
              <Heart size={18} fill={wish.has(p.id) ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-wine-dark/10 pt-6">
            {[
              { icon: Truck, t: "Free shipping", s: "Above Rs. 2,000" },
              { icon: RotateCcw, t: "Easy returns", s: "Within 14 days" },
              { icon: Shield, t: "Secure pay", s: "Protected checkout" },
            ].map(({ icon: Icon, t, s }) => (
              <div key={t} className="text-center">
                <Icon className="mx-auto text-wine-dark mb-2" size={22} />
                <p className="text-display text-xs tracking-wider text-wine-dark">{t}</p>
                <p className="text-xs text-wine-dark/60">{s}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
          <h2 className="text-display text-3xl text-wine-dark mb-8">
            YOU MAY <span className="brush-highlight">ALSO LOVE</span>
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {related.map((r) => (
              <Link key={r.id} to="/product/$id" params={{ id: r.id }} className="group">
                <div className="aspect-[3/4] overflow-hidden bg-sand">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="mt-3 flex justify-between">
                  <span className="text-display text-wine-dark">{r.name}</span>
                  <span className="text-wine font-semibold">Rs. {r.price.toLocaleString()}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
