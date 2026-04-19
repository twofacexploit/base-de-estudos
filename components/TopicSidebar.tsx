"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import type { Block, TopicSummary } from "@/lib/types";
import { useStudiedSlugs } from "@/lib/useProgress";
import { BlockIcon } from "./BlockIcon";
import { cn } from "@/lib/cn";

export function TopicSidebar({
  block,
  topics,
  currentSlug
}: {
  block: Block;
  topics: TopicSummary[];
  currentSlug: string;
}) {
  const studied = useStudiedSlugs();
  const studiedSet = new Set(studied);

  return (
    <div className={cn(block.colorClass)}>
      <BlockHeader block={block} />

      <p className="label mb-3 mt-6">Tópicos do bloco</p>
      <ul className="space-y-0.5">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <SidebarTopicLink
              topic={topic}
              block={block}
              active={topic.slug === currentSlug}
              done={studiedSet.has(topic.slug)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlockHeader({ block }: { block: Block }) {
  return (
    <Link
      href={`/bloco/${block.slug}`}
      className="group flex items-center gap-2.5 rounded-md border border-border-subtle bg-bg-subtle p-2.5 transition-colors hover:border-border"
    >
      <span
        className="flex h-7 w-7 items-center justify-center rounded"
        style={{ color: block.color, background: `${block.color}10` }}
      >
        <BlockIcon iconKey={block.iconKey} size={14} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
          Bloco {String(block.number).padStart(2, "0")}
        </p>
        <p className="truncate text-[13px] font-medium text-fg">{block.name}</p>
      </div>
    </Link>
  );
}

function SidebarTopicLink({
  topic,
  block,
  active,
  done
}: {
  topic: TopicSummary;
  block: Block;
  active: boolean;
  done: boolean;
}) {
  return (
    <Link
      href={`/topico/${topic.slug}`}
      className={cn(
        "group flex items-center gap-2 rounded-md py-1.5 pl-2 pr-1 text-[12px] transition-colors",
        active
          ? "bg-bg-hover text-fg"
          : "text-fg-muted hover:bg-bg-hover/50 hover:text-fg"
      )}
    >
      <span
        className={cn(
          "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border",
          done ? "border-transparent text-[#0a0a0b]" : "border-border"
        )}
        style={done ? { background: block.color } : undefined}
      >
        {done && <Check className="h-2 w-2" strokeWidth={3} />}
      </span>
      <span className="font-mono text-[10px] text-fg-subtle">
        {topic.number}
      </span>
      <span className="line-clamp-1 flex-1">{topic.title}</span>
    </Link>
  );
}
