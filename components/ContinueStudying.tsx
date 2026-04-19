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

export function ContinueStudying({
  topics,
  blocksById
}: {
  topics: TopicSummary[];
  blocksById: Record<string, Block>;
}) {
  const mounted = useMounted();
  const recentSlugs = useRecentSlugs();

  // Evita busca O(n) por slug ao hidratar listas grandes.
  const topicsBySlug = useMemo(
    () => new Map(topics.map((topic) => [topic.slug, topic])),
    [topics]
  );

  const recent = recentSlugs
    .map((slug) => topicsBySlug.get(slug))
    .filter((topic): topic is TopicSummary => topic !== undefined)
    .slice(0, MAX_RECENT_CARDS);

  // Evita mismatch de hidratação: só renderiza após mount no cliente.
  if (!mounted || recent.length === 0) return null;

  return (
    <section className="mt-24">
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="label">Continuar estudando</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-fg">
            Retomar de onde parou
          </h2>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {recent.map((topic) => {
          const block = blocksById[topic.block];
          if (!block) return null;
          return <RecentTopicCard key={topic.slug} topic={topic} block={block} />;
        })}
      </div>
    </section>
  );
}

function RecentTopicCard({
  topic,
  block
}: {
  topic: TopicSummary;
  block: Block;
}) {
  return (
    <Link
      href={`/topico/${topic.slug}`}
      className={cn(
        block.colorClass,
        "card card-hover group relative overflow-hidden p-5"
      )}
    >
      <div className="flex items-center justify-between">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border-subtle bg-bg-subtle"
          style={{ color: block.color }}
        >
          <BlockIcon iconKey={block.iconKey} size={14} />
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
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
    </Link>
  );
}
