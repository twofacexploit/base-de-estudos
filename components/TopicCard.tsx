import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import type { Block, TopicSummary } from "@/lib/types";
import { DifficultyBadge } from "./DifficultyBadge";
import { cn } from "@/lib/cn";

export function TopicCard({
  topic,
  block,
  studied
}: {
  topic: TopicSummary;
  block: Block;
  studied: boolean;
}) {
  return (
    <Link
      href={`/topico/${topic.slug}`}
      className={cn(
        block.colorClass,
        "card card-hover group relative flex h-full flex-col overflow-hidden p-5"
      )}
    >
      {/* Linha lateral colorida no hover */}
      <div
        className="absolute inset-y-0 left-0 w-[2px] scale-y-0 transition-transform duration-300 group-hover:scale-y-100 origin-top"
        style={{ background: block.color }}
        aria-hidden
      />

      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          {topic.number}
        </span>
        {studied && (
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full"
            style={{ background: `${block.color}20`, color: block.color }}
            aria-label="Estudado"
            title="Estudado"
          >
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </span>
        )}
      </div>

      <h3 className="mt-3 text-[15px] font-semibold leading-snug tracking-tight text-fg">
        {topic.title}
      </h3>

      {topic.excerpt && (
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-fg-muted">
          {topic.excerpt}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-5">
        <DifficultyBadge level={topic.difficulty} />
        <ArrowRight
          className="h-4 w-4 text-fg-faint transition-all group-hover:translate-x-0.5 group-hover:text-fg"
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
    </Link>
  );
}
