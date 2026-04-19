"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";

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
  const [above, setAbove] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setAbove(rect.top > 240);
  }, [open]);

  return (
    <span
      ref={ref}
      className="group relative inline"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span
        className="cursor-help underline decoration-dotted decoration-accent/40 underline-offset-2 transition hover:decoration-accent"
        tabIndex={0}
      >
        {children}
      </span>
      {open && (
        <span
          role="tooltip"
          className={`absolute left-1/2 z-50 w-64 -translate-x-1/2 ${
            above ? "bottom-full mb-2" : "top-full mt-2"
          } pointer-events-auto rounded-xl border border-accent/15 bg-bg-elevated p-3.5 text-left text-xs shadow-[0_0_0_1px_rgba(74,222,128,0.08),0_16px_32px_rgba(0,0,0,0.6)]`}
        >
          <span className="block font-semibold text-accent">{term}</span>
          <span className="mt-1.5 block leading-relaxed text-fg-muted">{definition}</span>
          <Link
            href="/glossario"
            className="mt-2.5 inline-block text-[11px] font-medium text-fg-subtle transition hover:text-accent"
          >
            Ver glossário completo →
          </Link>
        </span>
      )}
    </span>
  );
}
