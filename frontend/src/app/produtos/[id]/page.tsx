"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StoreHeader from "../../../components/StoreHeader";
import { API_URL, addToCart, price, type Product } from "../../../lib/store";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  useEffect(() => { params.then(({ id }) => fetch(`${API_URL}/api/products/${id}`).then((response) => response.ok ? response.json() : null).then(setProduct).catch(() => setProduct(null))); }, [params]);
  if (!product) return <div className="min-h-screen bg-[#f7f4f0]"><StoreHeader /><main className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-semibold">Produto não encontrado</h1><Link href="/produtos" className="mt-5 inline-block font-bold text-[#8d6f1d]">Voltar para a loja</Link></main></div>;
  return <div className="min-h-screen bg-[#f7f4f0] text-[#2d1d1e]"><StoreHeader /><main className="mx-auto max-w-5xl px-4 py-10 md:px-8"><Link href="/produtos" className="text-sm font-semibold text-[#8d6f1d]">← Voltar para produtos</Link><div className="mt-6 grid gap-8 rounded-[28px] border border-[#eadbb1] bg-white p-6 shadow-sm md:grid-cols-2 md:p-10"><div className="flex min-h-80 items-center justify-center rounded-2xl bg-[#fff8e5] p-10"><img src={product.imageUrl || "/logo-paty-flores.svg"} alt={product.name} className="max-h-72 max-w-full object-contain" /></div><div className="flex flex-col justify-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a47a16]">{product.category}</p><h1 className="mt-3 text-4xl font-semibold tracking-[-0.05em]">{product.name}</h1><p className="mt-5 leading-8 text-[#6a5555]">{product.description}</p><p className="mt-6 text-3xl font-bold">{price(product.price)}</p><p className="mt-2 text-sm text-[#6a5555]">{product.stock > 0 ? `${product.stock} unidades disponíveis` : "Produto esgotado"}</p><div className="mt-7 flex gap-3"><input aria-label="Quantidade" type="number" min="1" max={product.stock} value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value)))} className="w-20 rounded-xl border border-[#eadbb1] px-3 py-3" /><button disabled={!product.stock} onClick={() => { if (!localStorage.getItem("paty_token")) { router.push("/login"); return; } addToCart(product, quantity); setMessage("Produto adicionado ao carrinho."); }} className="flex-1 rounded-2xl bg-[#2d1d1e] px-5 py-3 font-bold text-white disabled:opacity-50">Adicionar ao carrinho</button></div>{message && <p className="mt-4 rounded-xl bg-[#f5e7aa] px-4 py-3 text-sm font-semibold text-[#5d4514]">{message} <Link href="/carrinho" className="underline">Ver carrinho</Link></p>}</div></div></main></div>;
}
