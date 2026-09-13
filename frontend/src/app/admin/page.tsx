"use client";

import { FormEvent, startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
};

type UserSession = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
};

type AdminOrder = {
  id: string;
  status: string;
  total: number | string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  items: { id: string; name: string; quantity: number }[];
};

type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count: { orders: number };
};

const EMPTY_PRODUCT: Product = {
  name: "",
  description: "",
  price: 0,
  category: "",
  stock: 0,
  imageUrl: "",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [form, setForm] = useState<Product>(EMPTY_PRODUCT);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loginData, setLoginData] = useState({ email: "admin@patyflores.com", password: "admin123" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "" });
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("paty_token");
    const storedUser = localStorage.getItem("paty_user");

    if (!storedToken || !storedUser) {
      router.replace("/login");
      return;
    }

    try {
      const storedSession = JSON.parse(storedUser) as UserSession;
      if (storedSession.role !== "ADMIN") {
        router.replace("/conta");
        return;
      }

      startTransition(() => {
        setToken(storedToken);
        setSession(storedSession);
        setAuthChecked(true);
      });
    } catch {
      localStorage.removeItem("paty_token");
      localStorage.removeItem("paty_user");
      router.replace("/login");
    }
  }, [router]);

  const isAdmin = useMemo(() => session?.role === "ADMIN", [session]);

  async function fetchProducts(currentToken: string) {
    try {
      const response = await fetch(`${API_URL}/api/products`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        return;
      }

      setProducts([
        {
          id: "demo-1",
          name: "Buquê de Rosas",
          description: "Buquê clássico para presentes e celebrações.",
          price: 89.9,
          category: "Arranjos",
          stock: 12,
          imageUrl: "/logo-paty-flores.svg",
        },
        {
          id: "demo-2",
          name: "Vaso Cerâmico",
          description: "Vaso decorativo para plantas e ambientes.",
          price: 74.5,
          category: "Vasos",
          stock: 8,
          imageUrl: "/logo-paty-flores.svg",
        },
      ]);
    } catch {
      setProducts([
        {
          id: "demo-1",
          name: "Buquê de Rosas",
          description: "Buquê clássico para presentes e celebrações.",
          price: 89.9,
          category: "Arranjos",
          stock: 12,
          imageUrl: "/logo-paty-flores.svg",
        },
      ]);
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch(`${API_URL}/api/categories`);
      if (response.ok) setCategories(await response.json());
    } catch {
      setCategories([]);
    }
  }

  async function fetchOrders(currentToken: string) {
    try {
      const response = await fetch(`${API_URL}/api/orders`, { headers: { Authorization: `Bearer ${currentToken}` } });
      if (response.ok) setOrders(await response.json());
    } catch {
      setOrders([]);
    }
  }

  async function fetchCustomers(currentToken: string) {
    try {
      const response = await fetch(`${API_URL}/api/customers`, { headers: { Authorization: `Bearer ${currentToken}` } });
      if (response.ok) setCustomers(await response.json());
    } catch {
      setCustomers([]);
    }
  }

  useEffect(() => {
    if (!token || !session) return;

    startTransition(() => {
      fetchProducts(token);
      fetchCategories();
      if (session.role === "ADMIN") {
        fetchOrders(token);
        fetchCustomers(token);
      }
    });
  }, [token, session]);

  async function updateOrderStatus(id: string, status: string) {
    if (!token) return;
    const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      const updated = await response.json();
      setOrders((current) => current.map((order) => (order.id === id ? updated : order)));
      setStatus("Status do pedido atualizado.");
    }
  }

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus("Entrando...");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao entrar.");
      }

      const user = result.user as UserSession;
      localStorage.setItem("paty_token", result.token);
      localStorage.setItem("paty_user", JSON.stringify(user));
      setToken(result.token);
      setSession(user);
      setStatus(`Login realizado como ${user.role}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro ao entrar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus("Cadastrando cliente...");

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao cadastrar.");
      }

      setStatus(`Cliente cadastrado com sucesso. Agora faça login.`);
      setRegisterData({ name: "", email: "", password: "" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro ao cadastrar cliente.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitProduct(event: FormEvent) {
    event.preventDefault();
    if (!token) return;

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      const url = editingId ? `${API_URL}/api/products/${editingId}` : `${API_URL}/api/products`;
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao salvar produto.");
      }

      setStatus(editingId ? "Produto atualizado." : "Produto cadastrado.");
      setForm(EMPTY_PRODUCT);
      setEditingId(null);
      setProducts((current) => {
        if (editingId) {
          return current.map((item) => (item.id === editingId ? result : item));
        }
        return [result, ...current];
      });
      if (!categories.includes(result.category)) setCategories((current) => [...current, result.category].sort());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro ao salvar produto.");
    }
  }

  async function handleImageChange(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Escolha um arquivo de imagem.");
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setStatus("A foto deve ter no máximo 12 MB.");
      return;
    }

    const image = new Image();
    const reader = new FileReader();
    reader.onload = () => {
      image.src = String(reader.result);
      image.onload = () => {
        const maxSize = 1400;
        const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
        setForm((current) => ({ ...current, imageUrl: canvas.toDataURL("image/jpeg", 0.82) }));
        setStatus("Imagem pronta para o produto.");
      };
    };
    reader.readAsDataURL(file);
  }

  function handleEdit(product: Product) {
    setEditingId(product.id ?? null);
    setCreatingCategory(false);
    setForm(product);
  }

  async function handleDelete(id?: string) {
    if (!id || !token) return;

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir produto.");
      }

      setProducts((current) => current.filter((product) => product.id !== id));
      setStatus("Produto removido.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erro ao remover produto.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("paty_token");
    localStorage.removeItem("paty_user");
    setToken(null);
    setSession(null);
    setStatus("Sessão encerrada.");
  }

  const orderGroups = [
    { key: "PENDING", label: "Pedidos recebidos" },
    { key: "CONFIRMED", label: "Pedidos confirmados" },
    { key: "PREPARING", label: "Pedidos em preparo" },
    { key: "OUT_FOR_DELIVERY", label: "Pedidos a caminho" },
    { key: "DELIVERED", label: "Pedidos realizados" },
    { key: "CANCELLED", label: "Pedidos cancelados" },
  ];

  if (!authChecked || !session || !isAdmin) return null;

  return (
    <main className="min-h-screen bg-[#faf7f2] p-6 text-[#1f1a1b]">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[28px] border border-[#ebd8a2] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8d6f1d]">Administrativo</p>
              <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">Dashboard Paty Flores</h1>
            </div>

            {session ? (
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-[#f5e7aa] px-3 py-2 text-sm font-semibold text-[#4d3411]">
                  {session.role}
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-[#2d1d1e] px-4 py-2 text-sm font-semibold text-white"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="rounded-full border border-[#efdca8] bg-[#fffdf8] px-3 py-2 text-sm font-medium text-[#4c3b3d]">
                Acesso restrito
              </div>
            )}
          </div>
        </header>

        {!session ? (
          <section className="overflow-hidden rounded-[32px] border border-[#ebd8a2] bg-white shadow-[0_24px_70px_rgba(83,57,19,0.1)] lg:grid lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative overflow-hidden bg-[#302021] p-7 text-[#fffaf5] sm:p-10">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full border-[22px] border-[#e0b63b]/25" />
              <div className="relative z-10 flex h-full flex-col">
                <img src="/logo-paty-flores.svg" alt="Paty Flores" className="h-auto w-48 brightness-0 invert" />
                <p className="mt-12 text-xs font-bold uppercase tracking-[0.24em] text-[#f1d36d]">Sua loja de flores</p>
                <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-tight">Flores para celebrar o que importa.</h2>
                <p className="mt-4 max-w-sm text-sm leading-7 text-[#eadfdb]">
                  Entre para acompanhar seus pedidos ou crie uma conta para salvar seus dados e comprar com mais facilidade.
                </p>
                <ul className="mt-auto space-y-3 pt-10 text-sm text-[#fff4e9]">
                  {['Acompanhe seus pedidos', 'Finalize sua compra com agilidade', 'Receba novidades e ofertas'].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e0b63b] text-xs font-bold text-[#302021]">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex rounded-2xl bg-[#faf7f2] p-1" role="tablist" aria-label="Autenticação">
                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === "login"}
                  onClick={() => { setAuthMode("login"); setStatus(""); setShowPassword(false); }}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${authMode === "login" ? "bg-white text-[#2d1d1e] shadow-sm" : "text-[#806b6b]"}`}
                >
                  Entrar
                </button>
              </div>

              {authMode === "login" ? (
                <form onSubmit={handleLogin} className="mt-8" aria-label="Entrar na conta">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d6f1d]">Bem-vindo de volta</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Acesse sua conta</h2>
                  <p className="mt-2 text-sm leading-6 text-[#806b6b]">Use seus dados para continuar sua experiência na Paty Flores.</p>

                  <div className="mt-7 space-y-4">
                    <label className="block text-sm font-semibold text-[#4c3b3d]">
                      E-mail
                      <input
                        required
                        autoComplete="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData((current) => ({ ...current, email: e.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3.5 outline-none transition focus:border-[#c69d2f] focus:ring-4 focus:ring-[#f5e7aa]"
                        type="email"
                        placeholder="voce@email.com"
                      />
                    </label>

                    <label className="block text-sm font-semibold text-[#4c3b3d]">
                      Senha
                      <span className="relative mt-2 block">
                        <input
                          required
                          autoComplete="current-password"
                          value={loginData.password}
                          onChange={(e) => setLoginData((current) => ({ ...current, password: e.target.value }))}
                          className="w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3.5 pr-20 outline-none transition focus:border-[#c69d2f] focus:ring-4 focus:ring-[#f5e7aa]"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                        />
                        <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 px-2 text-xs font-semibold text-[#8d6f1d]">
                          {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                      </span>
                    </label>
                  </div>

                  <button type="submit" disabled={loading} className="mt-7 w-full rounded-2xl bg-[#e0b63b] px-5 py-3.5 text-sm font-bold text-[#1a0f10] transition hover:bg-[#d2a225] disabled:cursor-wait disabled:opacity-60">
                    {loading ? "Entrando..." : "Entrar na minha conta"}
                  </button>
                  <p className="mt-4 text-center text-xs text-[#806b6b]">Este acesso é exclusivo para administradores da loja.</p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="mt-8" aria-label="Criar conta de cliente">
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d6f1d]">Primeira visita?</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">Crie sua conta</h2>
                  <p className="mt-2 text-sm leading-6 text-[#806b6b]">Cadastre-se gratuitamente para comprar e acompanhar seus pedidos.</p>

                  <div className="mt-7 space-y-4">
                    <label className="block text-sm font-semibold text-[#4c3b3d]">
                      Nome completo
                      <input required minLength={2} autoComplete="name" value={registerData.name} onChange={(e) => setRegisterData((current) => ({ ...current, name: e.target.value }))} className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3.5 outline-none transition focus:border-[#c69d2f] focus:ring-4 focus:ring-[#f5e7aa]" type="text" placeholder="Como podemos chamar você?" />
                    </label>
                    <label className="block text-sm font-semibold text-[#4c3b3d]">
                      E-mail
                      <input required autoComplete="email" value={registerData.email} onChange={(e) => setRegisterData((current) => ({ ...current, email: e.target.value }))} className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3.5 outline-none transition focus:border-[#c69d2f] focus:ring-4 focus:ring-[#f5e7aa]" type="email" placeholder="voce@email.com" />
                    </label>
                    <label className="block text-sm font-semibold text-[#4c3b3d]">
                      Crie uma senha
                      <span className="relative mt-2 block">
                        <input required minLength={6} autoComplete="new-password" value={registerData.password} onChange={(e) => setRegisterData((current) => ({ ...current, password: e.target.value }))} className="w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3.5 pr-20 outline-none transition focus:border-[#c69d2f] focus:ring-4 focus:ring-[#f5e7aa]" type={showPassword ? "text" : "password"} placeholder="Mínimo de 6 caracteres" />
                        <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 px-2 text-xs font-semibold text-[#8d6f1d]">{showPassword ? "Ocultar" : "Mostrar"}</button>
                      </span>
                    </label>
                  </div>

                  <button type="submit" disabled={loading} className="mt-7 w-full rounded-2xl bg-[#2d1d1e] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#4b2a2d] disabled:cursor-wait disabled:opacity-60">
                    {loading ? "Criando sua conta..." : "Criar minha conta"}
                  </button>
                  <p className="mt-4 text-center text-xs leading-5 text-[#806b6b]">Ao continuar, você concorda em receber informações sobre seus pedidos.</p>
                </form>
              )}
            </div>
          </section>
        ) : null}

        {status ? (
          <div className="rounded-2xl border border-[#f1df9a] bg-[#fffdf5] px-4 py-3 text-sm text-[#563d10]">
            {status}
          </div>
        ) : null}

        {session && !isAdmin ? (
          <section className="rounded-[28px] border border-[#ebd8a2] bg-white p-8 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d6f1d]">Permissão necessária</p>
            <h2 className="mt-2 text-2xl font-semibold">Esta área é exclusiva do administrador.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#806b6b]">
              Sua conta de cliente está autenticada, mas não pode alterar preços, fotos ou produtos da loja.
            </p>
          </section>
        ) : null}

        {isAdmin && (
          <>
          <section className="rounded-[28px] border border-[#ebd8a2] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d6f1d]">Pedidos recentes</p>
                <h2 className="mt-2 text-2xl font-semibold">Acompanhar vendas</h2>
              </div>
              <span className="rounded-full bg-[#f5e7aa] px-3 py-2 text-xs font-bold text-[#4d3411]">{orders.length} pedidos</span>
            </div>
            <div className="space-y-3">
              {orders.length === 0 ? <p className="rounded-2xl bg-[#fffdf8] p-4 text-sm text-[#806b6b]">Ainda não existem pedidos registrados.</p> : orders.map((order) => (
                <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-[#eadbb1] p-4 md:flex-row md:items-center md:justify-between">
                  <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8d6f1d]">#{order.id.slice(-8)} · {order.customerName}</p><p className="mt-1 text-sm text-[#806b6b]">{order.customerEmail} · {order.items.reduce((total, item) => total + item.quantity, 0)} itens · R$ {Number(order.total).toFixed(2).replace(".", ",")}</p></div>
                  <select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value)} className="rounded-xl border border-[#eadbb1] bg-[#fffdf8] px-3 py-2 text-sm font-semibold"><option value="PENDING">Recebido</option><option value="CONFIRMED">Confirmado</option><option value="PREPARING">Em preparo</option><option value="OUT_FOR_DELIVERY">A caminho</option><option value="DELIVERED">Entregue</option><option value="CANCELLED">Cancelado</option></select>
                </div>
              ))}
            </div>
          </section>
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[28px] border border-[#ebd8a2] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d6f1d]">Pedidos por etapa</p>
                  <h2 className="mt-2 text-2xl font-semibold">Acompanhar pedidos</h2>
                </div>
                <span className="rounded-full bg-[#f5e7aa] px-3 py-2 text-xs font-bold text-[#4d3411]">{orders.length} total</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {orderGroups.map((group) => {
                  const groupedOrders = orders.filter((order) => order.status === group.key);
                  return (
                    <div key={group.key} className="rounded-2xl border border-[#eadbb1] bg-[#fffdf8] p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#8d6f1d]">{group.label}</p>
                      <p className="mt-2 text-2xl font-semibold">{groupedOrders.length}</p>
                      {groupedOrders.slice(0, 3).map((order) => (
                        <p key={order.id} className="mt-2 truncate text-xs text-[#806b6b]">#{order.id.slice(-8)} · {order.customerName}</p>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[28px] border border-[#ebd8a2] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d6f1d]">Clientes cadastrados</p>
                  <h2 className="mt-2 text-2xl font-semibold">Novos inscritos</h2>
                </div>
                <span className="rounded-full bg-[#f5e7aa] px-3 py-2 text-xs font-bold text-[#4d3411]">{customers.length} clientes</span>
              </div>
              <div className="mt-5 max-h-80 space-y-3 overflow-auto">
                {customers.length === 0 ? <p className="rounded-2xl bg-[#fffdf8] p-4 text-sm text-[#806b6b]">Nenhum cliente cadastrado ainda.</p> : customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between gap-3 rounded-2xl border border-[#eadbb1] p-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{customer.name}</p>
                      <p className="truncate text-sm text-[#806b6b]">{customer.email}</p>
                      <p className="mt-1 text-xs text-[#a47a16]">Cadastro em {new Date(customer.createdAt).toLocaleDateString("pt-BR")}</p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-[#806b6b]">{customer._count.orders} pedidos</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[28px] border border-[#ebd8a2] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d6f1d]">Produtos</p>
                  <h2 className="mt-2 text-2xl font-semibold">Atualizar catálogo</h2>
                </div>
                <button
                  onClick={() => {
                    setForm(EMPTY_PRODUCT);
                    setCreatingCategory(false);
                    setEditingId(null);
                  }}
                  className="rounded-full border border-[#d9c074] bg-white px-3 py-2 text-sm font-semibold text-[#2d1d1e]"
                >
                  Novo produto
                </button>
              </div>

              <form onSubmit={handleSubmitProduct} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="text-sm font-medium text-[#4c3b3d]">
                    Nome
                    <input
                      value={form.name}
                      onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3 outline-none"
                    />
                  </label>

                  <label className="text-sm font-medium text-[#4c3b3d]">
                    Categoria
                    <select
                      value={creatingCategory ? "__new__" : form.category}
                      onChange={(e) => {
                        if (e.target.value === "__new__") {
                          setCreatingCategory(true);
                          setForm((current) => ({ ...current, category: "" }));
                          return;
                        }
                        setCreatingCategory(false);
                        setForm((current) => ({ ...current, category: e.target.value }));
                      }}
                      className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3 outline-none"
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                      <option value="__new__">+ Criar nova categoria</option>
                    </select>
                    {creatingCategory ? (
                      <input
                        autoFocus
                        required
                        placeholder="Nome da nova categoria"
                        onChange={(e) => setForm((current) => ({ ...current, category: e.target.value }))}
                        className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3 outline-none"
                      />
                    ) : null}
                    <span className="mt-2 block text-xs text-[#806b6b]">Categorias existentes ficam padronizadas no catálogo.</span>
                  </label>
                </div>

                <label className="block text-sm font-medium text-[#4c3b3d]">
                  Descrição
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                    className="mt-2 min-h-[110px] w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3 outline-none"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-3">
                  <label className="text-sm font-medium text-[#4c3b3d]">
                    Preço
                    <input
                      required
                      value={form.price}
                      onChange={(e) => setForm((current) => ({ ...current, price: Number(e.target.value) }))}
                      type="number"
                      step="0.01"
                      className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3 outline-none"
                    />
                  </label>

                  <label className="text-sm font-medium text-[#4c3b3d]">
                    Estoque
                    <input
                      value={form.stock}
                      onChange={(e) => setForm((current) => ({ ...current, stock: Number(e.target.value) }))}
                      type="number"
                      className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3 outline-none"
                    />
                  </label>

                  <label className="text-sm font-medium text-[#4c3b3d]">
                    Imagem
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handleImageChange(e.target.files?.[0])}
                      className="mt-2 block w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-[#f5e7aa] file:px-3 file:py-2 file:font-semibold"
                    />
                    <input
                      type="url"
                      placeholder="Ou cole uma URL pública"
                      value={form.imageUrl?.startsWith("data:") ? "" : form.imageUrl ?? ""}
                      onChange={(e) => setForm((current) => ({ ...current, imageUrl: e.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-[#fffdf8] px-4 py-3 outline-none"
                    />
                    <span className="mt-2 block text-xs text-[#806b6b]">No celular, escolha uma foto ou abra a câmera. A imagem é reduzida antes do envio.</span>
                  </label>
                </div>

                {form.imageUrl ? (
                  <div className="rounded-2xl border border-[#eadbb1] bg-[#fffdf8] p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[#8d6f1d]">Pré-visualização</p>
                    <img src={form.imageUrl} alt="Pré-visualização do produto" className="h-32 w-full rounded-xl object-contain" />
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="w-full rounded-full bg-[#2d1d1e] px-5 py-3 text-sm font-semibold text-white"
                >
                  {editingId ? "Salvar alterações" : "Cadastrar produto"}
                </button>
              </form>
            </div>

            <div className="rounded-[28px] border border-[#ebd8a2] bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8d6f1d]">Lista</p>
              <h2 className="mt-2 text-2xl font-semibold">Catalogados</h2>

              <div className="mt-5 space-y-4">
                {products.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[#eadbb1] bg-[#fffdf8] p-5 text-sm text-[#5d4a4d]">
                    Nenhum produto cadastrado.
                  </div>
                ) : (
                  products.map((product) => (
                    <article key={product.id ?? product.name} className="rounded-2xl border border-[#eadbb1] bg-[#fffdf8] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold">{product.name}</h3>
                          {product.imageUrl ? <img src={product.imageUrl} alt="" className="mt-3 h-20 w-20 rounded-xl object-cover" /> : null}
                          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8a6a2d]">{product.category}</p>
                          <p className="mt-2 text-sm text-[#56484b]">{product.description}</p>
                          <div className="mt-3 flex gap-3 text-sm text-[#3a2d2e]">
                            <span>R$ {Number(product.price).toFixed(2)}</span>
                            <span>Estoque: {product.stock}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="rounded-full border border-[#d9c074] bg-white px-3 py-2 text-xs font-semibold text-[#2d1d1e]"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-full bg-[#d84a4a] px-3 py-2 text-xs font-semibold text-white"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>
          </section>
          </>
        )}
      </div>
    </main>
  );
}
