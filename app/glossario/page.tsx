import type { Metadata } from "next";
import { getGlossary } from "@/lib/content";
import { GlossaryBrowser } from "@/components/GlossaryBrowser";

export const metadata: Metadata = {
  title: "Glossário",
  description: "Todos os termos técnicos explicados em linguagem simples."
};

export default function GlossaryPage() {
  const terms = getGlossary();

  return (
    <main className="mx-auto max-w-3xl px-6 pb-16 pt-12">
      <p className="label">Referência</p>
      <h1 className="heading-tight mt-3 text-4xl font-bold tracking-tight">
        Glossário técnico
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-fg-muted">
        {terms.length} termos do universo de tecnologia, IA e cibersegurança,
        explicados em uma frase. Sem jargão que não seja imediatamente
        esclarecido.
      </p>

      <GlossaryBrowser terms={terms} />
    </main>
  );
}
