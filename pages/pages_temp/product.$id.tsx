import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ShoppingBag, Heart, Truck, RotateCcw, Shield,
  ChevronLeft, Minus, Plus, Loader2, Star, Pencil, Trash2, Check,
} from "lucide-react";
import { toast } from "sonner";
import { useProduct, useProducts } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import {
  getProductReviews, addReview, getUserReview,
  deleteReview, getAverageRating, type Review,
} from "@/lib/reviews";

export const Route = createFileRoute("/product/$id")({
  head: () => ({ meta: [{ title: "Product — ZenWear" }] }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="py-32 text-center text-wine-dark">
      <p className="text-display text-2xl">Piece not found</p>
      <Link to="/catalogue" className="mt-6 inline-block underline">Back to catalogue</Link>
    </div>
  ),
});

/* ── star renderer ── */
function Stars({ rating, size = 16, interactive = false, onChange }: {
  rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void;
}) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            size={size}
            className="transition-colors"
            fill={(hover || rating) >= s ? "#6D2932" : "none"}
            stroke={(hover || rating) >= s ? "#6D2932" : "#C7B7A3"}
          />
        </button>
      ))}
    </div>
  );
}

/* ── rating bar ── */
function RatingBar({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="flex items-center gap-3 text-xs text-wine-dark/60">
      <span className="w-4 text-right">{label}</span>
      <Star size={10} fill="#6D2932" stroke="#6D2932" />
      <div className="flex-1 h-1.5 bg-sand/60 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
          className="h-full bg-wine rounded-full"
        />
      </div>
      <span className="w-6">{Math.round(pct)}%</span>
    </div>
  );
}

