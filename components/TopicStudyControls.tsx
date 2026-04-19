"use client";

import { Check, Circle, Printer } from "lucide-react";
import { toggleStudied } from "@/lib/progress";
import { useIsStudied, useMounted } from "@/lib/useProgress";
import { cn } from "@/lib/cn";

export function TopicStudyControls({
  slug,
  blockColor
}: {
  slug: string;
  blockColor: string;
}) {
  const mounted = useMounted();
  const studied = useIsStudied(slug);

  // No SSR ainda não temos `localStorage`. Renderizamos placeholders
  // com o mesmo tamanho para evitar "pulo" do layout na hidratação.
  if (!mounted) return <ControlsSkeleton />;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2" data-print-hide>
      <button
        type="button"
        onClick={() => toggleStudied(slug)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-all",
          studied
            ? "border-transparent text-[#0a0a0b]"
            : "border-border bg-bg-elevated text-fg hover:border-border-strong hover:bg-bg-hover"
        )}
        style={studied ? { background: blockColor } : undefined}
      >
        {studied ? (
          <>
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Estudado
          </>
        ) : (
          <>
            <Circle className="h-4 w-4" strokeWidth={1.75} />
            Marcar como estudado
          </>
        )}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-bg-elevated text-fg-muted transition-colors hover:border-border-strong hover:bg-bg-hover hover:text-fg"
        aria-label="Imprimir tópico"
        title="Imprimir"
      >
        <Printer className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function ControlsSkeleton() {
  return (
    <div className="mt-8 flex gap-2" data-print-hide>
      <div className="h-10 w-44 rounded-md border border-border-subtle bg-bg-subtle" />
      <div className="h-10 w-10 rounded-md border border-border-subtle bg-bg-subtle" />
    </div>
  );
}
