import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { createOrder } from "@/lib/orders";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — FASHION" }] }),
  component: Checkout,
});

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 199;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    address_line: "",
    city: "",
    postal_code: "",
    country: "India",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return <div className="py-32 grid place-items-center"><Loader2 className="animate-spin text-wine-dark" /></div>;
  if (!user) {
    return (
      <div className="py-32 text-center text-wine-dark">
        <p className="text-display text-2xl mb-4">Please sign in to checkout</p>
        <Link to="/login" className="bg-wine-dark text-cream px-8 py-3 inline-block text-display tracking-wider">SIGN IN</Link>
      </div>
    );
  }
  if (items.length === 0) {
    return (
      <div className="py-32 text-center text-wine-dark">
        <p className="text-display text-2xl mb-4">Your bag is empty</p>
        <Link to="/catalogue" className="bg-wine-dark text-cream px-8 py-3 inline-block text-display tracking-wider">SHOP</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const order = await createOrder({
        user_id: user.id,
        user_email: user.email!,
        full_name: form.full_name,
        phone: form.phone,
        address_line: form.address_line,
        city: form.city,
        postal_code: form.postal_code,
        country: form.country,
        notes: form.notes || undefined,
        subtotal,
        shipping,
        total,
        items: items.map((it) => ({
          product_id: it.id,
          product_name: it.name,
          product_image: it.img,
          size: it.size,
          quantity: it.qty,
          unit_price: it.price,
        })),
      });
      clear();
      navigate({ to: "/order/$id", params: { id: order.id } });
    } catch (err: any) {
      setError(err.message ?? "Could not place order");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-[70vh]">
      <section className="bg-sand py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-display text-5xl md:text-7xl text-wine-dark">
            CHECK<span className="brush-highlight">OUT</span>
          </motion.h1>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-12 grid lg:grid-cols-[1fr_400px] gap-12">
        <form onSubmit={handleSubmit} className="space-y-5">
          <h2 className="text-display text-2xl text-wine-dark">SHIPPING DETAILS</h2>
          {error && <div className="bg-destructive/10 text-destructive p-3 text-sm">{error}</div>}
          {[
            { k: "full_name", label: "Full name", required: true },
            { k: "phone", label: "Phone", required: true },
            { k: "address_line", label: "Address", required: true },
          ].map((f) => (
            <Field key={f.k} label={f.label} required={f.required}>
              <input
                required={f.required}
                value={(form as any)[f.k]}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                className="w-full bg-white border border-wine-dark/20 px-4 py-3 focus:outline-none focus:border-wine-dark"
              />
            </Field>
          ))}
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="City" required>
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full bg-white border border-wine-dark/20 px-4 py-3 focus:outline-none focus:border-wine-dark" />
            </Field>
            <Field label="Postal code" required>
              <input required value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} className="w-full bg-white border border-wine-dark/20 px-4 py-3 focus:outline-none focus:border-wine-dark" />
            </Field>
            <Field label="Country" required>
              <input required value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full bg-white border border-wine-dark/20 px-4 py-3 focus:outline-none focus:border-wine-dark" />
            </Field>
          </div>
          <Field label="Notes (optional)">
            <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full bg-white border border-wine-dark/20 px-4 py-3 focus:outline-none focus:border-wine-dark" />
          </Field>

          <button
            disabled={submitting}
            className="w-full bg-wine-dark text-cream py-4 text-display tracking-wider hover:bg-wine transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Lock size={16} />}
            {submitting ? "PLACING ORDER…" : "PLACE ORDER (CASH ON DELIVERY)"}
          </button>
        </form>

        <aside className="bg-wine-dark text-cream p-8 h-fit lg:sticky lg:top-28">
          <h2 className="text-display text-2xl mb-6">YOUR ORDER</h2>
          <div className="space-y-3 max-h-72 overflow-auto">
            {items.map((it) => (
              <div key={it.id + it.size} className="flex gap-3 text-sm">
                <img src={it.img} alt={it.name} className="w-14 h-16 object-cover" />
                <div className="flex-1">
                  <div className="text-cream">{it.name}</div>
                  <div className="text-cream/60 text-xs">{it.size} · ×{it.qty}</div>
                </div>
                <div>Rs. {(it.price * it.qty).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="my-6 border-t border-cream/20" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-cream/80">Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-cream/80">Shipping</span><span>{shipping === 0 ? "Free" : `Rs. ${shipping}`}</span></div>
          </div>
          <div className="my-6 border-t border-cream/20" />
          <div className="flex justify-between items-baseline">
            <span className="text-display tracking-wider">TOTAL</span>
            <span className="text-2xl font-semibold">Rs. {total.toLocaleString()}</span>
          </div>
        </aside>
      </section>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-display text-xs tracking-wider text-wine-dark/70 mb-2 block">
        {label.toUpperCase()}{required && " *"}
      </span>
      {children}
    </label>
  );
}
