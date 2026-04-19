import type {
  GlossaryTerm,
  SearchMatchField,
  SearchResult,
  Topic,
  TopicSummary
} from "./types";
import { normalizeText } from "./text";

const SNIPPET_MAX_LENGTH = 160;
const SNIPPET_CONTEXT_BEFORE = 60;
const SNIPPET_CONTEXT_AFTER = 100;

const TITLE_SCORE = 10;
const SUBTITLE_SCORE = 5;
const TAG_SCORE = 4;
const EXCERPT_SCORE = 3;
const CONTENT_SCORE = 2;

/**
 * Extrai um pequeno trecho centrado na primeira ocorrência do termo buscado.
 * Fallback: retorna o início do conteúdo quando o termo não aparece como substring
 * (pode acontecer após normalização).
 */
function buildSnippet(content: string, query: string): string {
  const normalizedContent = normalizeText(content);
  const matchIndex = normalizedContent.indexOf(normalizeText(query));

  if (matchIndex === -1) {
    return `${content.slice(0, SNIPPET_MAX_LENGTH).trim()}…`;
  }

  const start = Math.max(0, matchIndex - SNIPPET_CONTEXT_BEFORE);
  const end = Math.min(
    content.length,
    matchIndex + query.length + SNIPPET_CONTEXT_AFTER
  );

  const prefix = start > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  return prefix + content.slice(start, end).trim() + suffix;
}

/**
 * Retorna o campo mais relevante em que houve correspondência,
 * priorizando título > tag > conteúdo.
 */
function pickPrimaryField(
  titleHit: boolean,
  subtitleHit: boolean,
  tagHit: boolean
): SearchMatchField {
  if (titleHit || subtitleHit) return "title";
  if (tagHit) return "tag";
  return "content";
}

export function searchTopics(topics: Topic[], query: string): SearchResult[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];

  const needle = normalizeText(trimmed);
  const results: SearchResult[] = [];

  for (const topic of topics) {
    const titleHit = normalizeText(topic.title).includes(needle);
    const subtitleHit =
      !!topic.subtitle && normalizeText(topic.subtitle).includes(needle);
    const excerptHit =
      !!topic.excerpt && normalizeText(topic.excerpt).includes(needle);
    const tagHit =
      topic.tags?.some((tag) => normalizeText(tag).includes(needle)) ?? false;
    const contentHit = normalizeText(topic.content).includes(needle);

    let score = 0;
    if (titleHit) score += TITLE_SCORE;
    if (subtitleHit) score += SUBTITLE_SCORE;
    if (excerptHit) score += EXCERPT_SCORE;
    if (tagHit) score += TAG_SCORE;
    if (contentHit) score += CONTENT_SCORE;

    if (score === 0) continue;

    const { content, ...summary } = topic;
    results.push({
      topic: summary satisfies TopicSummary,
      score,
      matchedIn: pickPrimaryField(titleHit, subtitleHit, tagHit),
      snippet: contentHit ? buildSnippet(topic.content, trimmed) : undefined
    });
  }

  return results.sort((a, b) => b.score - a.score);
}

export function searchGlossary(
  terms: GlossaryTerm[],
  query: string
): GlossaryTerm[] {
  const trimmed = query.trim();
  if (trimmed.length === 0) return terms;

  const needle = normalizeText(trimmed);
  return terms.filter(
    (entry) =>
      normalizeText(entry.term).includes(needle) ||
      normalizeText(entry.definition).includes(needle)
  );
}
