import { createContext, useContext, useState, type ReactNode } from "react";

type WishlistCtx = {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<WishlistCtx>(null!);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  const has = (id: string) => ids.includes(id);

  const toggle = (id: string) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const remove = (id: string) => setIds((prev) => prev.filter((x) => x !== id));

  const clear = () => setIds([]);

  return (
    <Ctx.Provider value={{ ids, count: ids.length, has, toggle, remove, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWishlist = () => useContext(Ctx);
