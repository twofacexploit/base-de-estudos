"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Block, TopicSummary } from "@/lib/types";
import { useMounted, useRecentSlugs } from "@/lib/useProgress";
import { DifficultyBadge } from "./DifficultyBadge";
import { BlockIcon } from "./BlockIcon";
import { cn } from "@/lib/cn";

const MAX_RECENT_CARDS = 3;

export function ContinueStudying({ topics, blocksById }: { topics: TopicSummary[]; blocksById: Record<string, Block> }) {
  const mounted = useMounted();
  const recentSlugs = useRecentSlugs();

  const topicsBySlug = useMemo(
    () => new Map(topics.map((t) => [t.slug, t])),
    [topics]
  );

  const recent = recentSlugs
    .map((slug) => topicsBySlug.get(slug))
    .filter((t): t is TopicSummary => t !== undefined)
    .slice(0, MAX_RECENT_CARDS);

  if (!mounted || recent.length === 0) return null;

  return (
    <section className="mt-24">
      <div className="mb-8">
        <p className="label">Continuar estudando</p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-fg">
          Retomar de onde parou
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {recent.map((topic) => {
          const block = blocksById[topic.block];
          if (!block) return null;
          return (
            <Link
              key={topic.slug}
              href={`/topico/${topic.slug}`}
              className={cn(block.colorClass, "card card-hover card-accent-line group relative overflow-hidden p-5")}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all group-hover:scale-105"
                  style={{ color: block.color, borderColor: `${block.color}30`, background: `${block.color}10` }}
                >
                  <BlockIcon iconKey={block.iconKey} size={15} />
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                  {topic.number}
                </span>
              </div>
              <p className="mt-4 line-clamp-2 text-sm font-semibold leading-snug text-fg">
                {topic.title}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <DifficultyBadge level={topic.difficulty} />
                <ArrowRight
                  className="h-3.5 w-3.5 text-fg-faint transition-all group-hover:translate-x-0.5 group-hover:text-fg"
                  strokeWidth={1.75} aria-hidden
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
