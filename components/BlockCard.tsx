import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Block } from "@/lib/types";
import { BlockIcon } from "./BlockIcon";
import { ProgressBar } from "./ProgressBar";
import { cn } from "@/lib/cn";

export function BlockCard({
  block,
  studied,
  total
}: {
  block: Block;
  studied: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((studied / total) * 100) : 0;

  return (
    <Link
      href={`/bloco/${block.slug}`}
      className={cn(
        block.colorClass,
        "card card-hover card-accent-line group relative flex h-full flex-col overflow-hidden p-6"
      )}
    >
      {/* Glow de fundo sutil no hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${block.color}08, transparent)`
        }}
        aria-hidden
      />

      <div className="relative flex items-start justify-between">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200 group-hover:scale-105"
          style={{
            color: block.color,
            borderColor: `${block.color}30`,
            background: `${block.color}10`
          }}
        >
          <BlockIcon iconKey={block.iconKey} size={19} strokeWidth={1.75} />
        </div>
        <ArrowUpRight
          className="h-4 w-4 text-fg-faint transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>

      <div className="relative mt-5 flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        <span>Bloco {String(block.number).padStart(2, "0")}</span>
        <span className="text-fg-faint">·</span>
        <span>{total} tópicos</span>
      </div>

      <h3 className="relative mt-2 text-[17px] font-semibold tracking-tight text-fg">
        {block.name}
      </h3>

      <p className="relative mt-2 line-clamp-3 text-[13px] leading-relaxed text-fg-muted">
        {block.description}
      </p>

      <div className="relative mt-auto pt-6">
        <ProgressBar value={studied} total={total} color={block.color} />
        <div className="mt-2.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          <span>
            <span className="text-fg font-medium">{studied}</span>
            <span className="text-fg-faint"> / {total}</span>
          </span>
          <span style={{ color: pct > 0 ? block.color : undefined }}>{pct}%</span>
        </div>
      </div>
    </Link>
  );
}
