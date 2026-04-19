export type BlockId =
  | "ciberseguranca"
  | "ia"
  | "marketing"
  | "infraestrutura"
  | "programacao"
  | "design"
  | "video";

export type Difficulty = "iniciante" | "medio" | "avancado";

export type BlockIconKey =
  | "shield"
  | "cpu"
  | "trending-up"
  | "server"
  | "code"
  | "palette"
  | "video";

export interface Block {
  id: BlockId;
  slug: string;
  number: number;
  name: string;
  shortName: string;
  iconKey: BlockIconKey;
  description: string;
  color: string;
  colorClass: string;
  topicCount: number;
}

export interface TopicFrontmatter {
  id: string;
  slug: string;
  block: BlockId;
  number: string;
  title: string;
  subtitle?: string;
  difficulty: Difficulty;
  tags?: string[];
  related?: string[];
  excerpt?: string;
}

export interface Topic extends TopicFrontmatter {
  content: string;
}

export type TopicSummary = TopicFrontmatter;

export interface GlossaryTerm {
  term: string;
  definition: string;
  aliases?: string[];
}

export type SearchMatchField = "title" | "content" | "tag";

export interface SearchResult {
  topic: TopicSummary;
  score: number;
  matchedIn: SearchMatchField;
  snippet?: string;
}
