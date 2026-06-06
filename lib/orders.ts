import { api } from "./api";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export const STATUS_FLOW: OrderStatus[] = [
  "pending", "confirmed", "shipped", "out_for_delivery", "delivered",
];

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export type TrackingEvent = {
  status: OrderStatus;
  note: string;
  timestamp: string;
};

export type OrderItem = {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  size: string;
  quantity: number;
  unit_price: number;
};

export type Order = {
  id: string;
  user_id: string;
  user_email: string;
  full_name: string;
  phone: string;
  address_line: string;
  city: string;
  postal_code: string;
  country: string;
  notes?: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  tracking_note?: string;
  tracking_history?: TrackingEvent[];
  created_at: string;
  order_items?: OrderItem[];
};

type CreateOrderInput = Omit<Order, "id" | "status" | "tracking_note" | "created_at" | "order_items" | "user_id" | "user_email" | "tracking_history"> & {
  items: Omit<OrderItem, "id">[];
};

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  return api.post<Order>("/orders", input);
}

export async function getMyOrders(): Promise<Order[]> {
  return api.get<Order[]>("/orders");
}

export async function getOrder(id: string): Promise<Order> {
  return api.get<Order>(`/orders/${id}`);
}

export async function getAllOrders(): Promise<Order[]> {
  return api.get<Order[]>("/orders/all");
}

export async function updateOrderStatus(id: string, status: OrderStatus, tracking_note?: string): Promise<Order> {
  return api.patch<Order>(`/orders/${id}/status`, { status, tracking_note });
}
