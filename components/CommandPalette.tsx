"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, BookOpen, Hash, FileText } from "lucide-react";
import type { GlossaryTerm, TopicSummary } from "@/lib/types";
import { BLOCKS, getBlockById } from "@/lib/blocks";
import { normalizeText } from "@/lib/text";
import { BlockIcon } from "./BlockIcon";
import { cn } from "@/lib/cn";

const SCORE_LABEL_PREFIX = 100;
const SCORE_LABEL_INCLUDES = 50;
const SCORE_HINT_INCLUDES = 10;
const MAX_DEFAULT_ITEMS = 40;
const MAX_MATCHES = 50;
const HINT_MAX_LENGTH = 60;

type PaletteContextValue = { open: boolean; setOpen: (value: boolean) => void };
const PaletteContext = createContext<PaletteContextValue>({ open: false, setOpen: () => {} });
export function useCommandPalette() { return useContext(PaletteContext); }

type PaletteItem =
  | { kind: "block"; id: string; label: string; href: string; hint: string; blockId: string }
  | { kind: "topic"; id: string; label: string; href: string; hint: string; blockId: string }
  | { kind: "term";  id: string; label: string; href: string; hint: string }
  | { kind: "route"; id: string; label: string; href: string; hint: string };

const ROUTE_ITEMS: PaletteItem[] = [
  { kind: "route", id: "r-home",      label: "Início",    href: "/",          hint: "Home" },
  { kind: "route", id: "r-busca",     label: "Buscar",    href: "/busca",     hint: "Página de busca completa" },
  { kind: "route", id: "r-glossario", label: "Glossário", href: "/glossario", hint: "Todos os termos técnicos" }
];

function truncateHint(text: string) {
  return text.length > HINT_MAX_LENGTH ? `${text.slice(0, HINT_MAX_LENGTH)}…` : text;
}

function buildPaletteItems(topics: TopicSummary[], glossary: GlossaryTerm[]): PaletteItem[] {
  return [
    ...ROUTE_ITEMS,
    ...BLOCKS.map((b) => ({
      kind: "block" as const,
      id: `block-${b.id}`,
      label: b.name,
      href: `/bloco/${b.slug}`,
      hint: `Bloco ${b.number} · ${b.topicCount} tópicos`,
      blockId: b.id
    })),
    ...topics.map((t) => ({
      kind: "topic" as const,
      id: `topic-${t.slug}`,
      label: t.title,
      href: `/topico/${t.slug}`,
      hint: `${t.number} · ${getBlockById(t.block)?.shortName ?? ""}`,
      blockId: t.block
    })),
    ...glossary.map((g) => ({
      kind: "term" as const,
      id: `term-${g.term}`,
      label: g.term,
      href: `/glossario#${encodeURIComponent(g.term)}`,
      hint: truncateHint(g.definition)
    }))
  ];
}

