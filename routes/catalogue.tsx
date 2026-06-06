import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShoppingBag, Heart, Loader2, Search, ScanLine, X, Upload, ImageOff, Star } from "lucide-react";
import { toast } from "sonner";
import { useProducts, type Product } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { getProductReviews } from "@/lib/reviews";

export const Route = createFileRoute("/catalogue")({
  head: () => ({
    meta: [
      { title: "Catalogue — FASHION" },
      { name: "description", content: "Browse the full FASHION catalogue." },
    ],
  }),
  component: Catalogue,
});

/* ── small rating for catalogue card ── */
function ProductRating({ productId }: { productId: string }) {
  const { data } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => getProductReviews(productId),
    staleTime: 60_000,
  });
  if (!data || data.count === 0) return <span className="text-xs text-wine-dark/30">No reviews</span>;
  return (
    <span className="flex items-center gap-1">
      <Star size={11} fill="#6D2932" stroke="#6D2932" />
      <span className="text-xs text-wine-dark/60">{data.avg} ({data.count})</span>
    </span>
  );
}
function getImageFingerprint(img: HTMLImageElement): number[] {
  const SIZE = 16;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, SIZE, SIZE);
  const data = ctx.getImageData(0, 0, SIZE, SIZE).data;
  const fp: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    fp.push(data[i], data[i + 1], data[i + 2]);
  }
  return fp;
}

/* ── load a URL into an Image element ── */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = src;
  });
}

/* ── compare two fingerprints (lower = more similar) ── */
function fingerprintDistance(a: number[], b: number[]): number {
  if (a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

/* ── colour helpers for fallback ── */
function extractDominantColors(img: HTMLImageElement): string[] {
  const canvas = document.createElement("canvas");
  canvas.width = 50; canvas.height = 50;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, 50, 50);
  const data = ctx.getImageData(0, 0, 50, 50).data;
  const buckets: Record<string, number> = {};
  for (let i = 0; i < data.length; i += 16) {
    const r = Math.round(data[i] / 48) * 48;
    const g = Math.round(data[i + 1] / 48) * 48;
    const b = Math.round(data[i + 2] / 48) * 48;
    const key = `${r},${g},${b}`;
    buckets[key] = (buckets[key] ?? 0) + 1;
  }
  return Object.entries(buckets).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => k);
}

function colorDistance(c1: number[], c2: number[]): number {
  return Math.sqrt((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2 + (c1[2]-c2[2])**2);
}

const COLOR_KEYWORDS: { rgb: number[]; keywords: string[] }[] = [
  { rgb: [20, 20, 20],    keywords: ["black", "dark", "night", "structured"] },
  { rgb: [240, 235, 220], keywords: ["white", "cream", "light", "ecru", "ivory"] },
  { rgb: [160, 155, 150], keywords: ["grey", "gray", "ash", "charcoal", "silver"] },
  { rgb: [86, 28, 36],    keywords: ["wine", "burgundy", "maroon", "red", "classic"] },
  { rgb: [139, 90, 43],   keywords: ["brown", "tan", "camel", "cocoa", "suede", "leather"] },
  { rgb: [199, 183, 163], keywords: ["sand", "beige", "oatmeal", "natural", "linen", "knit"] },
  { rgb: [30, 60, 130],   keywords: ["blue", "navy", "denim", "indigo"] },
  { rgb: [40, 90, 40],    keywords: ["green", "olive", "khaki", "forest"] },
  { rgb: [200, 100, 30],  keywords: ["orange", "amber", "rust", "warm"] },
  { rgb: [220, 160, 170], keywords: ["pink", "blush", "rose", "soft"] },
  { rgb: [100, 40, 120],  keywords: ["purple", "plum", "violet"] },
  { rgb: [210, 200, 180], keywords: ["neutral", "minimal", "linen", "trench", "coat"] },
];

function getKeywordsFromColors(colors: string[]): string[] {
  const keywords = new Set<string>();
  colors.forEach((c) => {
    const [r, g, b] = c.split(",").map(Number);
    let best = { dist: Infinity, keywords: [] as string[] };
    COLOR_KEYWORDS.forEach((ck) => {
      const d = colorDistance([r, g, b], ck.rgb);
      if (d < best.dist) best = { dist: d, keywords: ck.keywords };
    });
    if (best.dist < 200) best.keywords.forEach((k) => keywords.add(k));
  });
  return Array.from(keywords);
}

function scoreProduct(product: Product, keywords: string[]): number {
  const text = `${product.name} ${product.cat} ${product.description}`.toLowerCase();
  return keywords.reduce((score, kw) => score + (text.includes(kw) ? 2 : 0), 0);
}

/* ── MAIN visual search: fingerprint-first, colour-fallback ── */
async function visualSearch(products: Product[], uploadedImg: HTMLImageElement): Promise<Product[]> {
  const uploadedFP = getImageFingerprint(uploadedImg);

  // load all product images and compare fingerprints
  const scored = await Promise.all(
    products.map(async (p) => {
      try {
        const prodImg = await loadImage(p.img);
        const prodFP = getImageFingerprint(prodImg);
        const dist = fingerprintDistance(uploadedFP, prodFP);
        return { product: p, dist, score: 0 };
      } catch {
        return { product: p, dist: Infinity, score: 0 };
      }
    })
  );

  // find best fingerprint match
  const best = Math.min(...scored.map((s) => s.dist));

  // exact or near-identical image
  if (best < 12) {
    return scored
      .filter((s) => s.dist < 12)
      .sort((a, b) => a.dist - b.dist)
      .map((s) => s.product);
  }

  // visually similar image (same photo, slightly different crop/size)
  if (best < 28) {
    return scored
      .filter((s) => s.dist < 28)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 3)
      .map((s) => s.product);
  }

  // nothing close enough — return empty (not found)
  return [];
}

