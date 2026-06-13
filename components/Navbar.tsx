import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, Heart, User, Menu, X, Package, Shirt, Sparkles, Info } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { to: "/catalogue", label: "Catalogue", icon: Shirt },
  { to: "/fashion", label: "Fashion", icon: Sparkles },
  { to: "/lifestyle", label: "Lifestyle", icon: Sparkles },
  { to: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  return (
    <header className="sticky top-0 z-50 bg-wine-dark/95 backdrop-blur border-b border-cream/10 text-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-display text-xl text-cream tracking-wider">
          ZenWear
        </Link>

        {/* DESKTOP NAV — text links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm tracking-wider transition-colors hover:text-highlight ${
                location.pathname === l.to ? "text-cream" : "text-cream/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ICON ACTIONS */}
        <div className="flex items-center gap-1">

          {/* Wishlist */}
          <NavIcon to="/favourite" label="Favourites" active={location.pathname === "/favourite"}>
            <Heart size={20} />
            {wishCount > 0 && <Badge count={wishCount} />}
          </NavIcon>

          {/* My Orders */}
          <NavIcon to="/orders" label="My Orders" active={location.pathname === "/orders"}>
            <Package size={20} />
          </NavIcon>

          {/* Cart */}
          <NavIcon to="/cart" label="Bag" active={location.pathname === "/cart"}>
            <ShoppingBag size={20} />
            {count > 0 && <Badge count={count} />}
          </NavIcon>

          {/* Profile / Login */}
          <NavIcon to={user ? "/profile" : "/login"} label={user ? "Profile" : "Sign In"} active={location.pathname === "/profile"}>
            <User size={20} />
          </NavIcon>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden relative w-10 h-10 grid place-items-center text-cream hover:text-highlight transition-colors ml-1"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-wine-dark border-t border-cream/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`text-display text-lg transition-colors ${
                location.pathname === l.to ? "text-cream" : "text-cream/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="border-t border-wine-dark/10 pt-4 flex flex-col gap-3">
            <Link to="/orders" onClick={() => setOpen(false)} className="flex items-center gap-3 text-cream/80 hover:text-highlight">
              <Package size={18} /> My Orders
            </Link>
            <Link to="/favourite" onClick={() => setOpen(false)} className="flex items-center gap-3 text-cream/80 hover:text-highlight">
              <Heart size={18} /> Favourites {wishCount > 0 && `(${wishCount})`}
            </Link>
            <Link to="/cart" onClick={() => setOpen(false)} className="flex items-center gap-3 text-cream/80 hover:text-highlight">
              <ShoppingBag size={18} /> Bag {count > 0 && `(${count})`}
            </Link>
            <Link to={user ? "/profile" : "/login"} onClick={() => setOpen(false)} className="flex items-center gap-3 text-cream/80 hover:text-highlight">
              <User size={18} /> {user ? "Profile" : "Sign In"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ── icon button with tooltip ── */
function NavIcon({
  to, label, active, children,
}: {
  to: string; label: string; active: boolean; children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={`group relative w-10 h-10 grid place-items-center transition-colors ${
        active ? "text-cream" : "text-cream/70 hover:text-highlight"
      }`}
      aria-label={label}
    >
      {children}
      {/* active dot */}
      {active && (
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-highlight" />
      )}
      {/* tooltip */}
      <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-wine-dark text-cream text-[10px] tracking-wider px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
    </Link>
  );
}

/* ── badge dot ── */
function Badge({ count }: { count: number }) {
  return (
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-wine text-cream text-[9px] rounded-full grid place-items-center font-bold">
      {count > 9 ? "9+" : count}
    </span>
  );
}
