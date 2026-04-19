import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  getAdjacentTopics,
  getAllTopics,
  getGlossary,
  getTopicBySlug,
  getTopicsByBlock
} from "@/lib/content";
import { getBlockById } from "@/lib/blocks";
import { Breadcrumb } from "@/components/Breadcrumb";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { BlockTag } from "@/components/BlockTag";
import { TopicContent } from "@/components/TopicContent";
import { TopicSidebar } from "@/components/TopicSidebar";
import { TopicStudyControls } from "@/components/TopicStudyControls";
import { RelatedTopics } from "@/components/RelatedTopics";
import { TopicTOC } from "@/components/TopicTOC";
import { ReadingProgress } from "@/components/ReadingProgress";
import type { Block, Topic, TopicSummary } from "@/lib/types";

type RelatedItem = { topic: Topic; block: Block };

// Velocidade média de leitura assumida (palavras por minuto).
const WORDS_PER_MINUTE = 220;

export function generateStaticParams() {
  return getAllTopics().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const topic = getTopicBySlug(params.slug);
  if (!topic) return {};
  const description = topic.excerpt ?? topic.subtitle ?? topic.title;
  return {
    title: topic.title,
    description,
    openGraph: { title: topic.title, description }
  };
}

function estimateReadingMinutes(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

function collectRelated(slugs: string[] | undefined): RelatedItem[] {
  if (!slugs?.length) return [];
  const related: RelatedItem[] = [];
  for (const slug of slugs) {
    const topic = getTopicBySlug(slug);
    if (!topic) continue;
    const block = getBlockById(topic.block);
    if (!block) continue;
    related.push({ topic, block });
  }
  return related;
}

function toSummary({ content: _content, ...rest }: Topic): TopicSummary {
  return rest;
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = getTopicBySlug(params.slug);
  if (!topic) notFound();

  const block = getBlockById(topic.block);
  if (!block) notFound();

  const siblings = getTopicsByBlock(topic.block).map(toSummary);
  const { prev, next } = getAdjacentTopics(topic.slug);
  const glossary = getGlossary();
  const minutes = estimateReadingMinutes(topic.content);
  const related = collectRelated(topic.related);

  return (
    <>
      <ReadingProgress />
      <main className={`${block.colorClass} mx-auto max-w-6xl px-6 pb-20 pt-8`}>
        <Breadcrumb
          items={[
            { label: "Início", href: "/" },
            { label: block.name, href: `/bloco/${block.slug}` },
            { label: topic.title }
          ]}
        />

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_240px]">
          <article className="min-w-0 max-w-2xl xl:max-w-3xl">
            <TopicMeta topic={topic} block={block} minutes={minutes} />

            <h1 className="heading-tight mt-6 text-4xl font-bold text-balance sm:text-5xl">
              {topic.title}
            </h1>

            {topic.subtitle && (
              <p className="mt-4 text-xl leading-snug text-fg-muted text-balance">
                {topic.subtitle}
              </p>
            )}

            <TopicStudyControls slug={topic.slug} blockColor={block.color} />

            <div className="mt-10 border-t border-border-subtle pt-10">
              <TopicContent
                slug={topic.slug}
                content={topic.content}
                glossary={glossary}
              />
            </div>

            <RelatedTopics items={related} />

            <PrevNextNav prev={prev} next={next} />
          </article>

          <aside className="hidden lg:block" data-print-hide>
            <div className="sticky top-20 space-y-8">
              <TopicTOC content={topic.content} />
              <div className="border-t border-border-subtle pt-8">
                <TopicSidebar
                  block={block}
                  topics={siblings}
                  currentSlug={topic.slug}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

function TopicMeta({
  topic,
  block,
  minutes
}: {
  topic: Topic;
  block: Block;
  minutes: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <BlockTag block={block} />
      <DifficultyBadge level={topic.difficulty} />
      <span className="chip">{topic.number}</span>
      <span className="chip">{minutes} min de leitura</span>
    </div>
  );
}

function PrevNextNav({
  prev,
  next
}: {
  prev: TopicSummary | null;
  next: TopicSummary | null;
}) {
  return (
    <nav
      className="mt-12 grid grid-cols-1 gap-3 border-t border-border-subtle pt-10 sm:grid-cols-2"
      data-print-hide
    >
      {prev ? <PrevLink topic={prev} /> : <div />}
      {next ? <NextLink topic={next} /> : <div />}
    </nav>
  );
}

function PrevLink({ topic }: { topic: TopicSummary }) {
  return (
    <Link
      href={`/topico/${topic.slug}`}
      className="card card-hover group p-4"
    >
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
        <ArrowLeft className="h-3 w-3" strokeWidth={2} />
        Anterior
      </span>
      <p className="mt-1.5 line-clamp-1 text-sm font-semibold text-fg">
        {topic.title}
      </p>
    </Link>
  );
}

function NextLink({ topic }: { topic: TopicSummary }) {
  return (
    <Link
      href={`/topico/${topic.slug}`}
      className="card card-hover group p-4 sm:text-right"
    >
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-fg-subtle sm:justify-end">
        Próximo
        <ArrowRight className="h-3 w-3" strokeWidth={2} />
      </span>
      <p className="mt-1.5 line-clamp-1 text-sm font-semibold text-fg">
        {topic.title}
      </p>
    </Link>
  );
}
