import { createContext, useContext, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  img: string;
  price: number;
  size: string;
  qty: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  add: (product: { id: string; name: string; img: string; price: number }, size: string, qty: number) => void;
  remove: (id: string, size: string) => void;
  setQty: (id: string, size: string, qty: number) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx>(null!);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (product: { id: string; name: string; img: string; price: number }, size: string, qty: number) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.size === size);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.size === size ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...product, size, qty }];
    });
  };

  const remove = (id: string, size: string) =>
    setItems((prev) => prev.filter((i) => !(i.id === id && i.size === size)));

  const setQty = (id: string, size: string, qty: number) => {
    if (qty <= 0) return remove(id, size);
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.size === size ? { ...i, qty } : i))
    );
  };

  const clear = () => setItems([]);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);

  return (
    <Ctx.Provider value={{ items, count, subtotal, add, remove, setQty, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => useContext(Ctx);
