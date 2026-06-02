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

type CreateOrderInput = Omit<Order, "id" | "status" | "tracking_note" | "created_at" | "order_items"> & {
  items: Omit<OrderItem, "id">[];
};

const ORDERS_KEY = "fashion_orders";

export function loadOrders(): Order[] {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "[]"); } catch { return []; }
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const { items, ...orderData } = input;
  const now = new Date().toISOString();
  const order: Order = {
    ...orderData,
    id: crypto.randomUUID(),
    status: "pending",
    created_at: now,
    tracking_history: [{ status: "pending", note: "Order placed successfully.", timestamp: now }],
    order_items: items.map((it) => ({ ...it, id: crypto.randomUUID() })),
  };
  saveOrders([order, ...loadOrders()]);
  return order;
}

export function updateOrderStatus(id: string, status: OrderStatus, tracking_note?: string) {
  const note = tracking_note?.trim() || STATUS_LABEL[status];
  const event: TrackingEvent = { status, note, timestamp: new Date().toISOString() };
  const orders = loadOrders().map((o) =>
    o.id === id
      ? {
          ...o,
          status,
          tracking_note: note,
          tracking_history: [...(o.tracking_history ?? []), event],
        }
      : o
  );
  saveOrders(orders);
}
