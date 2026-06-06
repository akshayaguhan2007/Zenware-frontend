import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Loader2, CheckCircle2, Circle, Package,
  Truck, Home, ChevronLeft, Clock, XCircle,
} from "lucide-react";
import { getOrder, STATUS_FLOW, STATUS_LABEL, type Order, type OrderStatus } from "@/lib/orders";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [{ title: "Order — FASHION" }] }),
  component: OrderPage,
});

const stepIcon: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle2,
  shipped: Package,
  out_for_delivery: Truck,
  delivered: Home,
};

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function OrderPage() {
  const { id } = Route.useParams();

  // poll every 5 seconds so admin updates reflect immediately
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(id),
    refetchInterval: 5000,
  });

  if (isLoading) return <div className="py-32 grid place-items-center"><Loader2 className="animate-spin text-wine-dark" /></div>;
  if (!order) {
    return (
      <div className="py-32 text-center text-wine-dark">
        <p className="text-display text-2xl">Order not found</p>
        <Link to="/orders" className="mt-6 inline-block underline">Back to orders</Link>
      </div>
    );
  }

  const isCancelled = order.status === "cancelled";
  const currentStep = isCancelled ? -1 : STATUS_FLOW.indexOf(order.status as OrderStatus);

  return (
    <div className="bg-cream min-h-[70vh]">
      <div className="mx-auto max-w-5xl px-6 pt-10">
        <Link to="/orders" className="inline-flex items-center gap-2 text-wine-dark/70 hover:text-wine-dark text-sm">
          <ChevronLeft size={16} /> ALL ORDERS
        </Link>
      </div>

      <section className="mx-auto max-w-5xl px-6 py-10 space-y-6">

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 border border-wine-dark/10">
          <div className="flex flex-wrap gap-4 justify-between items-start">
            <div>
              <div className="text-xs text-wine-dark/50 tracking-widest">ORDER #{order.id.slice(0, 8).toUpperCase()}</div>
              <h1 className="text-display text-3xl text-wine-dark mt-1">Rs. {Number(order.total).toLocaleString()}</h1>
              <div className="text-xs text-wine-dark/50 mt-1">Placed {new Date(order.created_at).toLocaleString()}</div>
            </div>
            <span className={`px-4 py-2 text-xs font-bold tracking-widest uppercase rounded ${statusColor[order.status]}`}>
              {isCancelled && <XCircle size={12} className="inline mr-1 -mt-0.5" />}
              {STATUS_LABEL[order.status]}
            </span>
          </div>

          {/* ── STEP TRACKER ── */}
          {!isCancelled && (
            <div className="mt-10 overflow-x-auto">
              <div className="flex justify-between relative min-w-[400px]">
                {/* base line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-wine-dark/10" />
                {/* progress line */}
                <motion.div
                  className="absolute top-5 left-5 h-0.5 bg-wine-dark"
                  initial={{ width: 0 }}
                  animate={{ width: currentStep <= 0 ? 0 : `calc(${(currentStep / (STATUS_FLOW.length - 1)) * 100}% - 20px)` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                {STATUS_FLOW.map((s, i) => {
                  const Icon = stepIcon[s];
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={s} className="relative flex flex-col items-center text-center w-20 z-10">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: active ? 1.15 : 1 }}
                        transition={{ duration: 0.3 }}
                        className={`w-10 h-10 rounded-full grid place-items-center border-2 transition-all ${
                          done
                            ? "bg-wine-dark text-cream border-wine-dark shadow-md"
                            : "bg-white text-wine-dark/30 border-wine-dark/15"
                        }`}
                      >
                        <Icon size={16} />
                      </motion.div>
                      <div className={`mt-2 text-[10px] font-semibold leading-tight ${done ? "text-wine-dark" : "text-wine-dark/30"}`}>
                        {STATUS_LABEL[s].toUpperCase()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* cancelled message */}
          {isCancelled && (
            <div className="mt-6 bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-center gap-2">
              <XCircle size={16} className="shrink-0" />
              This order has been cancelled.
              {order.tracking_note && <span className="ml-1">— {order.tracking_note}</span>}
            </div>
          )}
        </motion.div>

        {/* ── TRACKING TIMELINE ── */}
        {order.tracking_history && order.tracking_history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 border border-wine-dark/10"
          >
            <h2 className="text-display text-lg text-wine-dark mb-6">TRACKING HISTORY</h2>
            <div className="relative">
              {/* vertical line */}
              <div className="absolute left-4 top-2 bottom-2 w-px bg-wine-dark/10" />
              <div className="space-y-6">
                {[...order.tracking_history].reverse().map((event, i) => {
                  const Icon = stepIcon[event.status] ?? Circle;
                  const isLatest = i === 0;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex gap-5 pl-1"
                    >
                      <div className={`relative z-10 w-8 h-8 rounded-full grid place-items-center shrink-0 ${isLatest ? "bg-wine-dark text-cream" : "bg-sand/60 text-wine-dark/60"}`}>
                        <Icon size={14} />
                      </div>
                      <div className="pt-0.5 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={`text-display text-sm tracking-wider ${isLatest ? "text-wine-dark" : "text-wine-dark/60"}`}>
                            {STATUS_LABEL[event.status]}
                          </span>
                          {isLatest && (
                            <span className="px-2 py-0.5 bg-wine-dark text-cream text-[10px] tracking-widest">CURRENT</span>
                          )}
                        </div>
                        {event.note && event.note !== STATUS_LABEL[event.status] && (
                          <p className="text-sm text-wine-dark/60 mt-1">{event.note}</p>
                        )}
                        <p className="text-xs text-wine-dark/40 mt-1">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── SHIPPING + SUMMARY ── */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 border border-wine-dark/10">
            <h2 className="text-display text-lg text-wine-dark mb-4">SHIPPING TO</h2>
            <div className="text-sm text-wine-dark/80 space-y-1">
              <div className="font-medium">{order.full_name}</div>
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
              <div className="flex justify-between font-semibold text-wine-dark pt-2 border-t border-wine-dark/10">
                <span>Total</span><span>Rs. {Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── ITEMS ── */}
        <div className="bg-white p-6 border border-wine-dark/10">
          <h2 className="text-display text-lg text-wine-dark mb-4">ITEMS</h2>
          <div className="divide-y divide-wine-dark/10">
            {order.order_items?.map((it) => (
              <div key={it.id} className="py-4 flex gap-4 items-center">
                <img src={it.product_image} alt={it.product_name} className="w-16 h-20 object-cover" />
                <div className="flex-1">
                  <div className="text-wine-dark text-display">{it.product_name}</div>
                  <div className="text-xs text-wine-dark/60 mt-0.5">{it.size} · ×{it.quantity}</div>
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
