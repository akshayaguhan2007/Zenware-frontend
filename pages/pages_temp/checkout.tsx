import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Loader2, Lock, LocateFixed, CheckCircle2, AlertCircle, MapPin, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { createOrder } from "@/lib/orders";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — ZenWear" }] }),
  component: Checkout,
});

type Form = {
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code: string;
  country: string;
  notes: string;
};

type LocationStatus = "idle" | "fetching" | "success" | "error";

function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const shipping = subtotal > 2000 || subtotal === 0 ? 0 : 199;
  const total = subtotal + shipping;

  const [form, setForm] = useState<Form>({
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
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationMsg, setLocationMsg] = useState("");
  const [showPermHelp, setShowPermHelp] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const lookupPincode = async () => {
    if (pincode.length < 6) { toast.error("Enter a valid 6-digit pincode"); return; }
    setPincodeLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1`, { headers: { "Accept-Language": "en" } });
      const data = await res.json();
      if (!data.length) { toast.error("Pincode not found. Please fill in manually."); setPincodeLoading(false); return; }
      const { lat, lon } = data[0];
      const rev = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, { headers: { "Accept-Language": "en" } });
      const addr = (await rev.json()).address ?? {};
      setForm((f) => ({
        ...f,
        city: addr.city ?? addr.town ?? addr.village ?? addr.county ?? f.city,
        postal_code: pincode,
        country: addr.country ?? f.country,
      }));
      setLocationStatus("success");
      setLocationMsg("Address filled from pincode — review and adjust if needed.");
      setShowPermHelp(false);
      toast.success("Address filled from pincode!");
    } catch {
      toast.error("Could not look up pincode. Please fill in manually.");
    } finally {
      setPincodeLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationMsg("Geolocation is not supported by your browser.");
      return;
    }
    setLocationStatus("fetching");
    setLocationMsg("Detecting your location…");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr = data.address ?? {};

          const road = addr.road ?? addr.pedestrian ?? addr.street ?? "";
          const suburb = addr.suburb ?? addr.neighbourhood ?? addr.quarter ?? "";
          const addressLine = [road, suburb].filter(Boolean).join(", ");
          const city = addr.city ?? addr.town ?? addr.village ?? addr.county ?? "";
          const postalCode = addr.postcode ?? "";
          const country = addr.country ?? "India";

          setForm((f) => ({
            ...f,
            address_line: addressLine || f.address_line,
            city: city || f.city,
            postal_code: postalCode || f.postal_code,
            country: country || f.country,
          }));
          setLocationStatus("success");
          setLocationMsg("Location filled in — review and adjust if needed.");
        } catch {
          setLocationStatus("error");
          setLocationMsg("Could not fetch address. Please fill in manually.");
        }
      },
      (err) => {
        setLocationStatus("error");
        if (err.code === 1) {
          setLocationMsg("Location permission denied.");
          setShowPermHelp(true);
        } else {
          setLocationMsg("Could not get your location. Please fill in manually.");
        }
      },
      { timeout: 10000 }
    );
  };

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
        user_email: user.email,
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

          {/* personal fields */}
          {[
            { k: "full_name", label: "Full name", required: true },
            { k: "phone", label: "Phone", required: true },
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

          {/* ── LIVE LOCATION BUTTON ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={detectLocation}
                disabled={locationStatus === "fetching"}
                className="inline-flex items-center gap-2 border border-wine-dark/30 px-4 py-2 text-display text-xs tracking-widest text-wine-dark hover:bg-wine-dark hover:text-cream transition-colors disabled:opacity-50"
              >
                {locationStatus === "fetching" ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
                {locationStatus === "fetching" ? "DETECTING…" : "USE MY LOCATION"}
              </button>

              {locationStatus === "success" && (
                <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-xs text-green-600">
                  <CheckCircle2 size={13} /> {locationMsg}
                </motion.span>
              )}
              {locationStatus === "error" && !showPermHelp && (
                <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle size={13} /> {locationMsg}
                </motion.span>
              )}
            </div>

            {/* permission denied help panel */}
            <AnimatePresence>
              {showPermHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="border border-orange-200 bg-orange-50 p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle size={15} className="text-orange-500 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-orange-800">Location permission was denied</p>
                      </div>
                      <button type="button" onClick={() => setShowPermHelp(false)} className="text-orange-400 hover:text-orange-600 text-xs">✕</button>
                    </div>

                    {/* how to enable */}
                    <div className="text-xs text-orange-700 space-y-1">
                      <p className="font-semibold">To enable location in your browser:</p>
                      <ol className="list-decimal list-inside space-y-0.5 pl-1">
                        <li>Click the <strong>lock / info icon</strong> in the address bar</li>
                        <li>Find <strong>Location</strong> and set it to <strong>Allow</strong></li>
                        <li>Reload the page and try again</li>
                      </ol>
                    </div>

                    <div className="border-t border-orange-200 pt-3">
                      <p className="text-xs text-orange-700 font-semibold mb-2 flex items-center gap-1.5">
                        <MapPin size={12} /> OR fill from pincode:
                      </p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                          placeholder="Enter 6-digit pincode"
                          className="flex-1 border border-orange-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-wine-dark"
                        />
                        <button
                          type="button"
                          onClick={lookupPincode}
                          disabled={pincodeLoading || pincode.length < 6}
                          className="px-4 py-2 bg-wine-dark text-cream text-display text-xs tracking-wider hover:bg-wine transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {pincodeLoading ? <Loader2 size={12} className="animate-spin" /> : <ChevronDown size={12} />}
                          FILL
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* address fields — pre-filled by location */}
          <Field label="Address" required>
            <input
              required
              value={form.address_line}
              onChange={(e) => setForm({ ...form, address_line: e.target.value })}
              placeholder="Street, area"
              className={`w-full bg-white border px-4 py-3 focus:outline-none focus:border-wine-dark transition-colors ${
                locationStatus === "success" ? "border-green-400" : "border-wine-dark/20"
              }`}
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="City" required>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className={`w-full bg-white border px-4 py-3 focus:outline-none focus:border-wine-dark transition-colors ${
                  locationStatus === "success" ? "border-green-400" : "border-wine-dark/20"
                }`}
              />
            </Field>
            <Field label="Postal code" required>
              <input
                required
                value={form.postal_code}
                onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
                className={`w-full bg-white border px-4 py-3 focus:outline-none focus:border-wine-dark transition-colors ${
                  locationStatus === "success" ? "border-green-400" : "border-wine-dark/20"
                }`}
              />
            </Field>
            <Field label="Country" required>
              <input
                required
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className={`w-full bg-white border px-4 py-3 focus:outline-none focus:border-wine-dark transition-colors ${
                  locationStatus === "success" ? "border-green-400" : "border-wine-dark/20"
                }`}
              />
            </Field>
          </div>

          <Field label="Notes (optional)">
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full bg-white border border-wine-dark/20 px-4 py-3 focus:outline-none focus:border-wine-dark"
            />
          </Field>

          <button
            disabled={submitting}
            className="w-full bg-wine-dark text-cream py-4 text-display tracking-wider hover:bg-wine transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Lock size={16} />}
            {submitting ? "PLACING ORDER…" : "PLACE ORDER (CASH ON DELIVERY)"}
          </button>
        </form>

        {/* order summary */}
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
