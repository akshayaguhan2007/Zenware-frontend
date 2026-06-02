import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Package, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { loadOrders, STATUS_LABEL, type Order } from "@/lib/orders";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Orders — FASHION" }] }),
  component: OrdersPage,
});

const statusColor: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-900",
  confirmed: "bg-blue-100 text-blue-900",
  shipped: "bg-purple-100 text-purple-900",
  out_for_delivery: "bg-orange-100 text-orange-900",
  delivered: "bg-green-100 text-green-900",
  cancelled: "bg-red-100 text-red-900",
};

function OrdersPage() {
  const { user, loading } = useAuth();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => loadOrders().filter((o) => o.user_id === user?.id),
    enabled: !!user,
  });

  if (loading) return <div className="py-32 grid place-items-center"><Loader2 className="animate-spin text-wine-dark" /></div>;
  if (!user) {
    return (
      <div className="py-32 text-center text-wine-dark">
        <p className="text-display text-2xl mb-4">Please sign in to view your orders</p>
        <Link to="/login" className="bg-wine-dark text-cream px-8 py-3 inline-block text-display tracking-wider">SIGN IN</Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-[70vh]">
      <section className="bg-sand py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-display text-5xl md:text-7xl text-wine-dark">
            MY <span className="brush-highlight">ORDERS</span>
          </motion.h1>
          <p className="mt-4 text-wine-dark/70">Track every piece on its way to you.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12">
        {isLoading ? (
          <div className="py-16 grid place-items-center"><Loader2 className="animate-spin text-wine-dark" /></div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-wine-dark/70">
            <Package className="mx-auto mb-4" size={48} />
            <p>No orders yet.</p>
            <Link to="/catalogue" className="mt-6 inline-block bg-wine-dark text-cream px-6 py-3 text-display tracking-wider">SHOP</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <Link
                key={o.id}
                to="/order/$id"
                params={{ id: o.id }}
                className="block bg-white p-6 border border-wine-dark/10 hover:border-wine-dark transition-colors"
              >
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <div className="text-xs text-wine-dark/50">ORDER #{o.id.slice(0, 8).toUpperCase()}</div>
                    <div className="text-display text-xl text-wine-dark mt-1">Rs. {Number(o.total).toLocaleString()}</div>
                    <div className="text-xs text-wine-dark/60 mt-1">{new Date(o.created_at).toLocaleDateString()} · {o.order_items?.length ?? 0} item(s)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 text-xs font-semibold rounded ${statusColor[o.status]}`}>
                      {STATUS_LABEL[o.status]}
                    </span>
                    <ArrowRight className="text-wine-dark" size={18} />
                  </div>
                </div>
                {o.order_items && o.order_items.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    {o.order_items.slice(0, 4).map((it) => (
                      <img key={it.id} src={it.product_image} alt="" className="w-12 h-14 object-cover" />
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
