"use client";

import Link from "next/link";
import { startTransition, useEffect, useState } from "react";
import StoreHeader from "../../components/StoreHeader";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type Session = { name: string; email: string; role: string };
type Order = { id: string; status: string; total: number | string; createdAt: string; items: { name: string; quantity: number }[] };
type Address = { id: string; label: string; street: string; number: string; city: string; state: string; postalCode: string };

export default function AccountPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("paty_token");
    const storedUser = localStorage.getItem("paty_user");
    if (!token || !storedUser) return;
    startTransition(() => setSession(JSON.parse(storedUser) as Session));
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API_URL}/api/orders/mine`, { headers }),
      fetch(`${API_URL}/api/addresses`, { headers }),
    ]).then(async ([ordersResponse, addressesResponse]) => {
      if (!ordersResponse.ok || !addressesResponse.ok) throw new Error("Não foi possível carregar sua conta.");
      setOrders(await ordersResponse.json());
      setAddresses(await addressesResponse.json());
    }).catch((error: unknown) => setMessage(error instanceof Error ? error.message : "Não foi possível carregar sua conta."));
  }, []);

  function logout() {
    localStorage.removeItem("paty_token");
    localStorage.removeItem("paty_user");
    setSession(null);
    setOrders([]);
    setAddresses([]);
    setMessage("Sessão encerrada.");
  }

  if (!session) return <div className="min-h-screen bg-[#f7f4f0] text-[#2d1d1e]"><StoreHeader /><main className="mx-auto max-w-3xl px-4 py-16"><h1 className="text-4xl font-semibold">Sua área pessoal</h1><p className="mt-3 text-[#6a5555]">Entre para ver somente seus pedidos e endereços.</p><Link href="/login" className="mt-7 inline-block rounded-full bg-[#2d1d1e] px-5 py-3 text-sm font-bold text-white">Entrar</Link></main></div>;

  return <div className="min-h-screen bg-[#f7f4f0] text-[#2d1d1e]"><StoreHeader /><main className="mx-auto max-w-6xl px-4 py-10 md:px-8"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8d6f1d]">Área pessoal</p><h1 className="mt-2 text-4xl font-semibold">Olá, {session.name.split(" ")[0]}.</h1><p className="mt-2 text-[#6a5555]">Seus dados ficam separados dos outros clientes.</p></div><button onClick={logout} className="self-start rounded-full border border-[#d9c074] px-4 py-2 text-sm font-bold sm:self-auto">Sair</button></div>{message && <p className="mt-5 rounded-xl bg-[#f5e7aa] px-4 py-3 text-sm font-semibold">{message}</p>}<div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"><section className="rounded-[24px] border border-[#eadbb1] bg-white p-6"><h2 className="text-2xl font-semibold">Meus pedidos</h2><div className="mt-5 space-y-3">{orders.length === 0 ? <p className="rounded-2xl bg-[#fff8e5] p-4 text-sm text-[#6a5555]">Você ainda não fez pedidos.</p> : orders.map((order) => <Link key={order.id} href={`/pedido/${order.id}`} className="block rounded-2xl border border-[#eadbb1] p-4 transition hover:border-[#c69d2f]"><div className="flex justify-between gap-4"><strong>Pedido #{order.id.slice(-8)}</strong><span className="text-sm font-bold text-[#8d6f1d]">{order.status}</span></div><p className="mt-2 text-sm text-[#6a5555]">{order.items.reduce((total, item) => total + item.quantity, 0)} itens · R$ {Number(order.total).toFixed(2).replace(".", ",")} · {new Date(order.createdAt).toLocaleDateString("pt-BR")}</p></Link>)}</div></section><section className="rounded-[24px] border border-[#eadbb1] bg-white p-6"><h2 className="text-2xl font-semibold">Meus endereços</h2><div className="mt-5 space-y-3">{addresses.length === 0 ? <p className="rounded-2xl bg-[#fff8e5] p-4 text-sm text-[#6a5555]">Nenhum endereço salvo.</p> : addresses.map((address) => <div key={address.id} className="rounded-2xl border border-[#eadbb1] p-4"><strong>{address.label}</strong><p className="mt-1 text-sm text-[#6a5555]">{address.street}, {address.number}<br />{address.city} - {address.state}<br />CEP {address.postalCode}</p></div>)}</div></section></div></main></div>;
}