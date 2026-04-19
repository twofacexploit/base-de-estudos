import React from "react";
import type { GlossaryTerm } from "./types";
import { GlossaryTerm as GlossaryTermTooltip } from "@/components/GlossaryTerm";

const REGEX_ESCAPE = /[.*+?^${}()|[\]\\]/g;
const SKIP_ELEMENTS: ReadonlySet<string> = new Set(["code", "a"]);

function escapeRegex(input: string): string {
  return input.replace(REGEX_ESCAPE, "\\$&");
}

/**
 * Compila uma única regex com todos os termos do glossário ainda não usados,
 * ordenados do mais longo para o mais curto (para "Bug Bounty" ganhar de "Bug").
 */
function buildPattern(terms: GlossaryTerm[]): {
  pattern: RegExp;
  byLower: Map<string, GlossaryTerm>;
} {
  const byLower = new Map<string, GlossaryTerm>();
  const alternation = [...terms]
    .sort((a, b) => b.term.length - a.term.length)
    .map((term) => {
      byLower.set(term.term.toLowerCase(), term);
      return escapeRegex(term.term);
    })
    .join("|");

  return {
    pattern: new RegExp(`\\b(${alternation})\\b`, "i"),
    byLower
  };
}

/**
 * Envolve a primeira ocorrência de cada termo do glossário em um tooltip.
 * `alreadyUsed` é mutado entre chamadas para garantir que cada termo seja
 * destacado apenas uma vez no render atual.
 */
export function wrapGlossaryText(
  text: string,
  terms: GlossaryTerm[],
  alreadyUsed: Set<string>
): React.ReactNode {
  if (!text || terms.length === 0) return text;

  const remaining = terms.filter(
    (term) => !alreadyUsed.has(term.term.toLowerCase())
  );
  if (remaining.length === 0) return text;

  const { pattern, byLower } = buildPattern(remaining);
  const output: React.ReactNode[] = [];
  let cursor = 0;
  let rest = text;
  let key = 0;

  while (true) {
    const match = rest.match(pattern);
    if (!match || match.index === undefined) break;

    const matched = match[0];
    const termKey = matched.toLowerCase();
    const entry = byLower.get(termKey);

    // Termo não encontrado no dicionário local (impossível pelo build da regex,
    // mas serve como guarda defensiva). Interrompe a iteração.
    if (!entry) break;

    alreadyUsed.add(termKey);
    byLower.delete(termKey);

    if (match.index > 0) output.push(rest.slice(0, match.index));
    output.push(
      <GlossaryTermTooltip
        key={`gt-${cursor}-${key++}`}
        term={entry.term}
        definition={entry.definition}
      >
        {matched}
      </GlossaryTermTooltip>
    );

    const advance = match.index + matched.length;
    rest = rest.slice(advance);
    cursor += advance;

    // Se todos os termos já foram consumidos, encerramos.
    if (byLower.size === 0) break;
  }

  if (rest) output.push(rest);
  return output.length > 0 ? output : text;
}

/**
 * Percorre os filhos de um nó JSX renderizado pelo `react-markdown`,
 * envolvendo textos simples com tooltips do glossário. Pula `<code>`
 * e `<a>` para não modificar blocos de código ou links existentes.
 */
export function wrapGlossaryChildren(
  children: React.ReactNode,
  terms: GlossaryTerm[],
  alreadyUsed: Set<string>
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return wrapGlossaryText(child, terms, alreadyUsed);
    }

    if (!React.isValidElement(child)) return child;

    if (typeof child.type === "string" && SKIP_ELEMENTS.has(child.type)) {
      return child;
    }

    const childProps = child.props as { children?: React.ReactNode };
    if (!("children" in childProps)) return child;

    return React.cloneElement(child, {
      ...childProps,
      children: wrapGlossaryChildren(childProps.children, terms, alreadyUsed)
    } as React.Attributes & typeof childProps);
  });
}
