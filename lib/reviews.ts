import { api } from "./api";

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

export async function getProductReviews(productId: string): Promise<{ reviews: Review[]; avg: number; count: number }> {
  return api.get(`/reviews/${productId}`);
}

export async function addReview(productId: string, data: { rating: number; title: string; body: string }): Promise<Review> {
  return api.post(`/reviews/${productId}`, data);
}

export async function deleteReview(id: string): Promise<void> {
  return api.delete(`/reviews/${id}`);
}
