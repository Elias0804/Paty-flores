import Link from "next/link";

const categories = [
  {
    name: "Plantas",
    description: "Escolhas verdes para alegrar quartos, varandas e ambientes.",
    accent: "from-[#dff3d4] via-[#edf8e6] to-[#f5f8ef]",
  },
  {
    name: "Vasos",
    description: "Peças com personalidade para combinar com cada espaço.",
    accent: "from-[#fce6b2] via-[#fff2d0] to-[#fefcf5]",
  },
  {
    name: "Arranjos",
    description: "Composições florais ideais para presentear e decorar.",
    accent: "from-[#f7d9d0] via-[#fff0ef] to-[#fffaf8]",
  },
  {
    name: "Buquês",
    description: "Flores frescas e encantadoras para momentos especiais.",
    accent: "from-[#f5e7bc] via-[#fff7da] to-[#fffdf8]",
  },
  {
    name: "Presentes",
    description: "Detalhes que transformam qualquer gesto em uma lembrança especial.",
    accent: "from-[#d8f0df] via-[#edfdf4] to-[#f9fff9]",
  },
  {
    name: "Personalizados",
    description: "Criações feitas sob medida para cada ocasião e estilo.",
    accent: "from-[#f3d9e7] via-[#fff3f8] to-[#fffafc]",
  },
];

const products = [
  {
    name: "Buquê de Rosas",
    category: "Arranjo",
    price: "R$ 89,90",
    tag: "Mais vendido",
    accent: "from-[#fce5c8] via-[#f9d9d1] to-[#fff7f4]",
  },
  {
    name: "Jardim de Mesa",
    category: "Plantas",
    price: "R$ 129,90",
    tag: "Novo",
    accent: "from-[#d9f0d3] via-[#ebf8e8] to-[#fdfefb]",
  },
  {
    name: "Vaso Cerâmico",
    category: "Vasos",
    price: "R$ 74,50",
    tag: "Popular",
    accent: "from-[#f7dfae] via-[#fff0d7] to-[#fffdf7]",
  },
  {
    name: "Kit Presente",
    category: "Presentes",
    price: "R$ 159,90",
    tag: "Premium",
    accent: "from-[#f6dfe8] via-[#fff0f7] to-[#fffafc]",
  },
];

const careTips = [
  "Regue conforme o nível de luz e clima do ambiente.",
  "Use vasos com boa drenagem para plantas mais sensíveis.",
  "Mantenha as flores em local fresco e longe de calor direto.",
];

