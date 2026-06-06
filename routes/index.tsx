import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Zap, ShoppingBag, Heart, Truck, RotateCcw, Shield, Smartphone, PlayCircle } from "lucide-react";
import { useProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZenWear — Explore Unique Clothes" },
      { name: "description", content: "Curated fashion for the modern wardrobe." },
    ],
  }),
  component: Index,
});

/* ─────────────────────────── DATA ─────────────────────────── */
const banners = [
  {
    tag: "NEW SEASON",
    title: "SUMMER\nCOLLECTION\n2026",
    sub: "Up to 40% off on selected styles",
    cta: "Shop Collection",
    to: "/catalogue",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=85",
  },
  {
    tag: "FLASH SALE · 24 HRS",
    title: "PAYDAY\nSALE\nNOW",
    sub: "Spend Rs. 2,000 — get 30% off your next order",
    cta: "Grab the Deal",
    to: "/catalogue",
    img: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1400&q=85",
  },
  {
    tag: "LIFESTYLE EDIT",
    title: "LIVE IT.\nWEAR IT.\nOWN IT.",
    sub: "Curated pieces for the modern wardrobe",
    cta: "Explore Lifestyle",
    to: "/lifestyle",
    img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1400&q=85",
  },
];

const offers = [
  { icon: Zap, title: "Extra 20% Off", sub: "On your first order" },
  { icon: Truck, title: "Free Shipping", sub: "On orders above ₹2,000" },
  { icon: RotateCcw, title: "Easy Returns", sub: "14-day hassle-free returns" },
  { icon: Shield, title: "Secure Payments", sub: "COD & encrypted checkout" },
];

const saleCategories = [
  { label: "Tops", off: "50%", img: "https://images.unsplash.com/photo-1594938298603-c8148c4b4b5d?w=500&q=80" },
  { label: "Dresses", off: "40%", img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80" },
  { label: "Outerwear", off: "35%", img: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=500&q=80" },
  { label: "Bottoms", off: "30%", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80" },
  { label: "Lifestyle", off: "25%", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80" },
  { label: "Accessories", off: "20%", img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80" },
];

const brands = ["OBEY", "LACOSTE", "Levi's", "ZARA", "H&M", "Uniqlo", "Mango", "Nike"];

/* ─────────────────────────── HOOKS ─────────────────────────── */
function useCountdown(hours = 18) {
  const end = useRef(Date.now() + hours * 3_600_000);
  const [left, setLeft] = useState(end.current - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, end.current - Date.now())), 1000);
    return () => clearInterval(t);
  }, []);
  return {
    h: Math.floor(left / 3_600_000),
    m: Math.floor((left % 3_600_000) / 60_000),
    s: Math.floor((left % 60_000) / 1_000),
  };
}

/* ─────────────────────────── COMPONENTS ─────────────────────── */

function HeroBannerSlider() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const go = (n: number, d: number) => { setDir(d); setCurrent(n); };

  useEffect(() => {
    const t = setInterval(() => go((current + 1) % banners.length, 1), 6000);
    return () => clearInterval(t);
  }, [current]);

  const b = banners[current];

  return (
    <div className="relative h-[88vh] min-h-[560px] overflow-hidden bg-wine-dark">
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={current}
          custom={dir}
          variants={{
            enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
          }}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          <img src={b.img} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

          <div className="relative h-full mx-auto max-w-7xl px-8 lg:px-16 flex flex-col justify-center pb-20">
            <motion.p
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-display text-xs tracking-[0.4em] text-sand/80 mb-6"
            >
              — {b.tag}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.8 }}
              className="text-display text-[clamp(3.5rem,9vw,7.5rem)] text-cream leading-[0.85] whitespace-pre-line"
            >
              {b.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}
              className="mt-6 text-cream/70 text-base max-w-xs leading-relaxed"
            >
              {b.sub}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
              <Link
                to={b.to}
                className="mt-8 inline-flex items-center gap-2 bg-cream text-wine-dark px-8 py-4 text-display text-sm tracking-widest hover:bg-sand transition-colors"
              >
                {b.cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* arrows */}
      <button
        onClick={() => go((current - 1 + banners.length) % banners.length, -1)}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-cream grid place-items-center transition-all z-10 rounded-full"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go((current + 1) % banners.length, 1)}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-cream grid place-items-center transition-all z-10 rounded-full"
      >
        <ChevronRight size={20} />
      </button>

      {/* dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > current ? 1 : -1)}
            className={`h-1 rounded-full transition-all duration-500 ${i === current ? "w-10 bg-cream" : "w-3 bg-cream/30"}`}
          />
        ))}
      </div>

      {/* slide counter */}
      <div className="absolute bottom-8 right-8 text-display text-xs text-cream/40 z-10">
        {String(current + 1).padStart(2, "0")} / {String(banners.length).padStart(2, "0")}
      </div>
    </div>
  );
}

/* countdown digits */
function Digit({ value }: { value: number }) {
  const pad = String(value).padStart(2, "0");
  return (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={pad}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 12, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="block text-display text-2xl text-wine-dark leading-none font-bold tabular-nums"
      >
        {pad}
      </motion.span>
    </AnimatePresence>
  );
}

