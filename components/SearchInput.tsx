"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function SearchInput({ initialValue = "", autoFocus = true }: { initialValue?: string; autoFocus?: boolean }) {
  const [value, setValue] = useState(initialValue);
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) { initial.current = false; return; }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const q = value.trim();
      router.push(q ? `/busca?q=${encodeURIComponent(q)}` : "/busca");
    }, 300);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [value, router]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const q = value.trim();
        router.push(q ? `/busca?q=${encodeURIComponent(q)}` : "/busca");
      }}
    >
      <div className="flex h-12 items-center gap-3 rounded-xl border border-border bg-bg-elevated px-4 transition-all focus-within:border-accent/30 focus-within:shadow-glow-green-sm">
        <Search className="h-4 w-4 shrink-0 text-accent/60" strokeWidth={2} aria-hidden />
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar tópicos, ferramentas, termos…"
          autoFocus={autoFocus}
          aria-label="Buscar"
          className="h-full w-full border-0 bg-transparent text-[15px] text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-0"
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="rounded-lg p-1 text-fg-subtle transition hover:text-fg"
            aria-label="Limpar"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>
    </form>
  );
}
