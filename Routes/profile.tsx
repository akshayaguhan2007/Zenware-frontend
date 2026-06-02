import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  User as UserIcon,
  Heart,
  ShoppingBag,
  Settings,
  Sparkles,
  MapPin,
  Pencil,
  Check,
  LogOut,
  Package,
  Star,
  Camera,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — FASHION" },
      { name: "description", content: "Curate your style story, orders and wishlist." },
    ],
  }),
  component: ProfilePage,
});

type Profile = {
  name: string;
  handle: string;
  bio: string;
  city: string;
  vibe: string;
};

const PKEY = (userId: string) => `fashion-profile-${userId}`;

const orders = [
  { id: "FSH-2041", date: "May 18, 2026", total: 248, status: "Delivered", items: 2 },
  { id: "FSH-1987", date: "Apr 02, 2026", total: 92, status: "Delivered", items: 1 },
  { id: "FSH-1820", date: "Feb 14, 2026", total: 416, status: "Delivered", items: 4 },
];

const wishlist = [
  { id: "w1", name: "Wool Trench, Ecru", price: 289 },
  { id: "w2", name: "Silk Slip Dress", price: 168 },
  { id: "w3", name: "Suede Loafer, Cocoa", price: 142 },
  { id: "w4", name: "Pleated Midi Skirt", price: 124 },
];

const moodPalette = ["#561C24", "#6D2932", "#C7B7A3", "#E8D8C4", "#F4ECDF"];

type Tab = "overview" | "orders" | "wishlist" | "settings";

