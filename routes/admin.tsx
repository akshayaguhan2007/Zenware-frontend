import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Pencil, Trash2, Save, X, Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useIsAdmin } from "@/lib/admin";
import { useProducts, useProductsMutations, type Product } from "@/lib/products";
import { getAllOrders, updateOrderStatus, STATUS_FLOW, STATUS_LABEL, type Order, type OrderStatus } from "@/lib/orders";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — FASHION" }] }),
  component: AdminPage,
});

type Tab = "overview" | "products" | "orders" | "customers";

function AdminPage() {
  const { user, loading } = useAuth();
  const isAdmin = useIsAdmin();
  const [tab, setTab] = useState<Tab>("overview");

  if (loading) return <div className="py-32 grid place-items-center"><Loader2 className="animate-spin text-wine-dark" /></div>;
  if (!user) {
    return (
      <div className="py-32 text-center text-wine-dark">
        <p className="text-display text-2xl mb-4">Admin access required</p>
        <Link to="/login" className="bg-wine-dark text-cream px-8 py-3 inline-block text-display tracking-wider">SIGN IN</Link>
      </div>
    );
  }
  if (!isAdmin) {
    return (
      <div className="py-32 text-center text-wine-dark">
        <p className="text-display text-2xl">Access denied</p>
        <p className="mt-2 text-wine-dark/60 text-sm">This dashboard is for the store owner only.</p>
        <Link to="/" className="mt-6 inline-block underline">Back home</Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <section className="bg-wine-dark text-cream py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-display text-4xl md:text-6xl">
            ADMIN <span className="text-sand">CONTROL</span>
          </motion.h1>
          <p className="mt-3 text-cream/70 text-sm">Signed in as {user.email}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-wrap gap-2 mb-8 border-b border-wine-dark/10">
          {([
            ["overview", "Overview", TrendingUp],
            ["products", "Products", Package],
            ["orders", "Orders", ShoppingBag],
            ["customers", "Customers", Users],
          ] as const).map(([k, label, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex items-center gap-2 px-5 py-3 text-display text-sm tracking-wider transition-colors border-b-2 ${
                tab === k ? "border-wine-dark text-wine-dark" : "border-transparent text-wine-dark/50 hover:text-wine-dark"
              }`}
            >
              <Icon size={16} /> {label.toUpperCase()}
            </button>
          ))}
        </div>

        {tab === "overview" && <Overview />}
        {tab === "products" && <ProductsTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "customers" && <CustomersTab />}
      </div>
    </div>
  );
}

function Overview() {
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: () => getAllOrders() });
  const { data: products = [] } = useProducts(true);
  const revenue = orders.filter(o => o.status !== "cancelled").reduce((a, o) => a + Number(o.total), 0);
  const stats = [
    { label: "Total Revenue", value: `Rs. ${revenue.toLocaleString()}` },
    { label: "Total Orders", value: orders.length },
    { label: "Pending", value: orders.filter(o => o.status === "pending").length },
    { label: "Delivered", value: orders.filter(o => o.status === "delivered").length },
    { label: "Products", value: products.length },
    { label: "Unique Customers", value: new Set(orders.map(o => o.user_id)).size },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white p-6 border border-wine-dark/10">
          <div className="text-xs text-wine-dark/50 tracking-wider">{s.label.toUpperCase()}</div>
          <div className="text-display text-3xl text-wine-dark mt-2">{s.value}</div>
        </motion.div>
      ))}
    </div>
  );
}

const emptyProduct = { name: "", description: "", price: 0, cat: "Fashion", img: "", sizes: "S,M,L", stock: 100, active: true };

function ProductsTab() {
  const { data: products = [], isLoading } = useProducts(true);
  const { upsert, remove } = useProductsMutations();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<any>(emptyProduct);
  const [saving, setSaving] = useState(false);

  const startEdit = (p: Product) => {
    setEditing(p.id); setCreating(false);
    setForm({ name: p.name, description: p.description, price: p.price, cat: p.cat, img: p.img, sizes: p.sizes.join(","), stock: p.stock ?? 100, active: p.active ?? true });
  };
  const cancel = () => { setEditing(null); setCreating(false); };

  const save = async () => {
    setSaving(true);
    const product: Product = {
      id: editing ?? crypto.randomUUID(),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      cat: form.cat,
      img: form.img,
      sizes: form.sizes.split(",").map((s: string) => s.trim()).filter(Boolean),
      stock: Number(form.stock),
      active: form.active,
    };
    upsert(product);
    setSaving(false);
    cancel();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-display text-2xl text-wine-dark">Products</h2>
        <button onClick={() => { setCreating(true); setEditing(null); setForm(emptyProduct); }} className="bg-wine-dark text-cream px-5 py-2 text-display text-sm tracking-wider hover:bg-wine flex items-center gap-2">
          <Plus size={16} /> NEW PRODUCT
        </button>
      </div>

      {(creating || editing) && (
        <div className="bg-white p-6 border border-wine-dark/10 mb-6">
          <div className="flex justify-between mb-4">
            <h3 className="text-display text-lg text-wine-dark">{creating ? "New product" : "Edit product"}</h3>
            <button onClick={cancel}><X /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Category" value={form.cat} onChange={(v) => setForm({ ...form, cat: v })} />
            <Input label="Price (Rs.)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
            <Input label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
            <div className="sm:col-span-2"><Input label="Image URL" value={form.img} onChange={(v) => setForm({ ...form, img: v })} /></div>
            <div className="sm:col-span-2"><Input label="Sizes (comma separated)" value={form.sizes} onChange={(v) => setForm({ ...form, sizes: v })} /></div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-wine-dark/60 tracking-wider mb-1">DESCRIPTION</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-wine-dark/20 px-3 py-2" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active (visible to customers)
            </label>
          </div>
          <button onClick={save} disabled={saving} className="mt-5 bg-wine-dark text-cream px-6 py-3 text-display text-sm tracking-wider hover:bg-wine flex items-center gap-2 disabled:opacity-60">
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} SAVE
          </button>
        </div>
      )}

      {isLoading ? <Loader2 className="animate-spin text-wine-dark" /> : (
        <div className="bg-white border border-wine-dark/10">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4 border-b border-wine-dark/10 last:border-b-0">
              <img src={p.img} alt={p.name} className="w-14 h-16 object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-wine-dark text-display truncate">{p.name}</div>
                <div className="text-xs text-wine-dark/60">{p.cat} · Stock {p.stock} · {p.active ? "Active" : "Hidden"}</div>
              </div>
              <div className="text-wine font-semibold">Rs. {p.price.toLocaleString()}</div>
              <button onClick={() => startEdit(p)} className="p-2 hover:bg-sand"><Pencil size={16} /></button>
              <button onClick={() => { if (confirm("Delete this product?")) remove(p.id); }} className="p-2 hover:bg-destructive/10 text-destructive"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: any; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs text-wine-dark/60 tracking-wider mb-1">{label.toUpperCase()}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-wine-dark/20 px-3 py-2" />
    </div>
  );
}

function OrdersTab() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders-full"],
    queryFn: () => getAllOrders(),
  });

  const filtered = statusFilter === "all" ? orders : orders.filter(o => o.status === statusFilter);

  const updateStatus = async (id: string, status: OrderStatus, note?: string) => {
    await updateOrderStatus(id, status, note);
    qc.invalidateQueries({ queryKey: ["admin-orders-full"] });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h2 className="text-display text-2xl text-wine-dark">Orders</h2>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-wine-dark/20 px-3 py-2 bg-white text-sm">
          <option value="all">All statuses</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      {isLoading ? <Loader2 className="animate-spin text-wine-dark" /> : filtered.length === 0 ? (
        <div className="bg-white p-8 text-center text-wine-dark/60 border border-wine-dark/10">No orders.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => <AdminOrderCard key={o.id} order={o} onUpdate={updateStatus} />)}
        </div>
      )}
    </div>
  );
}

function AdminOrderCard({ order, onUpdate }: { order: Order; onUpdate: (id: string, s: OrderStatus, note?: string) => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<OrderStatus>(order.status as OrderStatus);
  const [note, setNote] = useState(order.tracking_note ?? "");
  const [saving, setSaving] = useState(false);

  return (
    <div className="bg-white border border-wine-dark/10">
      <button onClick={() => setOpen(!open)} className="w-full p-5 text-left flex flex-wrap items-center justify-between gap-3 hover:bg-cream/50">
        <div>
          <div className="text-xs text-wine-dark/50">#{order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString()}</div>
          <div className="text-display text-wine-dark mt-1">{order.full_name} <span className="text-xs text-wine-dark/60 font-sans">({order.user_email})</span></div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-wine font-semibold">Rs. {Number(order.total).toLocaleString()}</span>
          <span className="px-2 py-1 text-xs bg-sand text-wine-dark rounded">{STATUS_LABEL[order.status as OrderStatus]}</span>
        </div>
      </button>
      {open && (
        <div className="p-5 border-t border-wine-dark/10 grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-display text-sm tracking-wider mb-2">SHIPPING</h4>
            <div className="text-sm text-wine-dark/80 space-y-1">
              <div>{order.full_name} · {order.phone}</div>
              <div>{order.address_line}</div>
              <div>{order.city}, {order.postal_code}, {order.country}</div>
              {order.notes && <div className="italic text-wine-dark/60">"{order.notes}"</div>}
            </div>
            <h4 className="text-display text-sm tracking-wider mt-5 mb-2">ITEMS</h4>
            <div className="text-sm space-y-2">
              {order.order_items?.map((it) => (
                <div key={it.id} className="flex gap-2 items-center">
                  <img src={it.product_image} alt="" className="w-10 h-12 object-cover" />
                  <div className="flex-1">{it.product_name} <span className="text-xs text-wine-dark/60">({it.size} · ×{it.quantity})</span></div>
                  <div>Rs. {(Number(it.unit_price) * it.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-display text-sm tracking-wider mb-2">MANAGE</h4>
            <label className="block text-xs text-wine-dark/60 mb-1">STATUS</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="w-full border border-wine-dark/20 px-3 py-2 bg-white mb-3">
              {STATUS_FLOW.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              <option value="cancelled">Cancelled</option>
            </select>
            <label className="block text-xs text-wine-dark/60 mb-1">TRACKING NOTE</label>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="w-full border border-wine-dark/20 px-3 py-2" placeholder="e.g. Shipped via BlueDart, tracking #..." />
            <button onClick={async () => { setSaving(true); await onUpdate(order.id, status, note); setSaving(false); }} disabled={saving} className="mt-3 bg-wine-dark text-cream px-5 py-2 text-display text-sm tracking-wider hover:bg-wine disabled:opacity-60 flex items-center gap-2">
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} UPDATE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomersTab() {
  const { data: orders = [], isLoading } = useQuery({ queryKey: ["admin-orders-customers"], queryFn: () => getAllOrders() });
  const customers = Array.from(
    orders.reduce((m, o) => {
      const c = m.get(o.user_id) ?? { user_id: o.user_id, email: o.user_email, name: o.full_name, phone: o.phone, orders: 0, total: 0, last: o.created_at };
      c.orders += 1; c.total += Number(o.total);
      if (o.created_at > c.last) c.last = o.created_at;
      m.set(o.user_id, c); return m;
    }, new Map<string, any>()).values()
  );
  if (isLoading) return <Loader2 className="animate-spin text-wine-dark" />;
  if (customers.length === 0) return <div className="bg-white p-8 text-center text-wine-dark/60 border border-wine-dark/10">No customers yet.</div>;
  return (
    <div className="bg-white border border-wine-dark/10 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-sand text-wine-dark text-left">
          <tr>
            {["CUSTOMER","EMAIL","PHONE","ORDERS","SPENT","LAST ORDER"].map(h => <th key={h} className="px-4 py-3 text-display text-xs tracking-wider">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.user_id} className="border-t border-wine-dark/10">
              <td className="px-4 py-3 text-wine-dark">{c.name}</td>
              <td className="px-4 py-3 text-wine-dark/70">{c.email}</td>
              <td className="px-4 py-3 text-wine-dark/70">{c.phone}</td>
              <td className="px-4 py-3">{c.orders}</td>
              <td className="px-4 py-3 text-wine font-semibold">Rs. {c.total.toLocaleString()}</td>
              <td className="px-4 py-3 text-wine-dark/60">{new Date(c.last).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
