import { supabase } from "@/integrations/supabase/client";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export const STATUS_FLOW: OrderStatus[] = [
  "pending",
  "confirmed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export const STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
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
  created_at: string;
  order_items?: OrderItem[];
};

type CreateOrderInput = Omit<Order, "id" | "status" | "tracking_note" | "created_at" | "order_items"> & {
  items: Omit<OrderItem, "id">[];
};

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { items, ...orderData } = input;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({ ...orderData, status: "pending" })
    .select()
    .single();

  if (error) throw new Error(error.message);

  const orderItems = items.map((it) => ({ ...it, order_id: order.id }));
  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw new Error(itemsError.message);

  return order as Order;
}