const flowerDecor = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  left: `${(index * 13) % 100}%`,
  top: `${(index * 19) % 80}%`,
  scale: 0.8 + (index % 3) * 0.25,
  delay: `${index * 0.2}s`,
}));

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7f4f0] text-[#2d1d1e]">
      <div className="botanical-bg" aria-hidden="true" />

      <header className="relative z-10 mx-auto w-full max-w-7xl px-4 py-5 md:px-8">
        <div className="rounded-full border border-[#e5d9b1] bg-[rgba(255,252,247,0.9)] px-4 shadow-[0_10px_30px_rgba(93,73,43,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <div className="brand-mark-header" aria-label="Paty Flores logo">
                <div className="brand-mark-header__outer" />
                <div className="brand-mark-header__inner">
                  <span className="brand-mark-header__letter">P</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#8a6a2d]">
                  Paty Flores
                </p>
                <p className="text-sm font-medium text-[#4a2d2f]">Floricultura & presentes</p>
              </div>
            </div>

            <nav className="hidden items-center gap-7 text-sm font-medium text-[#513d3d] md:flex">
              <a href="#colecoes" className="transition hover:text-[#2d1d1e]">
                Coleções
              </a>
              <a href="#ofertas" className="transition hover:text-[#2d1d1e]">
                Ofertas
              </a>
              <a href="#cuidar" className="transition hover:text-[#2d1d1e]">
                Cuidados
              </a>
              <a href="#pagamento" className="transition hover:text-[#2d1d1e]">
                Pagamento
              </a>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/login" className="hidden rounded-full border border-[#e5d9b1] bg-white px-4 py-2 text-sm font-semibold text-[#2d1d1e] md:inline-flex">
                Entrar
              </Link>
              <Link href="/carrinho" className="inline-flex items-center gap-2 rounded-full bg-[#2d1d1e] px-4 py-2 text-sm font-semibold text-[#fffaf5] transition hover:bg-[#4b2a2d]">
                Carrinho
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f3d77d] text-xs font-bold text-[#2d1d1e]">
                  0
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 md:px-8">
        <section className="grid gap-10 pb-14 pt-2 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12 lg:pt-8">
          <div>
            <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#7b651d]">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#e3b82e]" />
              Loja oficial
            </div>

            <h1 className="max-w-xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] text-[#241819] md:text-6xl">
              Flores, plantas e
              <span className="block text-[#c79f31]">presentes com alma.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#5a4445]">
              Descubra plantas, vasos, arranjos, buquês e presentes especiais para decorar,
              surpreender e transformar cada momento em uma experiência acolhedora.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/produtos"
                className="rounded-full bg-[#e0b63b] px-6 py-3 text-center text-sm font-semibold text-[#1a0f10] shadow-[0_12px_24px_rgba(224,182,59,0.28)] transition hover:bg-[#d2a225]"
              >
                Comprar agora
              </Link>
              <Link
                href="/checkout"
                className="rounded-full border border-[#d9c074] bg-white px-6 py-3 text-center text-sm font-semibold text-[#2d1d1e] transition hover:border-[#8b6f20] hover:text-[#8b6f20]"
              >
                Ver pagamentos
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "Entrega em até 48h",
                "Pagamento por cartão",
                "Cliente cadastrado",
                "Frete por região",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#efdca8] bg-[#fffdf8] px-3 py-1.5 text-xs font-medium text-[#5a4445]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <img
              src="/logo-paty-flores.svg"
              alt="Paty Flores logo"
              className="h-auto w-full max-w-[720px] drop-shadow-[0_25px_35px_rgba(77,47,26,0.18)]"
            />
          </div>
        </section>

        <section className="mb-14 grid gap-4 md:grid-cols-3">
          {[
            { label: "Frete grátis", value: "acima de R$ 149" },
            { label: "Pagamento seguro", value: "cartão, pix e boleto" },
            { label: "Atendimento", value: "suporte ao cliente" },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.5rem] border border-[#eadbb0] bg-white p-5 text-center shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8a6a2d]">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-[#2d1d1e]">{item.value}</p>
            </div>
          ))}
        </section>

        <section id="colecoes" className="mb-14">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8d6b24]">
                Categorias
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#201617]">
                Escolha o que combina com você
              </h2>
            </div>
            <Link href="/produtos" className="hidden text-sm font-semibold text-[#8b6f20] md:inline-flex">
              Ver todas →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <Link key={category.name} href={`/produtos?categoria=${encodeURIComponent(category.name)}`} className="rounded-[1.8rem] border border-[#ecdca6] bg-white p-5 shadow-[0_18px_40px_rgba(122,101,44,0.06)] transition hover:-translate-y-1">
                <div className={`h-36 rounded-[1.3rem] bg-gradient-to-br ${category.accent}`} />
                <div className="mt-5">
                  <h3 className="text-xl font-semibold text-[#201617]">{category.name}</h3>
                  <p className="mt-3 text-base leading-7 text-[#5f4a49]">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="ofertas" className="mb-14">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8d6b24]">
                Destaques
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#201617]">
                Mais vendidos da semana
              </h2>
            </div>
            <Link href="/produtos" className="hidden text-sm font-semibold text-[#8b6f20] md:inline-flex">
              Ver coleção completa →
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <article key={product.name} className="overflow-hidden rounded-[1.8rem] border border-[#eadcb1] bg-white shadow-[0_18px_36px_rgba(78,63,36,0.06)]">
                <div className={`h-52 bg-gradient-to-br ${product.accent}`} />
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-[#f5e7aa] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#785f16]">
                      {product.tag}
                    </span>
                    <span className="text-lg font-bold text-[#2d1d1e]">{product.price}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#201617]">{product.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8a6a2d]">{product.category}</p>
                  <p className="mt-2 text-sm leading-6 text-[#5f4a49]">
                    Produto cuidadosamente selecionado para decorar e surpreender.
                  </p>

                  <Link href="/produtos" className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#2d1d1e] px-4 py-3 text-sm font-semibold text-[#fffaf5] transition hover:bg-[#4b2a2d]">
                    Adicionar ao carrinho
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="cuidar" className="mb-14 rounded-[2rem] border border-[#eadcb1] bg-[#fffdf8] p-6 shadow-[0_18px_36px_rgba(87,63,30,0.06)] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8d6b24]">
                Aprenda a cuidar
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-[#201617]">
                Plantas que vivem felizes no seu espaço
              </h2>
            </div>

            <div className="space-y-4">
              {careTips.map((tip) => (
                <div key={tip} className="flex items-start gap-3 rounded-2xl border border-[#efdca8] bg-white p-4">
                  <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#f5e7aa] text-sm font-bold text-[#6d5118]">
                    ✓
                  </span>
                  <p className="text-base leading-7 text-[#5f4a49]">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pagamento" className="grid gap-6 pb-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-[#eadcb1] bg-[#fffdf9] p-6 shadow-[0_18px_36px_rgba(87,63,30,0.06)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#8d6b24]">
                  Login do cliente
                </p>
                <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#201617]">
                  Acesse sua conta
                </h2>
              </div>
              <span className="rounded-full bg-[#f4e6a5] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#6c5518]">
                Cliente
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-[#4c3b3d]">
                E-mail
                <input
                  type="email"
                  defaultValue="cliente@patyflores.com"
                  className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-white px-4 py-3 text-[#2d1d1e] outline-none"
                />
              </label>

              <label className="text-sm font-medium text-[#4c3b3d]">
                Senha
                <input
                  type="password"
                  defaultValue="********"
                  className="mt-2 w-full rounded-2xl border border-[#eadbb1] bg-white px-4 py-3 text-[#2d1d1e] outline-none"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <Link href="/login" className="rounded-full bg-[#e0b63b] px-5 py-3 text-sm font-semibold text-[#1a0f10] transition hover:bg-[#d2a225]">
                Entrar na conta
              </Link>
              <Link href="/cadastro" className="rounded-full border border-[#d9c074] bg-white px-5 py-3 text-sm font-semibold text-[#2d1d1e] transition hover:border-[#8b6f20] hover:text-[#8b6f20]">
                Criar conta
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#eadcb1] bg-[#2a1d1f] p-6 text-[#f9f2ee] shadow-[0_18px_36px_rgba(52,31,29,0.12)]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#e5d36d]">
                  Carrinho
                </p>
                <h3 className="mt-2 text-2xl font-semibold">Resumo do pedido</h3>
              </div>
              <span className="rounded-full bg-[#f3d77d] px-3 py-1 text-xs font-bold text-[#2d1d1e]">
                2 itens
              </span>
            </div>

            <div className="space-y-4">
              {[
                { name: "Buquê de Rosas", qty: 1, price: "R$ 89,90" },
                { name: "Vaso Cerâmico", qty: 1, price: "R$ 74,50" },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-2xl border border-[#4d3639] bg-[#382427] p-3">
                  <div>
                    <p className="font-medium text-[#f7f0ed]">{item.name}</p>
                    <p className="text-sm text-[#d9bfb9]">Qtd: {item.qty}</p>
                  </div>
                  <p className="font-semibold text-[#f7f0ed]">{item.price}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-[#4d3639] pt-4 text-sm text-[#f2e8e5]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>R$ 164,40</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de entrega</span>
                <span>R$ 18,90</span>
              </div>
              <div className="flex justify-between">
                <span>Desconto</span>
                <span>-R$ 0,00</span>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-[#f6ecbe] p-4 text-[#2d1d1e]">
              <div className="flex items-center justify-between text-lg font-semibold">
                <span>Total</span>
                <span>R$ 183,30</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#e5d36d]">
                Pagamento
              </p>
              <div className="flex gap-2">
                {['Visa', 'Mastercard', 'Pix', 'Boleto'].map((method) => (
                  <span key={method} className="rounded-full border border-[#5d4044] bg-[#382427] px-3 py-1.5 text-xs font-medium text-[#f8efed]">
                    {method}
                  </span>
                ))}
              </div>
            </div>

            <Link href="/checkout" className="mt-6 block w-full rounded-full bg-[#f3d77d] px-5 py-3 text-center text-sm font-bold text-[#2d1d1e] transition hover:bg-[#e2ba4f]">
              Finalizar compra
            </Link>
          </aside>
        </section>
      </main>

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-between gap-4 border-t border-[#ead7a7] px-4 py-8 text-sm text-[#664f4f] md:flex-row md:items-center md:px-8">
        <p>© 2026 Paty Flores</p>
        <div className="flex flex-wrap gap-5">
          <a href="#colecoes" className="transition hover:text-[#2d1d1e]">Coleções</a>
          <a href="#ofertas" className="transition hover:text-[#2d1d1e]">Ofertas</a>
          <a href="#pagamento" className="transition hover:text-[#2d1d1e]">Pagamento</a>
          <a href="#cuidar" className="transition hover:text-[#2d1d1e]">Cuidados</a>
        </div>
      </footer>
    </div>
  );
}
