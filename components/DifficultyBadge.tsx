import type { Difficulty } from "@/lib/types";
import { cn } from "@/lib/cn";

const LABELS: Record<Difficulty, string> = {
  iniciante: "Iniciante",
  medio: "Médio",
  avancado: "Avançado"
};

const DOT: Record<Difficulty, string> = {
  iniciante: "bg-emerald-400",
  medio: "bg-amber-400",
  avancado: "bg-rose-400"
};

export function DifficultyBadge({
  level,
  className
}: {
  level: Difficulty;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-border-subtle bg-bg-subtle px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-fg-muted",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", DOT[level])} aria-hidden />
      {LABELS[level]}
    </span>
  );
}