/* ── main component ── */
function Catalogue() {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"new" | "low" | "high">("new");
  const { data: products = [], isLoading } = useProducts();
  const { add } = useCart();
  const wish = useWishlist();

  // lens state
  const [lensOpen, setLensOpen] = useState(false);
  const [lensImg, setLensImg] = useState<string | null>(null);
  const [lensResults, setLensResults] = useState<Product[] | null>(null);
  const [lensScanning, setLensScanning] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.cat)))];

  const filtered = useMemo(() => {
    // if lens results active, show those
    if (lensResults !== null) return lensResults;
    let list = filter === "All" ? products : products.filter((p) => p.cat === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q));
    }
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [products, filter, query, sort, lensResults]);

  const processImage = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) { toast.error("Please upload an image file."); return; }
    const url = URL.createObjectURL(file);
    setLensImg(url);
    setLensScanning(true);
    setLensResults(null);
    const img = new Image();
    img.onload = async () => {
      const results = await visualSearch(products, img);
      setLensResults(results);
      setLensScanning(false);
      setLensOpen(false);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [products]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImage(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImage(file);
  };

  const clearLens = () => {
    setLensResults(null);
    setLensImg(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div>
      <section className="bg-sand py-20 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-display text-6xl md:text-8xl text-wine-dark">
            CATA<span className="brush-highlight">LOGUE</span>
          </motion.h1>
          <p className="mt-6 text-wine-dark/80 text-lg max-w-2xl">
            Curated pieces for the modern wardrobe. Tap to explore, hover to add.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="mx-auto max-w-7xl">

          {/* filters + search bar */}
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-10">
            <div className="flex gap-3 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => { setFilter(c); clearLens(); }}
                  className={`px-5 py-2 text-display text-sm tracking-wider transition-colors ${
                    filter === c && !lensResults ? "bg-wine-dark text-cream" : "bg-cream text-wine-dark hover:bg-sand"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              {/* text search */}
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-wine-dark/50" />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); clearLens(); }}
                  placeholder="Search pieces"
                  className="pl-9 pr-3 py-2 bg-cream border border-wine-dark/20 text-wine-dark text-sm w-56 focus:outline-none focus:border-wine-dark"
                />
              </div>

              {/* LENS BUTTON */}
              <button
                onClick={() => setLensOpen(true)}
                title="Search by image"
                className={`relative w-10 h-10 grid place-items-center border transition-colors ${
                  lensResults !== null
                    ? "bg-wine-dark text-cream border-wine-dark"
                    : "bg-cream border-wine-dark/20 text-wine-dark/60 hover:border-wine-dark hover:text-wine-dark"
                }`}
              >
                <ScanLine size={18} />
                {lensResults !== null && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-wine text-cream text-[9px] rounded-full grid place-items-center font-bold">
                    {lensResults.length}
                  </span>
                )}
              </button>

              {/* clear lens */}
              {lensResults !== null && (
                <button onClick={clearLens} className="w-10 h-10 grid place-items-center border border-wine-dark/20 text-wine-dark/60 hover:border-wine-dark hover:text-wine-dark bg-cream transition-colors" title="Clear image search">
                  <X size={16} />
                </button>
              )}

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

          {/* lens active banner */}
          <AnimatePresence>
            {lensResults !== null && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 mb-8 px-5 py-3 bg-wine-dark/5 border border-wine-dark/15"
              >
                <ScanLine size={16} className="text-wine shrink-0" />
                <p className="text-sm text-wine-dark">
                  {lensResults.length > 0
                    ? <><span className="text-display">{lensResults.length} piece{lensResults.length !== 1 ? "s" : ""}</span> matched your image</>
                    : <span className="text-display">No matching pieces found</span>
                  }
                </p>
                <button onClick={clearLens} className="ml-auto text-xs text-wine-dark/50 hover:text-wine-dark underline">Clear</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* product grid */}
          {isLoading ? (
            <div className="py-24 grid place-items-center text-wine-dark/60">
              <Loader2 className="animate-spin" size={36} />
            </div>
          ) : filtered.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 flex flex-col items-center gap-4 text-wine-dark/60">
              <ImageOff size={48} className="text-wine-dark/20" />
              <p className="text-display text-2xl text-wine-dark">No pieces found.</p>
              <p className="text-sm">We don't carry that yet — but watch this space.</p>
              {lensResults !== null && (
                <button onClick={clearLens} className="mt-2 bg-wine-dark text-cream px-6 py-3 text-display text-sm tracking-wider hover:bg-wine transition-colors">
                  BROWSE ALL
                </button>
              )}
            </motion.div>
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
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    </Link>
                    <button
                      onClick={(e) => { e.preventDefault(); wish.toggle(p.id); toast.success(wish.has(p.id) ? "Removed from favourites" : "Added to favourites"); }}
                      className={`absolute top-4 right-4 w-10 h-10 grid place-items-center rounded-full transition-all ${
                        wish.has(p.id) ? "bg-wine-dark text-cream" : "bg-cream/90 text-wine-dark opacity-0 group-hover:opacity-100 hover:bg-wine-dark hover:text-cream"
                      }`}
                      aria-label="Save"
                    >
                      <Heart size={18} fill={wish.has(p.id) ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); add(p, p.sizes[0], 1); toast.success(`${p.name} added to bag`); }}
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
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-muted-foreground text-sm">{p.cat}</p>
                      <ProductRating productId={p.id} />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LENS MODAL */}
      <AnimatePresence>
        {lensOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-wine-dark/70 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={() => setLensOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cream w-full max-w-lg"
            >
              {/* modal header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-wine-dark/10">
                <div className="flex items-center gap-3">
                  <ScanLine size={20} className="text-wine" />
                  <div>
                    <p className="text-display text-lg text-wine-dark leading-none">Visual Search</p>
                    <p className="text-xs text-wine-dark/50 mt-0.5">Upload an image to find matching pieces</p>
                  </div>
                </div>
                <button onClick={() => setLensOpen(false)} className="text-wine-dark/40 hover:text-wine-dark transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* drop zone */}
              <div className="p-6">
                {lensScanning ? (
                  <div className="h-52 flex flex-col items-center justify-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-2 border-wine-dark/20 border-t-wine-dark rounded-full"
                    />
                    <div className="text-center">
                      <p className="text-display text-wine-dark">Scanning image…</p>
                      <p className="text-xs text-wine-dark/50 mt-1">Analysing colours and patterns</p>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    onClick={() => fileRef.current?.click()}
                    className={`relative h-52 flex flex-col items-center justify-center gap-4 border-2 border-dashed cursor-pointer transition-all ${
                      dragOver ? "border-wine-dark bg-sand/30" : "border-wine-dark/20 hover:border-wine-dark hover:bg-sand/10"
                    }`}
                  >
                    <motion.div animate={{ y: dragOver ? -4 : 0 }} transition={{ type: "spring", stiffness: 300 }}>
                      <Upload size={32} className="text-wine-dark/30" />
                    </motion.div>
                    <div className="text-center px-4">
                      <p className="text-display text-wine-dark">Drop your image here</p>
                      <p className="text-xs text-wine-dark/50 mt-1">or click to browse — JPG, PNG, WEBP</p>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" onChange={onFileChange} className="hidden" />
                  </div>
                )}

                {/* how it works */}
                {!lensScanning && (
                  <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                    {[
                      { step: "01", label: "Upload any fashion image" },
                      { step: "02", label: "We analyse colours & style" },
                      { step: "03", label: "See matching pieces" },
                    ].map((s) => (
                      <div key={s.step} className="bg-sand/30 px-3 py-3">
                        <p className="text-display text-xs text-wine">{s.step}</p>
                        <p className="text-xs text-wine-dark/60 mt-1 leading-tight">{s.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
