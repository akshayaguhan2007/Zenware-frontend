export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  title: string;
  body: string;
  created_at: string;
};

const KEY = "zenwear_reviews";

export function loadReviews(): Review[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? "[]"); } catch { return []; }
}

export function saveReviews(reviews: Review[]) {
  localStorage.setItem(KEY, JSON.stringify(reviews));
}

export function getProductReviews(productId: string): Review[] {
  return loadReviews()
    .filter((r) => r.product_id === productId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function addReview(review: Omit<Review, "id" | "created_at">): Review {
  const newReview: Review = {
    ...review,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  };
  saveReviews([newReview, ...loadReviews()]);
  return newReview;
}

export function getUserReview(productId: string, userId: string): Review | null {
  return loadReviews().find((r) => r.product_id === productId && r.user_id === userId) ?? null;
}

export function getAverageRating(productId: string): { avg: number; count: number } {
  const reviews = getProductReviews(productId);
  if (reviews.length === 0) return { avg: 0, count: 0 };
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return { avg: Math.round(avg * 10) / 10, count: reviews.length };
}

export function deleteReview(id: string) {
  saveReviews(loadReviews().filter((r) => r.id !== id));
}
