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
        "card card-hover group relative flex h-full flex-col overflow-hidden p-6"
      )}
    >
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60 transition-opacity group-hover:opacity-100"
        style={{
          background: `linear-gradient(to right, transparent, ${block.color}, transparent)`
        }}
        aria-hidden
      />

      <div className="flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border-subtle bg-bg-subtle transition-colors"
          style={{ color: block.color }}
        >
          <BlockIcon iconKey={block.iconKey} size={18} strokeWidth={1.75} />
        </div>
        <ArrowUpRight
          className="h-4 w-4 text-fg-faint transition-all group-hover:text-fg group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>

      <div className="mt-5 flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        <span>Bloco {String(block.number).padStart(2, "0")}</span>
        <span className="text-fg-faint">·</span>
        <span>{total} tópicos</span>
      </div>

      <h3 className="mt-2 text-lg font-semibold tracking-tight text-fg">
        {block.name}
      </h3>

      <p className="mt-1.5 line-clamp-3 text-[13px] leading-relaxed text-fg-muted">
        {block.description}
      </p>

      <div className="mt-auto pt-6">
        <ProgressBar value={studied} total={total} color={block.color} />
        <div className="mt-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
          <span>
            <span className="text-fg">{studied}</span>
            <span className="text-fg-faint"> / {total}</span>
          </span>
          <span>{pct}%</span>
        </div>
      </div>
    </Link>
  );
}
