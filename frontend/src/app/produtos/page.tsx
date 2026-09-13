"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StoreHeader from "../../components/StoreHeader";
import { API_URL, addToCart, price, type Product } from "../../lib/store";

const fallback: Product[] = [
  { id: "demo-1", name: "Buquê de Rosas", description: "Buquê clássico para presentes e celebrações.", price: 89.9, category: "Buquês", stock: 12, imageUrl: "/logo-paty-flores.svg" },
  { id: "demo-2", name: "Jardim de Mesa", description: "Plantas selecionadas para transformar seu ambiente.", price: 129.9, category: "Plantas", stock: 8, imageUrl: "/logo-paty-flores.svg" },
  { id: "demo-3", name: "Vaso Cerâmico", description: "Peça decorativa para combinar com seu espaço.", price: 74.5, category: "Vasos", stock: 10, imageUrl: "/logo-paty-flores.svg" },
  { id: "demo-4", name: "Kit Presente", description: "Uma composição especial para surpreender.", price: 159.9, category: "Presentes", stock: 5, imageUrl: "/logo-paty-flores.svg" },
];

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(fallback);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [message, setMessage] = useState("");

  useEffect(() => { fetch(`${API_URL}/api/products`).then((response) => response.ok ? response.json() : fallback).then(setProducts).catch(() => setProducts(fallback)); }, []);
  const categories = ["Todas", ...Array.from(new Set(products.map((product) => product.category)))];
  useEffect(() => { const requestedCategory = new URLSearchParams(window.location.search).get("categoria"); if (requestedCategory) setCategory(requestedCategory); }, []);
  const filtered = products.filter((product) => (category === "Todas" || product.category === category || category === "Arranjos" && product.category === "Arranjo") && `${product.name} ${product.description}`.toLowerCase().includes(query.toLowerCase()));

  return <div className="min-h-screen bg-[#f7f4f0] text-[#2d1d1e]"><StoreHeader /><main className="mx-auto max-w-7xl px-4 py-10 md:px-8">
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8d6f1d]">Loja online</p><h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">Escolha algo especial</h1><p className="mt-3 max-w-xl text-[#6a5555]">Flores, plantas, vasos e presentes preparados com carinho para cada momento.</p></div><Link href="/carrinho" className="text-sm font-bold text-[#8d6f1d]">Ver meu carrinho →</Link></div>
    <div className="mt-8 flex flex-col gap-3 sm:flex-row"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produto" className="w-full rounded-2xl border border-[#eadbb1] bg-white px-4 py-3 outline-none focus:border-[#c69d2f]" /><select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-[#eadbb1] bg-white px-4 py-3 outline-none">{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
    {message && <p className="mt-4 rounded-xl bg-[#f5e7aa] px-4 py-3 text-sm font-semibold text-[#5d4514]">{message}</p>}
    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((product) => <article key={product.id} className="overflow-hidden rounded-[24px] border border-[#eadbb1] bg-white shadow-sm"><Link href={`/produtos/${product.id}`}><div className="flex h-52 items-center justify-center bg-[#fff8e5] p-8"><img src={product.imageUrl || "/logo-paty-flores.svg"} alt="" className="max-h-full max-w-full object-contain" /></div></Link><div className="p-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a47a16]">{product.category}</p><Link href={`/produtos/${product.id}`}><h2 className="mt-2 text-lg font-semibold hover:text-[#a47a16]">{product.name}</h2></Link><p className="mt-2 min-h-12 text-sm leading-6 text-[#6a5555]">{product.description}</p><div className="mt-4 flex items-center justify-between gap-3"><strong>{price(product.price)}</strong><button onClick={() => { if (!localStorage.getItem("paty_token")) { router.push("/login"); return; } addToCart(product); setMessage(`${product.name} foi adicionado ao carrinho.`); }} className="rounded-full bg-[#2d1d1e] px-3 py-2 text-xs font-bold text-white">Adicionar</button></div></div></article>)}</div>
  </main></div>;
}
