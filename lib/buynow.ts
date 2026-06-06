import type { CartItem } from "./cart";

const KEY = "zenwear_buynow";

export function setBuyNow(item: CartItem) {
  sessionStorage.setItem(KEY, JSON.stringify(item));
}

export function getBuyNow(): CartItem | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function clearBuyNow() {
  sessionStorage.removeItem(KEY);
}
