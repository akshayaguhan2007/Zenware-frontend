import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingBag, Heart, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";

const navLinks = [
  { to: "/catalogue", label: "Catalogue" },
  { to: "/fashion", label: "Fashion" },
  { to: "/lifestyle", label: "Lifestyle" },
  { to: "/about", label: "About" },
];

export function Navbar() {
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const { location } = useRouterState();

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-wine-dark/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="text-display text-xl text-wine-dark tracking-wider">
          FASHION
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm tracking-wider transition-colors hover:text-wine-dark ${
                location.pathname === l.to ? "text-wine-dark" : "text-wine-dark/60"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/favourite" className="relative text-wine-dark/70 hover:text-wine-dark">
            <Heart size={20} />
            {wishCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-wine-dark text-cream text-[10px] rounded-full grid place-items-center">
                {wishCount}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative text-wine-dark/70 hover:text-wine-dark">
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-wine-dark text-cream text-[10px] rounded-full grid place-items-center">
                {count}
              </span>
            )}
          </Link>
          <Link to={user ? "/profile" : "/login"} className="text-wine-dark/70 hover:text-wine-dark">
            <User size={20} />
          </Link>
          <button
            className="md:hidden text-wine-dark"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-cream border-t border-wine-dark/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="text-display text-lg text-wine-dark"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
