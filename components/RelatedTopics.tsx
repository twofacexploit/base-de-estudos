import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Block, Topic } from "@/lib/types";
import { BlockIcon } from "./BlockIcon";
import { cn } from "@/lib/cn";

interface Item {
  topic: Topic;
  block: Block;
}

export function RelatedTopics({ items }: { items: Item[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border-subtle pt-10">
      <p className="label">Conecta com</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-fg">
        Leituras relacionadas
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map(({ topic, block }) => (
          <Link
            key={topic.slug}
            href={`/topico/${topic.slug}`}
            className={cn(
              block.colorClass,
              "card card-hover group relative overflow-hidden p-4"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-subtle"
                style={{ color: block.color }}
              >
                <BlockIcon iconKey={block.iconKey} size={15} strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                  {topic.number} · {block.shortName}
                </p>
                <p className="mt-1 line-clamp-1 text-sm font-semibold text-fg">
                  {topic.title}
                </p>
                {topic.excerpt && (
                  <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-fg-muted">
                    {topic.excerpt}
                  </p>
                )}
              </div>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-fg-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
                strokeWidth={1.75}
                aria-hidden
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
