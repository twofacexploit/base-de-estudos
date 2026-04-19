import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 mb-6">
        <span className="font-mono text-[11px] uppercase tracking-wider text-accent/70">404</span>
      </div>
      <h1 className="heading-tight text-4xl font-bold text-fg">Página não encontrada</h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-fg-muted">
        O caminho que você procurou não existe — ou foi movido. Tente pela página inicial ou pela busca.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl border border-accent/20 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent transition-all hover:border-accent/40 hover:bg-accent/15 hover:shadow-glow-green-sm"
        >
          Ir para o início
        </Link>
        <Link
          href="/busca"
          className="rounded-xl border border-border bg-bg-card px-5 py-2.5 text-sm font-medium text-fg-muted transition-all hover:border-border-strong hover:text-fg"
        >
          Buscar tópicos
        </Link>
      </div>
    </main>
  );
}
