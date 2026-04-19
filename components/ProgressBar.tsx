import { cn } from "@/lib/cn";

export function ProgressBar({
  value,
  total,
  color,
  className
}: {
  value: number;
  total: number;
  color?: string;
  className?: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;

  return (
    <div
      className={cn(
        "h-1 w-full overflow-hidden rounded-full bg-border-subtle",
        className
      )}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full transition-[width] duration-700 ease-out"
        style={{
          width: `${pct}%`,
          background: color ?? "var(--block, #a78bfa)"
        }}
      />
    </div>
  );
}
