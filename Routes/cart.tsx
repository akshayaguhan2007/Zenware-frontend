import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag } from "lucide-react";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — FASHION" },
      { name: "description", content: "Review the pieces in your bag and checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { items, setQty, remove, subtotal, count, clear } = useCart();
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 199;
  const total = subtotal + shipping;

  return (
    <div className="bg-cream min-h-[70vh]">
      <section className="bg-sand py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display text-5xl md:text-7xl text-wine-dark"
          >
            YOUR <span className="brush-highlight">BAG</span>
          </motion.h1>
          <p className="mt-4 text-wine-dark/80">
            {count} {count === 1 ? "piece" : "pieces"} waiting for you
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-24 text-center"
          >
            <ShoppingBag className="mx-auto text-wine-dark/40 mb-6" size={64} />
            <p className="text-display text-2xl text-wine-dark mb-2">Your bag is empty</p>
            <p className="text-wine-dark/60 mb-8">Start curating your wardrobe.</p>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 bg-wine-dark text-cream px-8 py-4 text-display tracking-wider hover:bg-wine transition-colors"
            >
              EXPLORE CATALOGUE <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            <div>
              <AnimatePresence>
                {items.map((it) => (
                  <motion.div
                    key={it.id + it.size}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="flex gap-4 sm:gap-6 py-6 border-b border-wine-dark/10"
                  >
                    <Link
                      to="/product/$id"
                      params={{ id: it.id }}
                      className="w-24 sm:w-32 aspect-[3/4] bg-sand overflow-hidden flex-shrink-0"
                    >
                      <img src={it.img} alt={it.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between gap-3">
                        <div>
                          <Link
                            to="/product/$id"
                            params={{ id: it.id }}
                            className="text-display text-lg text-wine-dark hover:underline"
                          >
                            {it.name}
                          </Link>
                          <p className="text-sm text-wine-dark/60 mt-1">Size: {it.size}</p>
                        </div>
                        <button
                          onClick={() => remove(it.id, it.size)}
                          className="text-wine-dark/50 hover:text-wine-dark"
                          aria-label="Remove"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <div className="mt-auto pt-4 flex justify-between items-end">
                        <div className="inline-flex items-center border border-wine-dark/30">
                          <button
                            onClick={() => setQty(it.id, it.size, it.qty - 1)}
                            className="w-9 h-9 grid place-items-center hover:bg-sand text-wine-dark"
                            aria-label="Decrease"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-9 text-center text-wine-dark text-sm">{it.qty}</span>
                          <button
                            onClick={() => setQty(it.id, it.size, it.qty + 1)}
                            className="w-9 h-9 grid place-items-center hover:bg-sand text-wine-dark"
                            aria-label="Increase"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="text-wine font-semibold">
                          Rs. {(it.price * it.qty).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button
                onClick={clear}
                className="mt-6 text-sm text-wine-dark/60 hover:text-wine-dark underline"
              >
                Clear bag
              </button>
            </div>

            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-wine-dark text-cream p-8 h-fit lg:sticky lg:top-28"
            >
              <h2 className="text-display text-2xl mb-6">ORDER SUMMARY</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cream/80">Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cream/80">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span>
                </div>
              </div>

              <div className="my-6 border-t border-cream/20" />

              <div className="flex justify-between items-baseline mb-6">
                <span className="text-display tracking-wider">TOTAL</span>
                <span className="text-2xl font-semibold">Rs. {total.toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2 mb-6 bg-cream/10 px-3 py-2 text-xs text-cream/80">
                <Tag size={14} /> Use code WINE10 for 10% off
              </div>

              <Link
                to="/checkout"
                className="w-full bg-cream text-wine-dark py-4 text-display tracking-wider hover:bg-sand transition-colors flex items-center justify-center gap-2"
              >
                CHECKOUT <ArrowRight size={18} />
              </Link>
              <Link
                to="/catalogue"
                className="block text-center mt-4 text-sm text-cream/70 hover:text-cream underline"
              >
                Continue shopping
              </Link>
            </motion.aside>
          </div>
        )}
      </section>
    </div>
  );
}
