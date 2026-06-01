import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FASHION — Explore Unique Clothes" },
      { name: "description", content: "Live for influential and innovative fashion. Discover trending styles, new arrivals, and exclusive drops." },
      { property: "og:title", content: "FASHION — Explore Unique Clothes" },
      { property: "og:description", content: "Live for influential and innovative fashion." },
    ],
  }),
  component: Index,
});

const brands = ["shopify", "OBEY", "LACOSTE", "Levi's", "amazon", "Flipkart", "ZARA"];

const newArrivals = [
  { title: "Hoodies & Sweatshirts", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80" },
  { title: "Coats & Parkas", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80" },
  { title: "Tees & T-Shirt", img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80" },
];

const favourites = [
  { title: "Trending on Instagram", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&q=80" },
  { title: "All under $40", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1000&q=80" },
];

function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-background overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-display text-6xl md:text-7xl lg:text-8xl text-wine-dark leading-[0.95]">
              <span className="block-highlight">LET'S</span>
              <br />
              EXPLORE
              <br />
              <span className="sand-highlight">UNIQUE</span>
              <br />
              CLOTHES.
            </h1>
            <p className="mt-8 text-wine-dark/70 text-lg">
              Live for influential and innovative fashion!
            </p>
            <Link
              to="/catalogue"
              className="mt-8 inline-block bg-wine-dark text-cream px-8 py-4 text-display tracking-wider hover:bg-wine transition-colors"
            >
              Shop Now
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-[4/5] w-full"
          >
            <img
              src="https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&q=80"
              alt="Fashion model"
              className="absolute inset-0 w-full h-full object-cover rounded-sm"
            />
          </motion.div>
        </div>
      </section>

      {/* Brand marquee */}
      <section className="bg-sand py-10 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...brands, ...brands].map((b, i) => (
            <span key={i} className="mx-12 text-display text-3xl text-wine-dark/70">
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-display text-5xl md:text-6xl text-wine-dark mb-16">
            NEW <span className="brush-highlight">ARRIVALS</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {newArrivals.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden rounded-sm">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-display text-2xl text-wine-dark">{item.title}</h3>
                    <p className="text-muted-foreground mt-1">Explore Now</p>
                  </div>
                  <ArrowRight className="text-wine-dark group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payday Sale */}
      <section className="bg-sand py-20 px-6">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
          <motion.img
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80"
            alt="Sale"
            className="rounded-sm w-full aspect-[4/5] object-cover"
          />
          <div>
            <h2 className="text-display text-6xl md:text-7xl text-black">
              <span className="block-highlight">PAYDAY</span>
              <br />
              SALE NOW
            </h2>
            <p className="mt-8 text-wine-dark text-lg max-w-md">
              Spend minimal $100 get 30% off voucher code for your next purchase
            </p>
            <p className="mt-6 text-display text-2xl text-wine-dark">1 July - 10 July 2026</p>
            <p className="text-wine-dark/70 text-sm">*Terms and conditions apply</p>
            <Link
              to="/catalogue"
              className="mt-8 inline-block bg-wine-dark text-cream px-8 py-4 text-display tracking-wider hover:bg-wine transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Young's Favourite */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-display text-5xl md:text-6xl text-wine-dark mb-16">
            YOUNG'S <span className="brush-highlight">FAVOURITE</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {favourites.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden rounded-sm">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-display text-2xl text-wine-dark">{item.title}</h3>
                    <p className="text-muted-foreground mt-1">Explore Now</p>
                  </div>
                  <ArrowRight className="text-wine-dark group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download App */}
      <section className="py-24 px-6 bg-background">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-display text-5xl md:text-6xl text-wine-dark leading-tight">
              DOWNLOAD APP & GET THE VOUCHER!
            </h2>
            <p className="mt-8 text-wine-dark/70 text-lg max-w-md">
              Get 30% off for first transaction using our new mobile app for now.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <a href="#" className="bg-wine-dark text-cream px-6 py-3 rounded-sm text-sm">
                <div className="text-xs opacity-70">Download on the</div>
                <div className="text-display">App Store</div>
              </a>
              <a href="#" className="bg-wine-dark text-cream px-6 py-3 rounded-sm text-sm">
                <div className="text-xs opacity-70">GET IT ON</div>
                <div className="text-display">Google Play</div>
              </a>
            </div>
          </div>
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="relative aspect-square"
          >
            <div className="absolute inset-8 rounded-full border-2 border-sand/50" />
            <div className="absolute inset-16 rounded-full border-2 border-sand/40" />
            <img
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80"
              alt="Mobile app"
              className="relative mx-auto w-2/3 rounded-3xl shadow-2xl"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
