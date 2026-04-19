"use client";

import { useMemo } from "react";
import type { Block, TopicSummary } from "@/lib/types";
import { BlockCard } from "./BlockCard";
import { useStudiedSlugs } from "@/lib/useProgress";

export function BlocksGrid({
  blocks,
  topics
}: {
  blocks: Block[];
  topics: TopicSummary[];
}) {
  const studied = useStudiedSlugs();

  // Pré-computa o conjunto para evitar buscas O(n) dentro do filter por bloco.
  const studiedSet = useMemo(() => new Set(studied), [studied]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {blocks.map((block) => {
        const studiedInBlock = topics.reduce((count, topic) => {
          if (topic.block !== block.id) return count;
          return studiedSet.has(topic.slug) ? count + 1 : count;
        }, 0);

        return (
          <BlockCard
            key={block.id}
            block={block}
            studied={studiedInBlock}
            total={block.topicCount}
          />
        );
      })}
    </div>
  );
}
