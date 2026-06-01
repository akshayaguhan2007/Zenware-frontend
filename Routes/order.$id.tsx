import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Circle, Package, Truck, Home, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { STATUS_FLOW, STATUS_LABEL, type Order, type OrderStatus } from "@/lib/orders";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [{ title: "Order — FASHION" }] }),
  component: OrderPage,
});

const stepIcon: Record<string, any> = {
  pending: Circle,
  confirmed: CheckCircle2,
  shipped: Package,
  out_for_delivery: Truck,
  delivered: Home,
};

function OrderPage() {
  const { id } = Route.useParams();
  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as Order | null;
    },
  });

  // Live updates
  useEffect(() => {
    const ch = supabase
      .channel(`order-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` }, () => refetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [id, refetch]);

  if (isLoading) return <div className="py-32 grid place-items-center"><Loader2 className="animate-spin text-wine-dark" /></div>;
  if (!order) {
    return (
      <div className="py-32 text-center text-wine-dark">
        <p className="text-display text-2xl">Order not found</p>
        <Link to="/orders" className="mt-6 inline-block underline">Back to orders</Link>
      </div>
    );
  }

  const currentStep = order.status === "cancelled" ? -1 : STATUS_FLOW.indexOf(order.status as OrderStatus);

  return (
    <div className="bg-cream min-h-[70vh]">
      <div className="mx-auto max-w-5xl px-6 pt-10">
        <Link to="/orders" className="inline-flex items-center gap-2 text-wine-dark/70 hover:text-wine-dark text-sm">
          <ChevronLeft size={16} /> ALL ORDERS
        </Link>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 border border-wine-dark/10">
          <div className="flex flex-wrap gap-4 justify-between items-start">
            <div>
              <div className="text-xs text-wine-dark/50">ORDER #{order.id.slice(0, 8).toUpperCase()}</div>
              <h1 className="text-display text-3xl text-wine-dark mt-1">Rs. {Number(order.total).toLocaleString()}</h1>
              <div className="text-xs text-wine-dark/60 mt-1">Placed {new Date(order.created_at).toLocaleString()}</div>
            </div>
            <span className={`px-4 py-2 text-sm font-semibold rounded ${order.status === "cancelled" ? "bg-red-100 text-red-900" : "bg-wine-dark text-cream"}`}>
              {STATUS_LABEL[order.status as OrderStatus]}
            </span>
          </div>

          {/* Tracker */}
          {order.status !== "cancelled" && (
            <div className="mt-10">
              <div className="flex justify-between relative">
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-wine-dark/20" />
                <div
                  className="absolute top-5 left-5 h-0.5 bg-wine-dark transition-all duration-700"
                  style={{ width: `calc(${(currentStep / (STATUS_FLOW.length - 1)) * 100}% - ${currentStep === 0 ? 0 : 20}px)` }}
                />
                {STATUS_FLOW.map((s, i) => {
                  const Icon = stepIcon[s];
                  const done = i <= currentStep;
                  return (
                    <div key={s} className="relative flex flex-col items-center text-center w-20">
                      <div className={`w-10 h-10 rounded-full grid place-items-center border-2 ${done ? "bg-wine-dark text-cream border-wine-dark" : "bg-white text-wine-dark/40 border-wine-dark/20"}`}>
                        <Icon size={18} />
                      </div>
                      <div className={`mt-2 text-[10px] font-semibold ${done ? "text-wine-dark" : "text-wine-dark/40"}`}>
                        {STATUS_LABEL[s].toUpperCase()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {order.tracking_note && (
            <div className="mt-8 bg-sand/40 p-4 text-sm text-wine-dark">
              <span className="text-display tracking-wider text-xs">UPDATE: </span>{order.tracking_note}
            </div>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white p-6 border border-wine-dark/10">
            <h2 className="text-display text-lg text-wine-dark mb-4">SHIPPING TO</h2>
            <div className="text-sm text-wine-dark/80 space-y-1">
              <div>{order.full_name}</div>
              <div>{order.phone}</div>
              <div>{order.address_line}</div>
              <div>{order.city}, {order.postal_code}</div>
              <div>{order.country}</div>
            </div>
          </div>
          <div className="bg-white p-6 border border-wine-dark/10">
            <h2 className="text-display text-lg text-wine-dark mb-4">SUMMARY</h2>
            <div className="text-sm space-y-2 text-wine-dark/80">
              <div className="flex justify-between"><span>Subtotal</span><span>Rs. {Number(order.subtotal).toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{Number(order.shipping) === 0 ? "Free" : `Rs. ${order.shipping}`}</span></div>
              <div className="flex justify-between font-semibold text-wine-dark pt-2 border-t border-wine-dark/10"><span>Total</span><span>Rs. {Number(order.total).toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border border-wine-dark/10 mt-6">
          <h2 className="text-display text-lg text-wine-dark mb-4">ITEMS</h2>
          <div className="divide-y divide-wine-dark/10">
            {order.order_items?.map((it) => (
              <div key={it.id} className="py-4 flex gap-4 items-center">
                <img src={it.product_image} alt={it.product_name} className="w-16 h-20 object-cover" />
                <div className="flex-1">
                  <div className="text-wine-dark text-display">{it.product_name}</div>
                  <div className="text-xs text-wine-dark/60">{it.size} · ×{it.quantity}</div>
                </div>
                <div className="text-wine font-semibold">Rs. {(Number(it.unit_price) * it.quantity).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