function ProfilePage() {
  const { user, loading, signOut, updatePassword } = useAuth();
  const { count, subtotal } = useCart();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [editing, setEditing] = useState(false);

  // build default profile from signup data
  const defaultFromAuth: Profile = useMemo(() => ({
    name: user?.name || "Style Curator",
    handle: user?.email?.split("@")[0] ?? "style.muse",
    bio: "Slow fashion · vintage hearts · coffee in one hand, cashmere in the other.",
    city: "India",
    vibe: "Quiet Luxury",
  }), [user]);

  const [profile, setProfile] = useState<Profile>(defaultFromAuth);
  const [draft, setDraft] = useState<Profile>(defaultFromAuth);
  const [pw, setPw] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(PKEY(user.id));
      if (raw) {
        const p = JSON.parse(raw) as Profile;
        setProfile(p);
        setDraft(p);
      } else {
        // first visit — use signup data
        setProfile(defaultFromAuth);
        setDraft(defaultFromAuth);
      }
    } catch {}
  }, [user]);

  const initials = useMemo(
    () =>
      profile.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase(),
    [profile.name],
  );

  const memberSince = useMemo(() => {
    if (!user?.created_at) return "—";
    return new Date(user.created_at).toLocaleDateString(undefined, {
      month: "long",
      year: "numeric",
    });
  }, [user]);

  const save = () => {
    if (!user) return;
    setProfile(draft);
    localStorage.setItem(PKEY(user.id), JSON.stringify(draft));
    setEditing(false);
  };

  const changePw = async () => {
    setPwMsg(null);
    if (pw.length < 6) {
      setPwMsg("Password must be at least 6 characters.");
      return;
    }
    const { error } = await updatePassword(pw);
    setPwMsg(error ?? "Password updated.");
    if (!error) setPw("");
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] grid place-items-center text-wine-dark/60">
        Loading your space…
      </div>
    );
  }

  return (
    <div className="bg-cream">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-wine-dark/10">
        <div className="absolute inset-0 -z-0">
          <div className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full bg-wine/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 w-[480px] h-[480px] rounded-full bg-sand/50 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 text-wine-dark/70 text-xs tracking-[0.3em] uppercase"
          >
            <Sparkles size={14} /> Your Atelier
          </motion.div>

          <div className="mt-8 grid lg:grid-cols-[auto_1fr_auto] gap-10 items-end">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="relative"
            >
              <div className="relative w-44 h-44 rounded-full bg-wine-dark text-cream grid place-items-center text-display text-6xl shadow-2xl ring-8 ring-cream">
                {initials}
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-3 rounded-full border border-dashed border-wine-dark/40"
                />
              </div>
              <button
                aria-label="Change photo"
                className="absolute bottom-2 right-2 bg-cream text-wine-dark border border-wine-dark/20 rounded-full p-2 hover:bg-white transition"
              >
                <Camera size={16} />
              </button>
            </motion.div>

            {/* Name block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-display text-5xl md:text-7xl text-wine-dark leading-[0.95]">
                {profile.name.split(" ")[0]}
                <br />
                <span className="brush-highlight">{profile.name.split(" ").slice(1).join(" ") || "."}</span>
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-wine-dark/70">
                <span className="text-display tracking-wider">@{profile.handle}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} /> {profile.city}</span>
                <span className="px-3 py-1 bg-wine-dark text-cream text-xs tracking-widest uppercase">{profile.vibe}</span>
              </div>
              <p className="mt-5 max-w-xl text-wine-dark/80 leading-relaxed">{profile.bio}</p>
            </motion.div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-3 min-w-[180px]"
            >
              <button
                onClick={() => { setDraft(profile); setEditing(true); setTab("settings"); }}
                className="inline-flex items-center justify-center gap-2 bg-wine-dark text-cream px-5 py-3 text-sm tracking-widest uppercase hover:bg-wine transition"
              >
                <Pencil size={14} /> Edit profile
              </button>
              <button
                onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                className="inline-flex items-center justify-center gap-2 border border-wine-dark/30 text-wine-dark px-5 py-3 text-sm tracking-widest uppercase hover:bg-wine-dark hover:text-cream transition"
              >
                <LogOut size={14} /> Sign out
              </button>
            </motion.div>
          </div>

          {/* Mood palette */}
          <div className="mt-12 flex items-center gap-3">
            <span className="text-xs tracking-[0.3em] uppercase text-wine-dark/60">Mood</span>
            <div className="flex">
              {moodPalette.map((c, i) => (
                <motion.span
                  key={c}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="w-10 h-10 -ml-2 first:ml-0 rounded-full ring-2 ring-cream"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Member since", value: memberSince, icon: Sparkles },
            { label: "Orders", value: String(orders.length), icon: Package },
            { label: "In bag", value: `${count} · $${subtotal}`, icon: ShoppingBag },
            { label: "Loved", value: String(wishlist.length), icon: Heart },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-wine-dark/10 p-5 flex items-start justify-between hover:shadow-lg transition"
            >
              <div>
                <div className="text-[11px] tracking-[0.25em] uppercase text-wine-dark/60">{s.label}</div>
                <div className="mt-2 text-display text-xl text-wine-dark">{s.value}</div>
              </div>
              <s.icon size={18} className="text-wine" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* TABS */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 mt-16 pb-24">
        <div className="flex flex-wrap gap-2 border-b border-wine-dark/15">
          {([
            ["overview", "Overview", UserIcon],
            ["orders", "Orders", Package],
            ["wishlist", "Wishlist", Heart],
            ["settings", "Settings", Settings],
          ] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`relative flex items-center gap-2 px-5 py-3 text-sm tracking-widest uppercase transition ${
                tab === key ? "text-wine-dark" : "text-wine-dark/50 hover:text-wine-dark"
              }`}
            >
              <Icon size={14} /> {label}
              {tab === key && (
                <motion.span
                  layoutId="tab-ind"
                  className="absolute left-0 right-0 -bottom-px h-0.5 bg-wine-dark"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-10"
          >
            {tab === "overview" && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white border border-wine-dark/10 p-8">
                  <h3 className="text-display text-2xl text-wine-dark">Your style story</h3>
                  <p className="mt-3 text-wine-dark/70 leading-relaxed">
                    A living archive of the pieces you've collected, loved, and lived in. Update your vibe anytime.
                  </p>
                  <div className="mt-6 grid sm:grid-cols-3 gap-4">
                    {["Last worn", "Most loved", "Saved for later"].map((t, i) => (
                      <div key={t} className="p-4 bg-cream border border-wine-dark/10">
                        <div className="text-[11px] tracking-[0.25em] uppercase text-wine-dark/60">{t}</div>
                        <div className="mt-2 text-display text-wine-dark">
                          {["Wool Trench", "Silk Slip", "Suede Loafer"][i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-wine-dark text-cream p-8 flex flex-col justify-between">
                  <div>
                    <Star className="mb-4" />
                    <h3 className="text-display text-2xl">Atelier Member</h3>
                    <p className="mt-2 text-cream/80 text-sm">Early access · complimentary alterations · concierge styling.</p>
                  </div>
                  <Link to="/catalogue" className="mt-6 inline-flex items-center justify-center border border-cream/40 px-5 py-3 text-xs tracking-widest uppercase hover:bg-cream hover:text-wine-dark transition">
                    Explore new arrivals
                  </Link>
                </div>
              </div>
            )}

            {tab === "orders" && (
              <div className="bg-white border border-wine-dark/10">
                {orders.map((o, i) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-3 items-center p-6 border-b last:border-b-0 border-wine-dark/10 hover:bg-cream/40 transition"
                  >
                    <div>
                      <div className="text-[11px] tracking-[0.25em] uppercase text-wine-dark/60">Order</div>
                      <div className="text-display text-wine-dark">{o.id}</div>
                    </div>
                    <div className="text-sm text-wine-dark/80">{o.date}</div>
                    <div className="text-sm text-wine-dark/80">{o.items} pieces</div>
                    <div className="text-display text-wine-dark">${o.total}</div>
                    <div className="md:text-right">
                      <span className="inline-block px-3 py-1 bg-wine-dark text-cream text-[10px] tracking-widest uppercase">{o.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === "wishlist" && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {wishlist.map((w, i) => (
                  <motion.div
                    key={w.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="group bg-white border border-wine-dark/10 overflow-hidden"
                  >
                    <div className="aspect-[3/4] bg-gradient-to-br from-sand/60 to-wine/20 relative">
                      <Heart className="absolute top-3 right-3 fill-wine-dark text-wine-dark" size={18} />
                      <div className="absolute inset-0 grid place-items-center text-display text-wine-dark/30 text-4xl">
                        {w.name.split(" ")[0]}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-sm text-wine-dark">{w.name}</div>
                      <div className="mt-1 text-display text-wine-dark">${w.price}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {tab === "settings" && (
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white border border-wine-dark/10 p-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-display text-2xl text-wine-dark">Profile details</h3>
                    {!editing ? (
                      <button onClick={() => { setDraft(profile); setEditing(true); }} className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-wine hover:text-wine-dark">
                        <Pencil size={14} /> Edit
                      </button>
                    ) : (
                      <button onClick={save} className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-wine-dark">
                        <Check size={14} /> Save
                      </button>
                    )}
                  </div>
                  <div className="mt-6 space-y-4">
                    {([
                      ["name", "Name"],
                      ["handle", "Handle"],
                      ["city", "City"],
                      ["vibe", "Vibe"],
                      ["bio", "Bio"],
                    ] as const).map(([k, label]) => (
                      <div key={k}>
                        <div className="text-[11px] tracking-[0.25em] uppercase text-wine-dark/60">{label}</div>
                        {editing ? (
                          k === "bio" ? (
                            <textarea
                              value={draft.bio}
                              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                              rows={3}
                              className="mt-1 w-full bg-cream border border-wine-dark/15 px-3 py-2 text-sm focus:outline-none focus:border-wine-dark"
                            />
                          ) : (
                            <input
                              value={draft[k]}
                              onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
                              className="mt-1 w-full bg-cream border border-wine-dark/15 px-3 py-2 text-sm focus:outline-none focus:border-wine-dark"
                            />
                          )
                        ) : (
                          <div className="mt-1 text-wine-dark">{profile[k]}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-wine-dark/10 p-8">
                  <h3 className="text-display text-2xl text-wine-dark">Account & security</h3>
                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="text-[11px] tracking-[0.25em] uppercase text-wine-dark/60">Email</div>
                      <div className="mt-1 text-wine-dark">{user.email}</div>
                    </div>
                    <div>
                      <div className="text-[11px] tracking-[0.25em] uppercase text-wine-dark/60">New password</div>
                      <input
                        type="password"
                        value={pw}
                        onChange={(e) => setPw(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1 w-full bg-cream border border-wine-dark/15 px-3 py-2 text-sm focus:outline-none focus:border-wine-dark"
                      />
                    </div>
                    <button
                      onClick={changePw}
                      className="w-full bg-wine-dark text-cream px-5 py-3 text-sm tracking-widest uppercase hover:bg-wine transition"
                    >
                      Update password
                    </button>
                    {pwMsg && <div className="text-xs text-wine-dark/70">{pwMsg}</div>}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}


