import Link from "next/link";
import { BLOCKS, TOTAL_TOPICS } from "@/lib/blocks";
import { BlockIcon } from "./BlockIcon";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border-subtle">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-accent/20 bg-accent/10 font-mono text-[11px] font-semibold text-accent transition-all group-hover:border-accent/40 group-hover:shadow-glow-green-sm">
                BE
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-fg group-hover:text-accent transition-colors">
                Base de Estudos
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
              {TOTAL_TOPICS} tópicos sobre Tecnologia, IA e Cibersegurança — explicados para todo mundo.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-accent/15 bg-accent/5 px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-glow-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-accent/80">
                v1.0 · Online
              </span>
            </div>
          </div>

          {/* Blocos 1-4 */}
          <div className="col-span-1">
            <p className="label mb-4">Blocos</p>
            <ul className="space-y-2.5">
              {BLOCKS.slice(0, 4).map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/bloco/${b.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    <span style={{ color: b.color }}>
                      <BlockIcon iconKey={b.iconKey} size={13} />
                    </span>
                    {b.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blocos 5-7 */}
          <div className="col-span-1">
            <p className="label mb-4">&nbsp;</p>
            <ul className="space-y-2.5">
              {BLOCKS.slice(4).map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/bloco/${b.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
                  >
                    <span style={{ color: b.color }}>
                      <BlockIcon iconKey={b.iconKey} size={13} />
                    </span>
                    {b.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navegar */}
          <div className="col-span-1">
            <p className="label mb-4">Navegar</p>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/busca", label: "Buscar" },
                { href: "/glossario", label: "Glossário" }
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-fg-muted transition-colors hover:text-fg">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border-subtle pt-6 sm:flex-row sm:items-center">
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
            Base pessoal de estudos
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-fg-faint">
            Construído com Next.js
          </span>
        </div>
      </div>
    </footer>
  );
}
