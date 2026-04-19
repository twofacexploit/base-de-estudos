import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({
  items,
  className
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-fg-subtle",
        className
      )}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-fg"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-fg" : undefined}>
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight
                className="h-3 w-3 text-fg-faint"
                strokeWidth={2}
                aria-hidden
              />
            )}
          </span>
        );
      })}
    </nav>
  );
}
