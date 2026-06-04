import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="bg-wine-dark text-cream">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16 grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="text-display text-3xl">ZenWear</p>
          <p className="mt-4 text-cream/60 text-sm max-w-xs">
            Live for influential and innovative fashion. Curated pieces for the modern wardrobe.
          </p>
        </div>
        <div>
          <p className="text-display text-sm tracking-widest mb-4">SHOP</p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/catalogue" className="hover:text-cream">Catalogue</Link></li>
            <li><Link to="/fashion" className="hover:text-cream">Fashion</Link></li>
            <li><Link to="/lifestyle" className="hover:text-cream">Lifestyle</Link></li>
            <li><Link to="/favourite" className="hover:text-cream">Favourites</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-display text-sm tracking-widest mb-4">ACCOUNT</p>
          <ul className="space-y-2 text-sm text-cream/70">
            <li><Link to="/login" className="hover:text-cream">Sign In</Link></li>
            <li><Link to="/signup" className="hover:text-cream">Create Account</Link></li>
            <li><Link to="/orders" className="hover:text-cream">My Orders</Link></li>
            <li><Link to="/about" className="hover:text-cream">About Us</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/40">
        <span>© {new Date().getFullYear()} ZenWear. All rights reserved.</span>
        <div className="flex items-center gap-5">
          <Link to="/contact" className="hover:text-cream transition-colors">Contact</Link>
          <Link to="/faq" className="hover:text-cream transition-colors">FAQ</Link>
          <Link to="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-cream transition-colors">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
