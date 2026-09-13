"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import StoreHeader from "../../components/StoreHeader";
import { API_URL } from "../../lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Não foi possível criar sua conta.");
      localStorage.setItem("paty_token", result.token);
      localStorage.setItem("paty_user", JSON.stringify(result.user));
      router.push("/conta");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Não foi possível criar sua conta.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="min-h-screen bg-[#f7f4f0]"><StoreHeader /><main className="mx-auto max-w-md px-4 py-14"><div className="rounded-[28px] border border-[#eadbb1] bg-white p-7 shadow-sm sm:p-10"><p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[#8d6f1d]">Cadastro de cliente</p><h1 className="mt-3 text-center text-3xl font-semibold">Crie sua conta</h1><p className="mt-2 text-center text-sm text-[#6a5555]">Cadastre-se para comprar e acompanhar seus pedidos.</p>{error && <p className="mt-5 rounded-xl bg-[#f9e1dc] px-4 py-3 text-sm text-[#8b3830]">{error}</p>}<form onSubmit={submit} className="mt-7 space-y-4"><label className="block text-sm font-semibold">Nome completo<input required minLength={2} value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[#eadbb1] px-4 py-3 outline-none focus:border-[#c69d2f]" /></label><label className="block text-sm font-semibold">E-mail<input required type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[#eadbb1] px-4 py-3 outline-none focus:border-[#c69d2f]" /></label><label className="block text-sm font-semibold">Senha<input required minLength={6} type="password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} className="mt-2 w-full rounded-2xl border border-[#eadbb1] px-4 py-3 outline-none focus:border-[#c69d2f]" /></label><button disabled={loading} className="w-full rounded-2xl bg-[#2d1d1e] px-5 py-3.5 font-bold text-white disabled:opacity-60">{loading ? "Criando conta..." : "Criar conta e comprar"}</button></form><p className="mt-6 text-center text-sm text-[#6a5555]">Já tem conta? <Link href="/login" className="font-bold text-[#8d6f1d]">Entrar</Link></p></div></main></div>;
}
