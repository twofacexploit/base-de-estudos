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

// Pontuação do ranking do Command Palette.
const SCORE_LABEL_PREFIX = 100;
const SCORE_LABEL_INCLUDES = 50;
const SCORE_HINT_INCLUDES = 10;

const MAX_DEFAULT_ITEMS = 40;
const MAX_MATCHES = 50;
const HINT_MAX_LENGTH = 60;

type PaletteContextValue = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

const PaletteContext = createContext<PaletteContextValue>({
  open: false,
  setOpen: () => {}
});

export function useCommandPalette() {
  return useContext(PaletteContext);
}

type PaletteItem =
  | {
      kind: "block";
      id: string;
      label: string;
      href: string;
      hint: string;
      blockId: string;
    }
  | {
      kind: "topic";
      id: string;
      label: string;
      href: string;
      hint: string;
      blockId: string;
    }
  | { kind: "term"; id: string; label: string; href: string; hint: string }
  | { kind: "route"; id: string; label: string; href: string; hint: string };

const ROUTE_ITEMS: PaletteItem[] = [
  { kind: "route", id: "r-home", label: "Início", href: "/", hint: "Home" },
  {
    kind: "route",
    id: "r-busca",
    label: "Buscar",
    href: "/busca",
    hint: "Página de busca completa"
  },
  {
    kind: "route",
    id: "r-glossario",
    label: "Glossário",
    href: "/glossario",
    hint: "Todos os termos técnicos"
  }
];

function truncateHint(text: string): string {
  return text.length > HINT_MAX_LENGTH
    ? `${text.slice(0, HINT_MAX_LENGTH)}…`
    : text;
}

function buildPaletteItems(
  topics: TopicSummary[],
  glossary: GlossaryTerm[]
): PaletteItem[] {
  const blocks: PaletteItem[] = BLOCKS.map((block) => ({
    kind: "block" as const,
    id: `block-${block.id}`,
    label: block.name,
    href: `/bloco/${block.slug}`,
    hint: `Bloco ${block.number} · ${block.topicCount} tópicos`,
    blockId: block.id
  }));

  const topicItems: PaletteItem[] = topics.map((topic) => {
    const block = getBlockById(topic.block);
    return {
      kind: "topic" as const,
      id: `topic-${topic.slug}`,
      label: topic.title,
      href: `/topico/${topic.slug}`,
      hint: `${topic.number} · ${block?.shortName ?? ""}`,
      blockId: topic.block
    };
  });

  const termItems: PaletteItem[] = glossary.map((entry) => ({
    kind: "term" as const,
    id: `term-${entry.term}`,
    label: entry.term,
    href: `/glossario#${encodeURIComponent(entry.term)}`,
    hint: truncateHint(entry.definition)
  }));

  return [...ROUTE_ITEMS, ...blocks, ...topicItems, ...termItems];
}

function rankItems(items: PaletteItem[], query: string): PaletteItem[] {
  const needle = normalizeText(query.trim());
  if (!needle) return items.slice(0, MAX_DEFAULT_ITEMS);

  return items
    .map((item) => {
      const label = normalizeText(item.label);
      const hint = normalizeText(item.hint);
      let score = 0;
      if (label.startsWith(needle)) score += SCORE_LABEL_PREFIX;
      else if (label.includes(needle)) score += SCORE_LABEL_INCLUDES;
      if (hint.includes(needle)) score += SCORE_HINT_INCLUDES;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_MATCHES)
    .map((entry) => entry.item);
}

export function CommandPaletteProvider({
  topics,
  glossary,
  children
}: {
  topics: TopicSummary[];
  glossary: GlossaryTerm[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo(
    () => buildPaletteItems(topics, glossary),
    [topics, glossary]
  );

  const filtered = useMemo(() => rankItems(items, query), [items, query]);

  // Reseta seleção ao digitar ou reabrir.
  useEffect(() => setActiveIndex(0), [query, open]);

  // Toggle global com ⌘K / Ctrl+K e fechar com ESC.
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      } else if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const navigate = (href: string) => {
    router.push(href);
    setOpen(false);
    setQuery("");
  };

  // Setas + Enter só ficam ativos quando o modal está aberto.
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((current) => Math.min(current + 1, filtered.length - 1));
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((current) => Math.max(current - 1, 0));
      } else if (event.key === "Enter") {
        event.preventDefault();
        const item = filtered[activeIndex];
        if (item) navigate(item.href);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // `navigate` é intencionalmente fora das deps: usa refs estáveis
    // (setOpen, setQuery, router) e recriá-lo aqui não agregaria.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered, activeIndex, router]);

  // Trava o scroll do body enquanto o modal estiver aberto.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
  }, [open]);

  return (
    <PaletteContext.Provider value={{ open, setOpen }}>
      {children}
      {open && (
        <PaletteDialog
          query={query}
          onQueryChange={setQuery}
          items={filtered}
          activeIndex={activeIndex}
          onHoverItem={setActiveIndex}
          onSelectItem={navigate}
          onClose={() => setOpen(false)}
        />
      )}
    </PaletteContext.Provider>
  );
}

