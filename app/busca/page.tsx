import type { Metadata } from "next";
import Link from "next/link";
import type { Block, SearchResult, Topic } from "@/lib/types";
import { getAllTopics } from "@/lib/content";
import { searchTopics } from "@/lib/search";
import { BLOCKS } from "@/lib/blocks";
import { normalizeText } from "@/lib/text";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { BlockIcon } from "@/components/BlockIcon";
import { SearchInput } from "@/components/SearchInput";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Busque em todos os 86 tópicos e no glossário."
};

type GroupedResults = { block: Block; results: SearchResult[] };

function groupResultsByBlock(results: SearchResult[]): GroupedResults[] {
  return BLOCKS.map((block) => ({
    block,
    results: results.filter((result) => result.topic.block === block.id)
  })).filter((group) => group.results.length > 0);
}

export default function SearchPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const query = (searchParams.q ?? "").trim();
  const topics: Topic[] = getAllTopics();
  const results = query ? searchTopics(topics, query) : [];
  const grouped = groupResultsByBlock(results);

  return (
    <main className="mx-auto max-w-3xl px-6 pb-16 pt-12">
      <PageHeader totalTopics={topics.length} />

      <div className="mt-8">
        <SearchInput initialValue={query} />
      </div>

      {query ? (
        <ResultsSection query={query} results={results} grouped={grouped} />
      ) : (
        <BlocksShortcut />
      )}
    </main>
  );
}

function PageHeader({ totalTopics }: { totalTopics: number }) {
  return (
    <>
      <p className="label">Busca</p>
      <h1 className="heading-tight mt-3 text-4xl font-bold tracking-tight">
        Buscar em tudo
      </h1>
      <p className="mt-3 max-w-xl text-[15px] text-fg-muted">
        Busca em títulos, subtítulos, conteúdo completo, tags e excerpts de todos
        os {totalTopics} tópicos. Pressione <Kbd>⌘ K</Kbd> em qualquer página
        para abrir a busca rápida.
      </p>
    </>
  );
}

function ResultsSection({
  query,
  results,
  grouped
}: {
  query: string;
  results: SearchResult[];
  grouped: GroupedResults[];
}) {
  return (
    <div className="mt-10">
      <p className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
        {results.length} resultado{results.length !== 1 && "s"} ·{" "}
        <span className="text-fg">{query}</span>
      </p>

      {results.length === 0 ? (
        <EmptyResults />
      ) : (
        <div className="mt-8 space-y-10">
          {grouped.map(({ block, results: blockResults }) => (
            <BlockResultsSection
              key={block.id}
              block={block}
              results={blockResults}
              query={query}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="mt-6 rounded-lg border border-dashed border-border p-12 text-center">
      <p className="text-sm text-fg-muted">Nenhum tópico encontrado.</p>
      <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
        Tente outras palavras ou remova acentos
      </p>
    </div>
  );
}

function BlockResultsSection({
  block,
  results,
  query
}: {
  block: Block;
  results: SearchResult[];
  query: string;
}) {
  return (
    <section className={cn(block.colorClass)}>
      <div className="mb-4 flex items-center gap-3 border-b border-border-subtle pb-3">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md border border-border-subtle bg-bg-subtle"
          style={{ color: block.color }}
        >
          <BlockIcon iconKey={block.iconKey} size={14} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-fg">{block.name}</p>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
          {results.length} {results.length === 1 ? "resultado" : "resultados"}
        </span>
      </div>

      <ul className="space-y-2">
        {results.map(({ topic, snippet }) => (
          <li key={topic.slug}>
            <Link
              href={`/topico/${topic.slug}`}
              className="card card-hover block p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                    {topic.number}
                  </p>
                  <h3 className="mt-1 text-[15px] font-semibold text-fg">
                    <Highlight text={topic.title} query={query} />
                  </h3>
                  {topic.excerpt && (
                    <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-fg-muted">
                      <Highlight text={topic.excerpt} query={query} />
                    </p>
                  )}
                  {snippet && !topic.excerpt?.includes(query) && (
                    <p className="mt-1.5 line-clamp-2 text-[12px] text-fg-subtle">
                      <Highlight text={snippet} query={query} />
                    </p>
                  )}
                </div>
                <DifficultyBadge level={topic.difficulty} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BlocksShortcut() {
  return (
    <div className="mt-12">
      <p className="label mb-4">Ou comece pelos blocos</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {BLOCKS.map((block) => (
          <Link
            key={block.id}
            href={`/bloco/${block.slug}`}
            className={cn(
              block.colorClass,
              "card card-hover flex items-center gap-3 p-3"
            )}
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-subtle"
              style={{ color: block.color }}
            >
              <BlockIcon iconKey={block.iconKey} size={16} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">
                {block.name}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
                {block.topicCount} tópicos
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;

  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  const matchIndex = normalizedText.indexOf(normalizedQuery);

  if (matchIndex === -1) return <>{text}</>;

  const before = text.slice(0, matchIndex);
  const match = text.slice(matchIndex, matchIndex + query.length);
  const after = text.slice(matchIndex + query.length);

  return (
    <>
      {before}
      <mark className="rounded bg-fg/15 px-0.5 text-fg">{match}</mark>
      {after}
    </>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-border-subtle bg-bg-elevated px-1 font-mono text-[10px] text-fg-muted">
      {children}
    </kbd>
  );
}
