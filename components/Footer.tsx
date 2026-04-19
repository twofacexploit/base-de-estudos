import Link from "next/link";
import type { Block } from "@/lib/types";
import { BLOCKS, TOTAL_TOPICS } from "@/lib/blocks";
import { BlockIcon } from "./BlockIcon";

// Divide os blocos em duas colunas visuais no footer.
const BLOCKS_COLUMN_SIZE = Math.ceil(BLOCKS.length / 2);
const FIRST_COLUMN = BLOCKS.slice(0, BLOCKS_COLUMN_SIZE);
const SECOND_COLUMN = BLOCKS.slice(BLOCKS_COLUMN_SIZE);

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border-subtle bg-bg">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <Brand />

          <BlockColumn label="Blocos" blocks={FIRST_COLUMN} />
          <BlockColumn blocks={SECOND_COLUMN} />

          <NavColumn />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border-subtle pt-6 font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:flex-row sm:items-center">
          <span>Base pessoal de estudos</span>
          <span>Construído com Next.js</span>
        </div>
      </div>
    </footer>
  );
}

function Brand() {
  return (
    <div className="col-span-2 md:col-span-1">
      <Link
        href="/"
        className="flex items-center gap-2 font-semibold tracking-tight"
      >
        <span className="grid h-7 w-7 place-items-center rounded-md border border-border-subtle bg-bg-elevated font-mono text-[11px] text-fg-muted">
          BE
        </span>
        <span className="text-fg">Base de Estudos</span>
      </Link>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-fg-muted">
        {TOTAL_TOPICS} tópicos sobre Tecnologia, IA e Cibersegurança,
        organizados em 7 blocos temáticos.
      </p>
    </div>
  );
}

function BlockColumn({ label, blocks }: { label?: string; blocks: Block[] }) {
  return (
    <div className="col-span-1">
      {label ? <p className="label mb-4">{label}</p> : <div className="mb-4 h-[11px]" aria-hidden />}
      <ul className="space-y-2">
        {blocks.map((block) => (
          <li key={block.id}>
            <Link
              href={`/bloco/${block.slug}`}
              className="group inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-fg"
            >
              <span style={{ color: block.color }}>
                <BlockIcon iconKey={block.iconKey} size={14} />
              </span>
              {block.shortName}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NavColumn() {
  return (
    <div className="col-span-1">
      <p className="label mb-4">Navegar</p>
      <ul className="space-y-2 text-sm">
        <li>
          <Link
            href="/busca"
            className="text-fg-muted transition-colors hover:text-fg"
          >
            Buscar
          </Link>
        </li>
        <li>
          <Link
            href="/glossario"
            className="text-fg-muted transition-colors hover:text-fg"
          >
            Glossário
          </Link>
        </li>
      </ul>
    </div>
  );
}