function ProductPage() {
  const { id } = Route.useParams();
  const { data: p, isLoading } = useProduct(id);
  const { data: all = [] } = useProducts();
  const [size, setSize] = useState("");
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const wish = useWishlist();
  const navigate = useNavigate();
  const { user } = useAuth();

  // reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgData, setAvgData] = useState({ avg: 0, count: 0 });
  const [showForm, setShowForm] = useState(false);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [form, setForm] = useState({ rating: 0, title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);

  const refreshReviews = () => {
    setReviews(getProductReviews(id));
    setAvgData(getAverageRating(id));
    if (user) setMyReview(getUserReview(id, user.id));
  };

  useEffect(() => { refreshReviews(); }, [id, user]);

  if (isLoading) return <div className="py-32 grid place-items-center"><Loader2 className="animate-spin text-wine-dark" size={36} /></div>;
  if (!p) return (
    <div className="py-32 text-center text-wine-dark">
      <p className="text-display text-2xl">Piece not found</p>
      <Link to="/catalogue" className="mt-6 inline-block underline">Back to catalogue</Link>
    </div>
  );

  const currentSize = size || p.sizes[0];
  const related = all.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 3);

  // rating distribution
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: reviews.length ? (reviews.filter((r) => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Sign in to leave a review"); return; }
    if (form.rating === 0) { toast.error("Please select a rating"); return; }
    setSubmitting(true);
    addReview({
      product_id: id,
      user_id: user.id,
      user_name: user.name || user.email,
      rating: form.rating,
      title: form.title,
      body: form.body,
    });
    setForm({ rating: 0, title: "", body: "" });
    setShowForm(false);
    refreshReviews();
    toast.success("Review submitted!");
    setSubmitting(false);
  };

  const handleDelete = (reviewId: string) => {
    deleteReview(reviewId);
    refreshReviews();
    toast.success("Review removed");
  };

  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 pt-8">
        <Link to="/catalogue" className="inline-flex items-center gap-2 text-wine-dark/70 hover:text-wine-dark text-sm tracking-wider">
          <ChevronLeft size={16} /> CATALOGUE
        </Link>
      </div>

      {/* ── PRODUCT DETAIL ── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-10 grid lg:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative aspect-[3/4] overflow-hidden bg-sand">
          <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
          <span className="absolute top-4 left-4 bg-wine-dark text-cream px-3 py-1 text-xs tracking-wider text-display">{p.cat.toUpperCase()}</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
          <h1 className="text-display text-4xl md:text-5xl text-wine-dark leading-tight">{p.name}</h1>

          {/* inline rating summary */}
          <div className="mt-3 flex items-center gap-3">
            <Stars rating={Math.round(avgData.avg)} size={16} />
            {avgData.count > 0 ? (
              <span className="text-sm text-wine-dark/60">
                <span className="text-wine-dark font-semibold">{avgData.avg}</span> / 5 &nbsp;·&nbsp; {avgData.count} review{avgData.count !== 1 ? "s" : ""}
              </span>
            ) : (
              <span className="text-sm text-wine-dark/40">No reviews yet</span>
            )}
          </div>

          <p className="mt-3 text-2xl text-wine font-semibold">Rs. {p.price.toLocaleString()}</p>
          <p className="mt-6 text-wine-dark/80 leading-relaxed">{p.description}</p>

          {/* size */}
          <div className="mt-8">
            <p className="text-display text-sm tracking-wider text-wine-dark mb-3">SIZE</p>
            <div className="flex gap-2 flex-wrap">
              {p.sizes.map((s) => (
                <button key={s} onClick={() => setSize(s)} className={`min-w-12 px-4 py-2 border text-display text-sm transition-colors ${currentSize === s ? "bg-wine-dark text-cream border-wine-dark" : "bg-cream text-wine-dark border-wine-dark/30 hover:border-wine-dark"}`}>{s}</button>
              ))}
            </div>
          </div>

          {/* qty */}
          <div className="mt-6">
            <p className="text-display text-sm tracking-wider text-wine-dark mb-3">QUANTITY</p>
            <div className="inline-flex items-center border border-wine-dark/30">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 grid place-items-center hover:bg-sand text-wine-dark"><Minus size={16} /></button>
              <span className="w-10 text-center text-wine-dark font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-10 h-10 grid place-items-center hover:bg-sand text-wine-dark"><Plus size={16} /></button>
            </div>
          </div>

          {/* actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <button onClick={() => { add(p, currentSize, qty); toast.success(`${p.name} added to bag`); navigate({ to: "/cart" }); }} className="flex-1 bg-wine-dark text-cream py-4 text-display tracking-wider hover:bg-wine transition-colors flex items-center justify-center gap-2">
              <ShoppingBag size={18} /> ADD TO BAG
            </button>
            <button onClick={() => { wish.toggle(p.id); toast.success(wish.has(p.id) ? "Removed from favourites" : "Saved to favourites"); }} className={`w-14 h-14 grid place-items-center border transition-colors ${wish.has(p.id) ? "bg-wine-dark text-cream border-wine-dark" : "border-wine-dark/30 text-wine-dark hover:bg-sand"}`} aria-label="Save">
              <Heart size={18} fill={wish.has(p.id) ? "currentColor" : "none"} />
            </button>
          </div>

          {/* trust */}
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-wine-dark/10 pt-6">
            {[{ icon: Truck, t: "Free shipping", s: "Above Rs. 2,000" }, { icon: RotateCcw, t: "Easy returns", s: "Within 14 days" }, { icon: Shield, t: "Secure pay", s: "Protected checkout" }].map(({ icon: Icon, t, s }) => (
              <div key={t} className="text-center">
                <Icon className="mx-auto text-wine-dark mb-2" size={22} />
                <p className="text-display text-xs tracking-wider text-wine-dark">{t}</p>
                <p className="text-xs text-wine-dark/60">{s}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── RATINGS & REVIEWS ── */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-16 border-t border-wine-dark/10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-12">

          {/* LEFT — summary */}
          <div>
            <h2 className="text-display text-2xl text-wine-dark mb-6">RATINGS &<br />REVIEWS</h2>
            {avgData.count > 0 ? (
              <>
                <div className="flex items-end gap-3 mb-4">
                  <span className="text-display text-6xl text-wine-dark leading-none">{avgData.avg}</span>
                  <div className="pb-1">
                    <Stars rating={Math.round(avgData.avg)} size={18} />
                    <p className="text-xs text-wine-dark/50 mt-1">{avgData.count} review{avgData.count !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  {dist.map((d) => <RatingBar key={d.star} label={String(d.star)} pct={d.pct} />)}
                </div>
              </>
            ) : (
              <div className="mb-6">
                <p className="text-display text-5xl text-wine-dark/20 leading-none mb-2">—</p>
                <p className="text-wine-dark/50 text-sm">Be the first to review this piece.</p>
              </div>
            )}

            {/* write review button */}
            {user ? (
              myReview ? (
                <p className="text-xs text-wine-dark/50 flex items-center gap-1.5"><Check size={13} className="text-green-500" /> You've reviewed this piece</p>
              ) : (
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-wine-dark text-cream px-5 py-3 text-display text-xs tracking-widest hover:bg-wine transition-colors">
                  <Pencil size={13} /> WRITE A REVIEW
                </button>
              )
            ) : (
              <Link to="/login" className="flex items-center gap-2 border border-wine-dark/20 text-wine-dark px-5 py-3 text-display text-xs tracking-widest hover:bg-sand transition-colors">
                SIGN IN TO REVIEW
              </Link>
            )}
          </div>

          {/* RIGHT — form + list */}
          <div className="space-y-6">

            {/* review form */}
            <AnimatePresence>
              {showForm && (
                <motion.form
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={submitReview}
                  className="bg-white border border-wine-dark/10 p-6 space-y-4"
                >
                  <h3 className="text-display text-lg text-wine-dark">YOUR REVIEW</h3>

                  {/* star picker */}
                  <div>
                    <label className="block text-display text-xs tracking-widest text-wine-dark/50 mb-2">RATING *</label>
                    <Stars rating={form.rating} size={28} interactive onChange={(r) => setForm({ ...form, rating: r })} />
                  </div>

                  {/* title */}
                  <div>
                    <label className="block text-display text-xs tracking-widest text-wine-dark/50 mb-2">HEADLINE</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Summarise your experience"
                      className="w-full border-b border-wine-dark/20 py-2 bg-transparent focus:outline-none focus:border-wine-dark text-wine-dark placeholder-wine-dark/30 text-sm"
                    />
                  </div>

                  {/* body */}
                  <div>
                    <label className="block text-display text-xs tracking-widest text-wine-dark/50 mb-2">REVIEW *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      placeholder="Tell others what you think about this piece…"
                      className="w-full border-b border-wine-dark/20 py-2 bg-transparent focus:outline-none focus:border-wine-dark text-wine-dark placeholder-wine-dark/30 text-sm resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button type="submit" disabled={submitting} className="bg-wine-dark text-cream px-6 py-3 text-display text-xs tracking-widest hover:bg-wine transition-colors disabled:opacity-60">
                      {submitting ? <Loader2 size={14} className="animate-spin" /> : "SUBMIT"}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-display text-xs tracking-widest text-wine-dark/60 hover:text-wine-dark border border-wine-dark/20 hover:border-wine-dark transition-colors">
                      CANCEL
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* review list */}
            {reviews.length === 0 ? (
              <div className="py-12 text-center text-wine-dark/40 border border-dashed border-wine-dark/15">
                <Star size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-display text-lg">No reviews yet</p>
                <p className="text-sm mt-1">Be the first to share your thoughts.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border border-wine-dark/10 p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* avatar */}
                        <div className="w-9 h-9 rounded-full bg-wine-dark text-cream grid place-items-center text-display text-sm shrink-0">
                          {r.user_name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-wine-dark">{r.user_name}</p>
                          <p className="text-xs text-wine-dark/40">{new Date(r.created_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Stars rating={r.rating} size={14} />
                        {user?.id === r.user_id && (
                          <button onClick={() => handleDelete(r.id)} className="text-wine-dark/30 hover:text-red-400 transition-colors" aria-label="Delete review">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    {r.title && <p className="mt-3 text-display text-sm text-wine-dark">{r.title}</p>}
                    <p className="mt-2 text-sm text-wine-dark/70 leading-relaxed">{r.body}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── RELATED ── */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 lg:px-10 py-20 border-t border-wine-dark/10">
          <h2 className="text-display text-3xl text-wine-dark mb-8">YOU MAY <span className="brush-highlight">ALSO LOVE</span></h2>
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
