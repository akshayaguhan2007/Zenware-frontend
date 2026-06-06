import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "./api";
import { useAuth } from "./auth";

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
  const { user } = useAuth();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) { setIds([]); return; }
    api.get<string[]>("/wishlist")
      .then(setIds)
      .catch(() => setIds([]));
  }, [user]);

  const has = (id: string) => ids.includes(id);

  const toggle = (id: string) => {
    setIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    api.post(`/wishlist/${id}`, {}).catch(() => {});
  };

  const remove = (id: string) => {
    setIds((prev) => prev.filter((x) => x !== id));
    api.delete(`/wishlist/${id}`).catch(() => {});
  };

  const clear = () => setIds([]);

  return (
    <Ctx.Provider value={{ ids, count: ids.length, has, toggle, remove, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export const useWishlist = () => useContext(Ctx);
