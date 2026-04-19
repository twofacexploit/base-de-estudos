import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Block } from "@/lib/types";
import { BLOCKS, getBlockBySlug } from "@/lib/blocks";
import { getAllTopicSummaries } from "@/lib/content";
import { Breadcrumb } from "@/components/Breadcrumb";
import { BlockIcon } from "@/components/BlockIcon";
import { BlockTopicList } from "@/components/BlockTopicList";

export function generateStaticParams() {
  return BLOCKS.map((block) => ({ slug: block.slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const block = getBlockBySlug(params.slug);
  if (!block) return {};
  return { title: block.name, description: block.description };
}

export default function BlockPage({ params }: { params: { slug: string } }) {
  const block = getBlockBySlug(params.slug);
  if (!block) notFound();

  const topics = getAllTopicSummaries().filter((t) => t.block === block.id);

  return (
    <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
      <Breadcrumb
        items={[{ label: "Início", href: "/" }, { label: block.name }]}
      />

      <BlockHeader block={block} topicsLoaded={topics.length} />

      <BlockTopicList block={block} topics={topics} />
    </main>
  );
}

function BlockHeader({
  block,
  topicsLoaded
}: {
  block: Block;
  topicsLoaded: number;
}) {
  return (
    <header
      className={`${block.colorClass} mt-8 border-b border-border-subtle pb-10`}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-5">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-border-subtle bg-bg-subtle"
            style={{ color: block.color }}
          >
            <BlockIcon iconKey={block.iconKey} size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-fg-subtle">
              Bloco {String(block.number).padStart(2, "0")} · {topicsLoaded}{" "}
              tópicos
            </p>
            <h1 className="heading-tight mt-2 text-4xl font-bold text-balance sm:text-5xl">
              {block.name}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
              {block.description}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
