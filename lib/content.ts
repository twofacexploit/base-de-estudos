import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type {
  BlockId,
  Difficulty,
  GlossaryTerm,
  Topic,
  TopicFrontmatter,
  TopicSummary
} from "./types";
import { BLOCKS } from "./blocks";

const CONTENT_DIR = path.join(process.cwd(), "content");
const TOPICS_DIR = path.join(CONTENT_DIR, "topicos");
const GLOSSARY_FILE = path.join(CONTENT_DIR, "glossario.md");

const DEFAULT_DIFFICULTY: Difficulty = "iniciante";
const GLOSSARY_LINE_REGEX = /^\s*-\s+\*\*(.+?)\*\*\s*[—:-]\s*(.+)$/;

/**
 * Cache em memória do módulo.
 *
 * O Next.js reutiliza o mesmo processo durante o build e entre páginas
 * estáticas, então ler o disco apenas uma vez evita dezenas de leituras
 * redundantes em um build com muitos tópicos.
 */
let topicsCache: Topic[] | null = null;
let glossaryCache: GlossaryTerm[] | null = null;

function stripContent({ content: _content, ...summary }: Topic): TopicSummary {
  return summary;
}

function parseFrontmatter(
  data: Record<string, unknown>,
  fallbackSlug: string
): TopicFrontmatter {
  const slug = typeof data.slug === "string" ? data.slug : fallbackSlug;
  return {
    id: typeof data.id === "string" ? data.id : slug,
    slug,
    block: data.block as BlockId,
    number: data.number != null ? String(data.number) : "",
    title: typeof data.title === "string" ? data.title : slug,
    subtitle: typeof data.subtitle === "string" ? data.subtitle : undefined,
    difficulty: (data.difficulty as Difficulty) ?? DEFAULT_DIFFICULTY,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    related: Array.isArray(data.related) ? (data.related as string[]) : [],
    excerpt: typeof data.excerpt === "string" ? data.excerpt : undefined
  };
}

function readTopicFile(filename: string): Topic | null {
  const filepath = path.join(TOPICS_DIR, filename);
  if (!fs.existsSync(filepath)) return null;

  const raw = fs.readFileSync(filepath, "utf8");
  const { data, content } = matter(raw);
  const fallbackSlug = filename.replace(/\.md$/, "");

  return {
    ...parseFrontmatter(data as Record<string, unknown>, fallbackSlug),
    content
  };
}

/**
 * Carrega todos os tópicos do diretório `content/topicos`, ordenados
 * pelo campo `number` em ordem numérica natural (ex.: 1.2 < 1.10).
 */
export function getAllTopics(): Topic[] {
  if (topicsCache) return topicsCache;
  if (!fs.existsSync(TOPICS_DIR)) return [];

  const topics = fs
    .readdirSync(TOPICS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readTopicFile)
    .filter((topic): topic is Topic => topic !== null)
    .sort((a, b) =>
      a.number.localeCompare(b.number, "pt-BR", { numeric: true })
    );

  topicsCache = topics;
  return topics;
}

export function getAllTopicSummaries(): TopicSummary[] {
  return getAllTopics().map(stripContent);
}

export function getTopicBySlug(slug: string): Topic | null {
  return getAllTopics().find((t) => t.slug === slug) ?? null;
}

export function getTopicsByBlock(blockId: BlockId): Topic[] {
  return getAllTopics().filter((t) => t.block === blockId);
}

/**
 * Retorna o tópico anterior e o próximo dentro do mesmo bloco.
 * Útil para a navegação prev/next no rodapé do artigo.
 */
export function getAdjacentTopics(slug: string): {
  prev: TopicSummary | null;
  next: TopicSummary | null;
} {
  const topic = getTopicBySlug(slug);
  if (!topic) return { prev: null, next: null };

  const siblings = getTopicsByBlock(topic.block);
  const index = siblings.findIndex((t) => t.slug === slug);
  const toSummary = (t: Topic | undefined) => (t ? stripContent(t) : null);

  return {
    prev: toSummary(siblings[index - 1]),
    next: toSummary(siblings[index + 1])
  };
}

/**
 * Faz parsing do `content/glossario.md`, extraindo cada linha no formato
 * `- **Termo** — definição` e ordenando por termo.
 */
export function getGlossary(): GlossaryTerm[] {
  if (glossaryCache) return glossaryCache;
  if (!fs.existsSync(GLOSSARY_FILE)) return [];

  const raw = fs.readFileSync(GLOSSARY_FILE, "utf8");
  const { content } = matter(raw);

  const terms: GlossaryTerm[] = [];
  for (const line of content.split("\n")) {
    const match = line.match(GLOSSARY_LINE_REGEX);
    if (!match) continue;
    terms.push({ term: match[1].trim(), definition: match[2].trim() });
  }

  terms.sort((a, b) => a.term.localeCompare(b.term, "pt-BR"));
  glossaryCache = terms;
  return terms;
}

/**
 * Estatística de tópicos carregados por bloco. Usada para telemetria
 * interna / páginas de status (não renderizada na UI atualmente).
 */
export function getBlockStats() {
  const summaries = getAllTopicSummaries();
  return BLOCKS.map((block) => ({
    block,
    loaded: summaries.filter((t) => t.block === block.id).length
  }));
}