function PaletteDialog({
  query,
  onQueryChange,
  items,
  activeIndex,
  onHoverItem,
  onSelectItem,
  onClose
}: {
  query: string;
  onQueryChange: (value: string) => void;
  items: PaletteItem[];
  activeIndex: number;
  onHoverItem: (index: number) => void;
  onSelectItem: (href: string) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-bg-inset/70 px-4 pt-[10vh] backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Buscar"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-bg-elevated shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <PaletteInput value={query} onChange={onQueryChange} />

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {items.length === 0 ? (
            <EmptyResults query={query} />
          ) : (
            <ul className="space-y-0.5">
              {items.map((item, index) => (
                <li key={item.id}>
                  <PaletteItemButton
                    item={item}
                    active={activeIndex === index}
                    onHover={() => onHoverItem(index)}
                    onSelect={() => onSelectItem(item.href)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <PaletteFooter resultCount={items.length} />
      </div>
    </div>
  );
}

function PaletteInput({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border-subtle px-4">
      <Search
        className="h-4 w-4 shrink-0 text-fg-subtle"
        strokeWidth={2}
        aria-hidden
      />
      <input
        autoFocus
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Buscar tópicos, blocos, termos…"
        className="h-12 flex-1 border-0 bg-transparent text-[15px] text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-0"
        aria-label="Buscar"
      />
      <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle sm:inline">
        ESC
      </kbd>
    </div>
  );
}

function PaletteItemButton({
  item,
  active,
  onHover,
  onSelect
}: {
  item: PaletteItem;
  active: boolean;
  onHover: () => void;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onHover}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
        active ? "bg-bg-hover" : "hover:bg-bg-hover/50"
      )}
    >
      <ItemIcon item={item} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-fg">{item.label}</p>
        <p className="truncate font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
          {item.hint}
        </p>
      </div>
      <ArrowRight
        className={cn(
          "h-4 w-4 shrink-0 transition-opacity",
          active ? "opacity-100" : "opacity-0"
        )}
        strokeWidth={2}
        aria-hidden
      />
    </button>
  );
}

function ItemIcon({ item }: { item: PaletteItem }) {
  if (item.kind === "block" || item.kind === "topic") {
    const block = getBlockById(item.blockId);
    if (item.kind === "block" && block) {
      return (
        <span
          className={cn(
            block.colorClass,
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-subtle"
          )}
          style={{
            color: block.color,
            background: `${block.color}12`
          }}
        >
          <BlockIcon iconKey={block.iconKey} size={14} strokeWidth={2} />
        </span>
      );
    }
    return (
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-subtle"
        style={block ? { color: block.color } : undefined}
      >
        <Hash className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </span>
    );
  }

  if (item.kind === "term") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-subtle text-fg-muted">
        <BookOpen className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </span>
    );
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border-subtle bg-bg-subtle text-fg-muted">
      <FileText className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
    </span>
  );
}

function EmptyResults({ query }: { query: string }) {
  return (
    <div className="p-8 text-center text-sm text-fg-subtle">
      Nenhum resultado para{" "}
      <span className="text-fg">&ldquo;{query}&rdquo;</span>
    </div>
  );
}

function PaletteFooter({ resultCount }: { resultCount: number }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border-subtle bg-bg-subtle px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
      <div className="flex items-center gap-3">
        <span>
          <Key>↑</Key>
          <Key>↓</Key> navegar
        </span>
        <span>
          <Key>↵</Key> abrir
        </span>
      </div>
      <span>{resultCount} resultados</span>
    </div>
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

  useEffect(() => {
    setIsMac(/mac/i.test(navigator.platform));
  }, []);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={cn(
        "inline-flex h-9 items-center gap-2.5 rounded-md border border-border bg-bg-subtle pl-3 pr-2 text-left text-sm text-fg-subtle transition-colors hover:border-border-strong hover:text-fg",
        className
      )}
      aria-label="Abrir busca"
    >
      <Search className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      <span className="flex-1">Buscar…</span>
      <kbd className="hidden items-center gap-0.5 rounded border border-border-subtle bg-bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle sm:inline-flex">
        {isMac ? "⌘" : "Ctrl"} K
      </kbd>
    </button>
  );
}
