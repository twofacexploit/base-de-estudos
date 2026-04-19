"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Acima deste offset (em px) do topo, o tooltip é exibido acima do termo
// para não ficar cortado na viewport.
const TOOLTIP_FLIP_THRESHOLD = 220;

export function GlossaryTerm({
  term,
  definition,
  children
}: {
  term: string;
  definition: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setShowAbove(rect.top > TOOLTIP_FLIP_THRESHOLD);
  }, [open]);

  return (
    <span
      ref={anchorRef}
      className="group relative inline"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span
        className="cursor-help underline decoration-dotted decoration-fg-subtle/70 underline-offset-2 transition hover:decoration-[color:var(--block)]"
        tabIndex={0}
      >
        {children}
      </span>
      {open && (
        <span
          role="tooltip"
          className={`absolute left-1/2 z-50 w-64 -translate-x-1/2 ${
            showAbove ? "bottom-full mb-2" : "top-full mt-2"
          } pointer-events-auto rounded-lg border border-border-strong bg-bg-elevated p-3 text-left text-xs shadow-card-hover`}
        >
          <span className="block font-semibold text-fg">{term}</span>
          <span className="mt-1 block leading-relaxed text-fg-muted">
            {definition}
          </span>
          <Link
            href="/glossario"
            className="mt-2 inline-block text-[11px] font-medium text-fg-subtle transition hover:text-fg"
          >
            Ver glossário completo →
          </Link>
        </span>
      )}
    </span>
  );
}
