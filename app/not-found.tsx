import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-fg-subtle">
        404
      </p>
      <h1 className="mt-3 text-4xl font-bold">Página não encontrada</h1>
      <p className="mt-3 max-w-md text-fg-muted">
        O caminho que você procurou não existe — ou foi movido. Tente pela
        página inicial ou pela busca.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg border border-border-strong bg-bg-card px-4 py-2 text-sm font-medium text-fg transition hover:bg-bg-hover"
        >
          Ir para o início
        </Link>
        <Link
          href="/busca"
          className="rounded-lg border border-border bg-bg-card px-4 py-2 text-sm text-fg-muted transition hover:text-fg"
        >
          Buscar tópicos
        </Link>
      </div>
    </main>
  );
}
