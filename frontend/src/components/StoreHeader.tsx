"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartCount, getCart } from "../lib/store";

export default function StoreHeader() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("cart-updated", update);
    return () => window.removeEventListener("cart-updated", update);
  }, []);

  return (
    <header className="border-b border-[#eadbb1] bg-[#fffdf8]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo-paty-flores.svg" alt="Paty Flores" className="h-12 w-12 object-contain" />
          <span className="hidden text-sm font-semibold text-[#4c3b3d] sm:block">Flores para celebrar</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm font-semibold text-[#4c3b3d] sm:gap-5">
          <Link href="/produtos" className="hover:text-[#a47a16]">Comprar</Link>
          <Link href="/conta" className="hidden hover:text-[#a47a16] sm:block">Minha conta</Link>
          <Link href="/carrinho" className="rounded-full bg-[#2d1d1e] px-4 py-2 text-white hover:bg-[#4b2a2d]">Carrinho ({count})</Link>
        </nav>
      </div>
    </header>
  );
}
