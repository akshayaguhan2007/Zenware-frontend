import { useQuery, useQueryClient } from "@tanstack/react-query";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  cat: string;
  img: string;
  sizes: string[];
  stock?: number;
  active?: boolean;
};

const PRODUCTS_KEY = "fashion_products";

const sampleProducts: Product[] = [
  { id: "1", name: "Wool Trench Coat", description: "A timeless wool trench in deep burgundy. Tailored fit with a relaxed drape.", price: 4999, cat: "Fashion", img: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80", sizes: ["XS","S","M","L","XL"], stock: 20, active: true },
  { id: "2", name: "Silk Slip Dress", description: "Fluid silk slip dress with adjustable straps. Perfect for day to evening.", price: 2999, cat: "Fashion", img: "https://images.unsplash.com/photo-1485518882345-15568b007407?w=800&q=80", sizes: ["XS","S","M","L"], stock: 15, active: true },
  { id: "3", name: "Oversized Knit Hoodie", description: "Chunky knit hoodie in oatmeal. Cozy and effortlessly stylish.", price: 1999, cat: "Fashion", img: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", sizes: ["S","M","L","XL"], stock: 30, active: true },
  { id: "4", name: "Pleated Midi Skirt", description: "Flowing pleated midi skirt in cream. Pairs with everything.", price: 1799, cat: "Fashion", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80", sizes: ["XS","S","M","L"], stock: 25, active: true },
  { id: "5", name: "Linen Wide Trousers", description: "Relaxed wide-leg linen trousers. Breathable and elegant.", price: 2199, cat: "Lifestyle", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80", sizes: ["XS","S","M","L","XL"], stock: 18, active: true },
  { id: "6", name: "Classic Turtleneck", description: "Fine ribbed turtleneck in wine. A wardrobe essential.", price: 1499, cat: "Fashion", img: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&q=80", sizes: ["S","M","L"], stock: 22, active: true },
  { id: "7", name: "Suede Bucket Bag", description: "Soft suede bucket bag in cocoa. Spacious and stylish.", price: 3499, cat: "Lifestyle", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80", sizes: ["One Size"], stock: 10, active: true },
  { id: "8", name: "Structured Blazer", description: "Tailored blazer with clean lines. Office to evening in one piece.", price: 3999, cat: "Fashion", img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&q=80", sizes: ["XS","S","M","L","XL"], stock: 12, active: true },
];

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(sampleProducts));
  return sampleProducts;
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function useProducts(includeInactive = false) {
  return useQuery({
    queryKey: ["products", includeInactive],
    queryFn: async () => {
      const all = loadProducts();
      return includeInactive ? all : all.filter((p) => p.active !== false);
    },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => loadProducts().find((p) => p.id === id) ?? null,
    enabled: !!id,
  });
}

export function useProductsMutations() {
  const qc = useQueryClient();

  const upsert = (product: Product) => {
    const all = loadProducts();
    const exists = all.findIndex((p) => p.id === product.id);
    const updated = exists >= 0
      ? all.map((p) => p.id === product.id ? product : p)
      : [...all, product];
    saveProducts(updated);
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  const remove = (id: string) => {
    saveProducts(loadProducts().filter((p) => p.id !== id));
    qc.invalidateQueries({ queryKey: ["products"] });
  };

  return { upsert, remove };
}