function CountdownBlock({ h, m, s }: { h: number; m: number; s: number }) {
  return (
    <div className="flex items-center gap-3">
      {[{ v: h, l: "HRS" }, { v: m, l: "MIN" }, { v: s, l: "SEC" }].map(({ v, l }, i) => (
        <span key={l} className="flex items-center gap-3">
          <span className="flex flex-col items-center">
            <span className="w-12 h-12 bg-wine-dark/8 border border-wine-dark/10 grid place-items-center overflow-hidden">
              <Digit value={v} />
            </span>
            <span className="text-[9px] tracking-[0.2em] text-wine-dark/40 mt-1">{l}</span>
          </span>
          {i < 2 && <span className="text-wine-dark/30 text-lg font-light -mt-4">:</span>}
        </span>
      ))}
    </div>
  );
}

/* section header */
function SectionHeader({ tag, title, href }: { tag: string; title: string; href: string }) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="text-display text-[10px] tracking-[0.4em] text-wine mb-2">{tag}</p>
        <h2 className="text-display text-3xl md:text-4xl text-wine-dark">{title}</h2>
      </div>
      <Link to={href} className="flex items-center gap-1.5 text-display text-[10px] tracking-[0.2em] text-wine-dark/50 hover:text-wine-dark transition-colors border-b border-transparent hover:border-wine-dark/30 pb-0.5">
        VIEW ALL <ArrowRight size={11} />
      </Link>
    </div>
  );
}

