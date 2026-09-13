export type Product = {
  id: string;
  name: string;
  description: string;
  price: number | string;
  category: string;
  stock: number;
  imageUrl?: string | null;
};

export type CartItem = Product & { quantity: number };

export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? (
  typeof window === "undefined"
    ? "http://localhost:4000"
    : `${window.location.protocol}//${window.location.hostname}:4000`
);
const CART_KEY_PREFIX = "paty_cart:";

function cartKey() {
  if (typeof window === "undefined") return `${CART_KEY_PREFIX}guest`;
  try {
    const user = JSON.parse(localStorage.getItem("paty_user") ?? "null") as { id?: string } | null;
    return `${CART_KEY_PREFIX}${user?.id ?? "guest"}`;
  } catch {
    return `${CART_KEY_PREFIX}guest`;
  }
}

export function price(value: number | string) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(cartKey()) ?? "[]") as CartItem[]; } catch { return []; }
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem(cartKey(), JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(product: Product, quantity = 1) {
  const items = getCart();
  const existing = items.find((item) => item.id === product.id);
  if (existing) existing.quantity = Math.min(existing.quantity + quantity, product.stock);
  else items.push({ ...product, quantity });
  saveCart(items);
}

export function cartCount(items = getCart()) { return items.reduce((total, item) => total + item.quantity, 0); }
export function cartSubtotal(items = getCart()) { return items.reduce((total, item) => total + Number(item.price) * item.quantity, 0); }
