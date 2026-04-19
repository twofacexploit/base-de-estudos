"use client";

import { useMemo, useState } from "react";
import type { Block, Difficulty, TopicSummary } from "@/lib/types";
import { TopicCard } from "./TopicCard";
import { ProgressBar } from "./ProgressBar";
import { useStudiedSlugs } from "@/lib/useProgress";
import { cn } from "@/lib/cn";

type DifficultyFilter = "todos" | Difficulty;

const DIFFICULTY_FILTERS: { value: DifficultyFilter; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "iniciante", label: "Iniciante" },
  { value: "medio", label: "Médio" },
  { value: "avancado", label: "Avançado" }
];

export function BlockTopicList({
  block,
  topics
}: {
  block: Block;
  topics: TopicSummary[];
}) {
  const studied = useStudiedSlugs();
  const studiedSet = useMemo(() => new Set(studied), [studied]);

  const [difficulty, setDifficulty] = useState<DifficultyFilter>("todos");
  const [onlyUnstudied, setOnlyUnstudied] = useState(false);

  const studiedInBlock = useMemo(
    () => topics.filter((t) => studiedSet.has(t.slug)).length,
    [topics, studiedSet]
  );

  const filtered = useMemo(
    () =>
      topics.filter((topic) => {
        if (difficulty !== "todos" && topic.difficulty !== difficulty) {
          return false;
        }
        if (onlyUnstudied && studiedSet.has(topic.slug)) return false;
        return true;
      }),
    [topics, difficulty, onlyUnstudied, studiedSet]
  );

  return (
    <div className={cn(block.colorClass, "mt-10")}>
      <div className="mb-6 flex flex-col gap-5 border-b border-border-subtle pb-6 md:flex-row md:items-center md:justify-between">
        <BlockProgress
          block={block}
          studied={studiedInBlock}
          total={topics.length}
        />

        <div className="flex flex-wrap items-center gap-2">
          <DifficultyFilters
            selected={difficulty}
            onSelect={setDifficulty}
          />
          <UnstudiedToggle
            active={onlyUnstudied}
            onToggle={() => setOnlyUnstudied((prev) => !prev)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((topic) => (
            <TopicCard
              key={topic.slug}
              topic={topic}
              block={block}
              studied={studiedSet.has(topic.slug)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BlockProgress({
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
    <div className="flex-1 md:max-w-sm">
      <div className="mb-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
        <span>
          <span className="text-fg">{studied}</span> / {total} estudados
        </span>
        <span>{pct}%</span>
      </div>
      <ProgressBar value={studied} total={total} color={block.color} />
    </div>
  );
}

function DifficultyFilters({
  selected,
  onSelect
}: {
  selected: DifficultyFilter;
  onSelect: (value: DifficultyFilter) => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-border-subtle bg-bg-subtle p-0.5">
      {DIFFICULTY_FILTERS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={cn(
            "rounded-[5px] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
            selected === option.value
              ? "bg-bg-elevated text-fg"
              : "text-fg-muted hover:text-fg"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function UnstudiedToggle({
  active,
  onToggle
}: {
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "rounded-md border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors",
        active
          ? "border-border-strong bg-bg-elevated text-fg"
          : "border-border-subtle bg-bg-subtle text-fg-muted hover:text-fg"
      )}
    >
      Não estudados
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-border p-12 text-center font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
      Nenhum tópico encontrado com os filtros atuais.
    </div>
  );
}