/* product slider */
function ProductSlider() {
  const { data: products = [] } = useProducts();
  const { add } = useCart();
  const wish = useWishlist();
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => ref.current?.scrollBy({ left: d * 280, behavior: "smooth" });

  // stable discount per product
  const discounts = useRef<Record<string, number>>({});
  products.forEach((p) => {
    if (!discounts.current[p.id]) discounts.current[p.id] = Math.floor(Math.random() * 25 + 10);
  });

  return (
    <div className="relative group/slider">
      {/* scroll arrows */}
      <button
        onClick={() => scroll(-1)}
        className="absolute -left-4 top-1/2 -translate-y-8 z-10 w-10 h-10 bg-cream border border-wine-dark/15 shadow-sm grid place-items-center hover:bg-wine-dark hover:text-cream transition-all opacity-0 group-hover/slider:opacity-100"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute -right-4 top-1/2 -translate-y-8 z-10 w-10 h-10 bg-cream border border-wine-dark/15 shadow-sm grid place-items-center hover:bg-wine-dark hover:text-cream transition-all opacity-0 group-hover/slider:opacity-100"
      >
        <ChevronRight size={16} />
      </button>

      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto pb-4"
        style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none" }}
      >
        {products.map((p) => {
          const disc = discounts.current[p.id] ?? 15;
          const original = Math.floor(p.price / (1 - disc / 100));
          return (
            <div
              key={p.id}
              className="flex-none w-52 lg:w-60 group"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-sand/40">
                <Link to="/product/$id" params={{ id: p.id }} className="block w-full h-full">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>

                {/* discount badge */}
                <span className="absolute top-3 left-3 bg-wine text-cream text-display text-[10px] tracking-wider px-2 py-1">
                  {disc}% OFF
                </span>

                {/* wishlist */}
                <button
                  onClick={() => { wish.toggle(p.id); toast.success(wish.has(p.id) ? "Removed" : "Saved"); }}
                  className={`absolute top-3 right-3 w-8 h-8 rounded-full grid place-items-center transition-all ${wish.has(p.id) ? "bg-wine-dark text-cream opacity-100" : "bg-white/80 text-wine-dark opacity-0 group-hover:opacity-100"}`}
                >
                  <Heart size={13} fill={wish.has(p.id) ? "currentColor" : "none"} />
                </button>

                {/* add to bag */}
                <button
                  onClick={() => { add(p, p.sizes[0], 1); toast.success(`${p.name} added`); }}
                  className="absolute bottom-0 inset-x-0 bg-wine-dark/95 text-cream py-3.5 text-display text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                >
                  <ShoppingBag size={12} /> ADD TO BAG
                </button>
              </div>

              {/* info */}
              <div className="mt-4 space-y-1">
                <Link to="/product/$id" params={{ id: p.id }}>
                  <p className="text-display text-sm text-wine-dark truncate hover:text-wine transition-colors">{p.name}</p>
                </Link>
                <p className="text-xs text-wine-dark/40 tracking-wider">{p.cat}</p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-wine font-semibold text-sm">Rs. {p.price.toLocaleString()}</span>
                  <span className="text-wine-dark/30 text-xs line-through">Rs. {original.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── PAGE ─────────────────────────── */
function Index() {
  const { h, m, s } = useCountdown(18);

  return (
    <div className="bg-cream">

      {/* HERO */}
      <HeroBannerSlider />

      {/* OFFERS STRIP */}
      <section className="border-b border-wine-dark/8">
        <div className="mx-auto max-w-7xl px-8 lg:px-16 grid grid-cols-2 md:grid-cols-4 divide-x divide-wine-dark/8">
          {offers.map((o, i) => (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 px-6 py-5"
            >
              <o.icon size={20} className="text-wine shrink-0" />
              <div>
                <p className="text-display text-xs tracking-wider text-wine-dark">{o.title}</p>
                <p className="text-[11px] text-wine-dark/50 mt-0.5">{o.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FLASH SALE */}
      <section className="py-20 px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <p className="text-display text-[10px] tracking-[0.4em] text-wine mb-2">— LIMITED TIME</p>
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-display text-3xl md:text-4xl text-wine-dark flex items-center gap-3">
                  <Zap size={22} className="text-wine fill-wine" /> FLASH SALE
                </h2>
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-wine-dark/30" />
                  <span className="text-[10px] text-wine-dark/40 tracking-widest">ENDS IN</span>
                  <CountdownBlock h={h} m={m} s={s} />
                </div>
              </div>
            </div>
            <Link to="/catalogue" className="text-display text-[10px] tracking-[0.2em] text-wine-dark/50 hover:text-wine-dark transition-colors border-b border-transparent hover:border-wine-dark/30 pb-0.5 flex items-center gap-1.5">
              SEE ALL DEALS <ArrowRight size={11} />
            </Link>
          </div>
          <ProductSlider />
        </div>
      </section>

      {/* BRAND MARQUEE */}
      <section className="py-10 overflow-hidden border-y border-wine-dark/8">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className="mx-12 text-display text-xl text-wine-dark/30 tracking-widest">{b}</span>
          ))}
        </div>
      </section>

      {/* SALE NOW */}
      <section className="py-20 px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeader tag="— SHOP BY CATEGORY" title="SALE NOW" href="/catalogue" />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {saleCategories.map((c, i) => (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Link to="/catalogue" className="group block">
                  <div className="relative aspect-[2/3] overflow-hidden bg-sand/30">
                    <img
                      src={c.img}
                      alt={c.label}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-0 right-0 text-center">
                      <span className="text-display text-white text-xl font-bold leading-none">{c.off}</span>
                      <span className="block text-white/70 text-[9px] tracking-widest">OFF</span>
                    </div>
                  </div>
                  <p className="mt-3 text-display text-[11px] tracking-[0.2em] text-wine-dark/70 group-hover:text-wine-dark transition-colors text-center">{c.label.toUpperCase()}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DUAL PROMO BANNERS */}
      <section className="px-8 lg:px-16 pb-20">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-5">
          {[
            { img: "https://images.unsplash.com/photo-1558171813-3e67c9bec8a4?w=900&q=85", tag: "WOMEN'S EDIT", title: "UP TO 50% OFF", to: "/catalogue" },
            { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85", tag: "MEN'S COLLECTION", title: "FRESH DROPS", to: "/catalogue" },
          ].map((b, i) => (
            <motion.div
              key={b.tag}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative h-64 overflow-hidden group"
            >
              <img src={b.img} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-black/10" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <p className="text-display text-[10px] tracking-[0.35em] text-sand/80 mb-2">{b.tag}</p>
                <h3 className="text-display text-3xl text-cream leading-tight mb-4">{b.title}</h3>
                <Link to={b.to} className="inline-flex items-center gap-2 text-cream text-display text-[10px] tracking-[0.2em] border-b border-cream/40 hover:border-cream pb-0.5 w-fit transition-colors">
                  SHOP NOW <ArrowRight size={10} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* APP BANNER */}
      <section className="mx-8 lg:mx-16 mb-20 bg-wine-dark text-cream overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-cream" style={{ width: i * 180 + 100, height: i * 180 + 100, top: "50%", left: "60%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <div className="relative grid lg:grid-cols-2 gap-12 items-center px-12 py-16">
          <div>
            <p className="text-display text-[10px] tracking-[0.4em] text-sand/70 mb-5">EXCLUSIVE APP OFFER</p>
            <h2 className="text-display text-4xl md:text-5xl leading-tight">
              GET EXTRA<br /><span className="text-sand">30% OFF</span><br />ON THE APP
            </h2>
            <p className="mt-6 text-cream/60 max-w-sm leading-relaxed text-sm">Early access, exclusive drops, and cashback on every order — only on the ZenWear app.</p>
            <div className="mt-8 flex gap-3 flex-wrap">
              {[{ icon: Smartphone, pre: "Download on the", label: "App Store" }, { icon: PlayCircle, pre: "GET IT ON", label: "Google Play" }].map((a) => (
                <a key={a.label} href="#" className="flex items-center gap-3 border border-cream/20 bg-cream/5 hover:bg-cream/15 px-5 py-3 transition-colors">
                  <a.icon size={22} className="text-cream/70 shrink-0" />
                  <div>
                    <div className="text-[9px] text-cream/50 tracking-wider">{a.pre}</div>
                    <div className="text-display text-sm">{a.label}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative max-w-xs mx-auto"
          >
            <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80" alt="App" className="mx-auto w-2/3 rounded-2xl shadow-2xl" />
          </motion.div>
        </div>
      </section>

    </div>
  );
}
