"use client";

import { useEffect, useMemo, useState } from "react";
import { slugify } from "@/lib/text";
import { cn } from "@/lib/cn";

interface Heading {
  id: string;
  text: string;
  level: number;
}

const MIN_HEADINGS_TO_DISPLAY = 2;
const HEADING_REGEX = /^(#{2,3})\s+(.+?)\s*$/;
const CODE_FENCE_REGEX = /^\s*```/;

/**
 * Percorre o markdown bruto e extrai cabeçalhos H2/H3 que estejam
 * fora de blocos de código delimitados por ```.
 */
function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = [];
  let insideCodeBlock = false;

  for (const line of markdown.split("\n")) {
    if (CODE_FENCE_REGEX.test(line)) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }
    if (insideCodeBlock) continue;

    const match = line.match(HEADING_REGEX);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, "").trim();
    headings.push({ level, text, id: slugify(text) });
  }

  return headings;
}

export function TopicTOC({ content }: { content: string }) {
  const headings = useMemo(() => extractHeadings(content), [content]);
  const [activeId, setActiveId] = useState("");

  // Destaca o item do sumário correspondente à seção visível no viewport.
  useEffect(() => {
    if (headings.length === 0) return;

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top
          );
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < MIN_HEADINGS_TO_DISPLAY) return null;

  return (
    <nav aria-label="Sumário">
      <p className="label mb-3">Nesta página</p>
      <ul className="space-y-0.5 border-l border-border-subtle">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={cn(
                "-ml-px block border-l py-1 pl-3 text-[13px] transition-colors",
                heading.level === 3 && "pl-5",
                activeId === heading.id
                  ? "border-fg text-fg"
                  : "border-transparent text-fg-muted hover:border-border-strong hover:text-fg"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
