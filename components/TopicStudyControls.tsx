"use client";

import { Check, Circle, Printer } from "lucide-react";
import { toggleStudied } from "@/lib/progress";
import { useIsStudied, useMounted } from "@/lib/useProgress";
import { cn } from "@/lib/cn";

export function TopicStudyControls({ slug, blockColor }: { slug: string; blockColor: string }) {
  const mounted = useMounted();
  const studied = useIsStudied(slug);

  if (!mounted) return <ControlsSkeleton />;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2" data-print-hide>
      <button
        type="button"
        onClick={() => toggleStudied(slug)}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-xl border px-5 text-sm font-semibold transition-all duration-200",
          studied
            ? "border-transparent text-bg"
            : "border-border bg-bg-elevated text-fg hover:border-accent/30 hover:bg-bg-hover"
        )}
        style={studied ? { background: blockColor, boxShadow: `0 0 20px ${blockColor}40` } : undefined}
      >
        {studied ? (
          <><Check className="h-4 w-4" strokeWidth={2.5} />Estudado</>
        ) : (
          <><Circle className="h-4 w-4" strokeWidth={1.75} />Marcar como estudado</>
        )}
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-elevated text-fg-muted transition-all hover:border-border-strong hover:bg-bg-hover hover:text-fg"
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
      <div className="h-10 w-48 rounded-xl border border-border-subtle bg-bg-subtle animate-pulse" />
      <div className="h-10 w-10 rounded-xl border border-border-subtle bg-bg-subtle animate-pulse" />
    </div>
  );
}
