import { BLOCKS, BLOCKS_BY_ID, TOTAL_TOPICS } from "@/lib/blocks";
import { getAllTopicSummaries, getGlossary } from "@/lib/content";
import { BlocksGrid } from "@/components/BlocksGrid";
import { ContinueStudying } from "@/components/ContinueStudying";
import { CommandTrigger } from "@/components/CommandPalette";

export default function HomePage() {
  const topics   = getAllTopicSummaries();
  const glossary = getGlossary();

  return (
    <main className="mx-auto max-w-6xl px-6 pb-20 pt-12 sm:pt-24">

      {/* Hero */}
      <section className="relative">
        <div className="absolute -inset-x-20 -top-24 h-[500px] grid-lines mask-fade-b opacity-30" aria-hidden />
        <div
          className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(74,222,128,0.12) 0%, transparent 70%)" }}
          aria-hidden
        />

        <div className="relative animate-fade-up">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-glow-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent/80">
              Base de Estudos · v1.0
            </span>
          </div>

          <h1 className="heading-tight max-w-4xl text-balance text-5xl font-bold sm:text-6xl md:text-7xl">
            Tecnologia, IA e
            <br />
            <span className="text-accent">Cibersegurança</span>
            <br />
            <span className="text-fg-muted">com clareza.</span>
          </h1>

          <p className="mt-7 max-w-xl text-pretty text-[16px] leading-relaxed text-fg-muted">
            {TOTAL_TOPICS} tópicos organizados em 7 blocos temáticos. Explicados em linguagem
            simples, com exemplos do dia a dia. Do zero ao avançado.
          </p>

          <div className="mt-8">
            <CommandTrigger className="w-full sm:max-w-sm" />
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-y border-border-subtle py-8 sm:max-w-lg">
            <Stat label="Tópicos" value={TOTAL_TOPICS} />
            <Stat label="Blocos"  value={BLOCKS.length} />
            <Stat label="Termos"  value={glossary.length} />
          </dl>
        </div>
      </section>

      {/* Grid de blocos */}
      <section className="mt-24">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="label">Conteúdo</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-fg">
              Os 7 blocos temáticos
            </h2>
          </div>
          <span className="hidden font-mono text-[11px] uppercase tracking-wider text-fg-subtle sm:inline">
            07 áreas
          </span>
        </div>
        <BlocksGrid blocks={BLOCKS} topics={topics} />
      </section>

      <ContinueStudying topics={topics} blocksById={BLOCKS_BY_ID} />
    </main>
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
