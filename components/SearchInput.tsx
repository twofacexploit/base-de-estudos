"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const DEBOUNCE_MS = 300;

function buildSearchUrl(query: string): string {
  const trimmed = query.trim();
  return trimmed ? `/busca?q=${encodeURIComponent(trimmed)}` : "/busca";
}

export function SearchInput({
  initialValue = "",
  autoFocus = true
}: {
  initialValue?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // Debounce: só navega depois de 300ms sem digitação.
  // Ignoramos o primeiro render para não sobrescrever a URL na entrada.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      router.push(buildSearchUrl(value));
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, router]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push(buildSearchUrl(value));
      }}
    >
      <div className="flex h-12 items-center gap-3 rounded-lg border border-border bg-bg-elevated px-4 transition-colors focus-within:border-border-strong">
        <Search
          className="h-4 w-4 shrink-0 text-fg-subtle"
          strokeWidth={2}
          aria-hidden
        />
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Buscar tópicos, ferramentas, termos…"
          autoFocus={autoFocus}
          aria-label="Buscar"
          className="h-full w-full border-0 bg-transparent text-[15px] text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-0"
        />
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="rounded p-1 text-fg-subtle transition-colors hover:text-fg"
            aria-label="Limpar"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        )}
      </div>
    </form>
  );
}
