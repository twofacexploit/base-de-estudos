import { BLOCKS, BLOCKS_BY_ID, TOTAL_TOPICS } from "@/lib/blocks";
import { getAllTopicSummaries, getGlossary } from "@/lib/content";
import { BlocksGrid } from "@/components/BlocksGrid";
import { ContinueStudying } from "@/components/ContinueStudying";
import { CommandTrigger } from "@/components/CommandPalette";

export default function HomePage() {
  const topics = getAllTopicSummaries();
  const glossary = getGlossary();

  return (
    <main className="mx-auto max-w-6xl px-6 pb-16 pt-12 sm:pt-20">
      <HeroSection glossaryCount={glossary.length} />
      <BlocksSection topics={topics} />
      <ContinueStudying topics={topics} blocksById={BLOCKS_BY_ID} />
    </main>
  );
}

function HeroSection({ glossaryCount }: { glossaryCount: number }) {
  return (
    <section className="relative">
      <div
        className="absolute -inset-x-20 -top-20 h-96 grid-lines mask-fade-b opacity-40"
        aria-hidden
      />

      <div className="relative">
        <p className="label">Base de Estudos · v1.0</p>

        <h1 className="heading-tight mt-5 max-w-4xl text-balance text-5xl font-bold sm:text-6xl md:text-7xl">
          Tecnologia, IA e
          <br />
          <span className="text-fg-muted">Cibersegurança</span>
          <br />
          com clareza técnica.
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-fg-muted">
          {TOTAL_TOPICS} tópicos organizados em 7 blocos temáticos. Analogias
          do mundo real, sem jargão sem explicação. Desenhado para ser
          referência rápida e leitura profunda.
        </p>

        <div className="mt-8 flex max-w-sm">
          <CommandTrigger className="w-full" />
        </div>

        <dl className="mt-14 grid grid-cols-3 gap-6 border-y border-border-subtle py-8 sm:max-w-xl">
          <Stat label="Tópicos" value={TOTAL_TOPICS} />
          <Stat label="Blocos" value={BLOCKS.length} />
          <Stat label="Termos" value={glossaryCount} />
        </dl>
      </div>
    </section>
  );
}

function BlocksSection({
  topics
}: {
  topics: ReturnType<typeof getAllTopicSummaries>;
}) {
  return (
    <section className="mt-20">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="label">Conteúdo</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-fg">
            Os 7 blocos temáticos
          </h2>
        </div>
        <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
          07 áreas
        </span>
      </div>
      <BlocksGrid blocks={BLOCKS} topics={topics} />
    </section>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="label">{label}</dt>
      <dd className="mt-2 font-display text-3xl font-bold tracking-tight text-fg">
        {String(value).padStart(2, "0")}
      </dd>
    </div>
  );
}
