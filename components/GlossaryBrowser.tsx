"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import type { GlossaryTerm } from "@/lib/types";
import { firstLetter, normalizeText } from "@/lib/text";
import { cn } from "@/lib/cn";

export function GlossaryBrowser({ terms }: { terms: GlossaryTerm[] }) {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string | null>(null);

  const availableLetters = useMemo(
    () =>
      [...new Set(terms.map((term) => firstLetter(term.term)))].sort((a, b) =>
        a.localeCompare(b)
      ),
    [terms]
  );

  const filtered = useMemo(() => {
    const needle = normalizeText(query);
    return terms.filter((term) => {
      if (letter && firstLetter(term.term) !== letter) return false;
      if (!needle) return true;
      return (
        normalizeText(term.term).includes(needle) ||
        normalizeText(term.definition).includes(needle)
      );
    });
  }, [terms, query, letter]);

  const grouped = useMemo(() => groupByFirstLetter(filtered), [filtered]);

  return (
    <div className="mt-10">
      <SearchField value={query} onChange={setQuery} />

      <LetterFilter
        letters={availableLetters}
        selected={letter}
        onSelect={(value) => setLetter(value === letter ? null : value)}
        onClear={() => setLetter(null)}
      />

      <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
        {filtered.length} {filtered.length === 1 ? "termo" : "termos"}
      </p>

      {grouped.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-6 space-y-12">
          {grouped.map(([letterKey, items]) => (
            <LetterSection key={letterKey} letter={letterKey} items={items} />
          ))}
        </div>
      )}
    </div>
  );
}

function groupByFirstLetter(
  terms: GlossaryTerm[]
): [string, GlossaryTerm[]][] {
  const map = new Map<string, GlossaryTerm[]>();
  for (const term of terms) {
    const letter = firstLetter(term.term);
    const bucket = map.get(letter);
    if (bucket) bucket.push(term);
    else map.set(letter, [term]);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function SearchField({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-lg border border-border bg-bg-elevated px-4 transition-colors focus-within:border-border-strong">
      <Search
        className="h-4 w-4 shrink-0 text-fg-subtle"
        strokeWidth={2}
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar termo…"
        className="h-full w-full border-0 bg-transparent text-[15px] text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-0"
        aria-label="Buscar termo"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="rounded p-1 text-fg-subtle transition-colors hover:text-fg"
          aria-label="Limpar"
        >
          <X className="h-4 w-4" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

function LetterFilter({
  letters,
  selected,
  onSelect,
  onClear
}: {
  letters: string[];
  selected: string | null;
  onSelect: (letter: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap gap-1">
      <button
        type="button"
        onClick={onClear}
        className={cn(
          "rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors",
          selected === null
            ? "border-border-strong bg-bg-elevated text-fg"
            : "border-border-subtle bg-bg-subtle text-fg-muted hover:text-fg"
        )}
      >
        Todas
      </button>
      {letters.map((letter) => (
        <button
          key={letter}
          type="button"
          onClick={() => onSelect(letter)}
          className={cn(
            "h-7 w-7 rounded-md border font-mono text-[11px] font-medium transition-colors",
            selected === letter
              ? "border-border-strong bg-bg-elevated text-fg"
              : "border-border-subtle bg-bg-subtle text-fg-muted hover:text-fg"
          )}
        >
          {letter}
        </button>
      ))}
    </div>
  );
}

function LetterSection({
  letter,
  items
}: {
  letter: string;
  items: GlossaryTerm[];
}) {
  return (
    <section>
      <div className="sticky top-14 z-10 -mx-2 mb-4 flex items-center gap-3 bg-bg/85 px-2 py-2 backdrop-blur-sm">
        <span
          id={`letra-${letter}`}
          className="grid h-8 w-8 place-items-center rounded-md border border-border-subtle bg-bg-subtle font-mono text-sm font-semibold text-fg"
        >
          {letter}
        </span>
        <span className="h-px flex-1 bg-border-subtle" />
        <span className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
          {items.length}
        </span>
      </div>
      <dl className="space-y-2">
        {items.map((item) => (
          <div
            key={item.term}
            id={item.term}
            className="card group p-4 transition-colors hover:border-border"
          >
            <dt className="font-semibold text-fg">{item.term}</dt>
            <dd className="mt-1 text-[14px] leading-relaxed text-fg-muted">
              {item.definition}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="mt-6 rounded-lg border border-dashed border-border p-12 text-center">
      <p className="text-sm text-fg-muted">Nenhum termo encontrado.</p>
    </div>
  );
}