function rankItems(items: PaletteItem[], query: string): PaletteItem[] {
  const needle = normalizeText(query.trim());
  if (!needle) return items.slice(0, MAX_DEFAULT_ITEMS);
  return items
    .map((item) => {
      const label = normalizeText(item.label);
      const hint  = normalizeText(item.hint);
      let score = 0;
      if (label.startsWith(needle))    score += SCORE_LABEL_PREFIX;
      else if (label.includes(needle)) score += SCORE_LABEL_INCLUDES;
      if (hint.includes(needle))       score += SCORE_HINT_INCLUDES;
      return { item, score };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_MATCHES)
    .map((e) => e.item);
}

export function CommandPaletteProvider({
  topics, glossary, children
}: { topics: TopicSummary[]; glossary: GlossaryTerm[]; children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen]           = useState(false);
  const [query, setQuery]         = useState("");
  const [activeIndex, setActive]  = useState(0);

  const items    = useMemo(() => buildPaletteItems(topics, glossary), [topics, glossary]);
  const filtered = useMemo(() => rankItems(items, query), [items, query]);

  useEffect(() => setActive(0), [query, open]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((p) => !p); }
      else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const navigate = (href: string) => { router.push(href); setOpen(false); setQuery(""); };

  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); setActive((c) => Math.min(c + 1, filtered.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive((c) => Math.max(c - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); const item = filtered[activeIndex]; if (item) navigate(item.href); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered, activeIndex, router]);

  useEffect(() => {
    if (open) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = ""; setQuery(""); }
  }, [open]);

  return (
    <PaletteContext.Provider value={{ open, setOpen }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-bg-inset/80 px-4 pt-[10vh] backdrop-blur-md animate-fade-in"
          onClick={() => setOpen(false)}
          role="dialog" aria-modal="true" aria-label="Buscar"
        >
          <div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-accent/15 bg-bg-elevated shadow-[0_0_0_1px_rgba(74,222,128,0.08),0_24px_48px_rgba(0,0,0,0.6)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 border-b border-border-subtle px-4">
              <Search className="h-4 w-4 shrink-0 text-accent/60" strokeWidth={2} aria-hidden />
              <input
                autoFocus type="text" value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar tópicos, blocos, termos…"
                className="h-13 flex-1 border-0 bg-transparent py-3.5 text-[15px] text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-0"
                aria-label="Buscar"
              />
              <kbd className="hidden rounded-md border border-border px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle sm:inline">ESC</kbd>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-sm text-fg-subtle">
                  Nenhum resultado para <span className="text-fg">&ldquo;{query}&rdquo;</span>
                </div>
              ) : (
                <ul className="space-y-0.5">
                  {filtered.map((item, idx) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => navigate(item.href)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-100",
                          activeIndex === idx ? "bg-accent/10" : "hover:bg-bg-hover/60"
                        )}
                      >
                        <ItemIcon item={item} active={activeIndex === idx} />
                        <div className="min-w-0 flex-1">
                          <p className={cn("truncate text-sm font-medium", activeIndex === idx ? "text-accent" : "text-fg")}>
                            {item.label}
                          </p>
                          <p className="truncate font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                            {item.hint}
                          </p>
                        </div>
                        <ArrowRight
                          className={cn("h-4 w-4 shrink-0 transition-opacity text-accent", activeIndex === idx ? "opacity-100" : "opacity-0")}
                          strokeWidth={2} aria-hidden
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 border-t border-border-subtle bg-bg-subtle px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
              <div className="flex items-center gap-3">
                <span><Key>↑</Key><Key>↓</Key> navegar</span>
                <span><Key>↵</Key> abrir</span>
              </div>
              <span>{filtered.length} resultados</span>
            </div>
          </div>
        </div>
      )}
    </PaletteContext.Provider>
  );
}

function ItemIcon({ item, active }: { item: PaletteItem; active: boolean }) {
  const baseClass = "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border";

  if (item.kind === "block" || item.kind === "topic") {
    const block = getBlockById(item.blockId);
    if (item.kind === "block" && block) {
      return (
        <span
          className={cn(block.colorClass, baseClass)}
          style={{ color: block.color, borderColor: `${block.color}30`, background: `${block.color}12` }}
        >
          <BlockIcon iconKey={block.iconKey} size={14} strokeWidth={2} />
        </span>
      );
    }
    return (
      <span
        className={cn(baseClass, "border-border-subtle bg-bg-subtle")}
        style={block ? { color: block.color } : undefined}
      >
        <Hash className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </span>
    );
  }
  if (item.kind === "term") {
    return (
      <span className={cn(baseClass, "border-border-subtle bg-bg-subtle", active && "border-accent/20 bg-accent/5 text-accent")}>
        <BookOpen className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </span>
    );
  }
  return (
    <span className={cn(baseClass, "border-border-subtle bg-bg-subtle text-fg-muted", active && "border-accent/20 bg-accent/5 text-accent")}>
      <FileText className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
    </span>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="mr-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded border border-border bg-bg-elevated px-1 font-mono text-[9px] text-fg-subtle">
      {children}
    </kbd>
  );
}

export function CommandTrigger({ className }: { className?: string }) {
  const { setOpen } = useCommandPalette();
  const [isMac, setIsMac] = useState(false);
  useEffect(() => { setIsMac(/mac/i.test(navigator.platform)); }, []);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        "inline-flex h-9 items-center gap-2.5 rounded-lg border border-border bg-bg-subtle pl-3 pr-2 text-left text-sm text-fg-subtle transition-all hover:border-accent/25 hover:bg-bg-hover hover:text-fg",
        className
      )}
      aria-label="Abrir busca"
    >
      <Search className="h-3.5 w-3.5 text-accent/60" strokeWidth={2} aria-hidden />
      <span className="flex-1">Buscar…</span>
      <kbd className="hidden items-center gap-0.5 rounded border border-border-subtle bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle sm:inline-flex">
        {isMac ? "⌘" : "Ctrl"} K
      </kbd>
    </button>
  );
}
