import type { Block, BlockId } from "./types";

export const BLOCKS: Block[] = [
  {
    id: "ciberseguranca",
    slug: "ciberseguranca",
    number: 1,
    name: "Cibersegurança",
    shortName: "Ciber",
    iconKey: "shield",
    description:
      "Ataque, defesa e investigação digital. Ferramentas de hacking ético, privacidade e como sistemas são protegidos.",
    color: "#e06c75",
    colorClass: "theme-ciber",
    topicCount: 34
  },
  {
    id: "ia",
    slug: "ia-e-ferramentas",
    number: 2,
    name: "IA e Ferramentas",
    shortName: "IA",
    iconKey: "cpu",
    description:
      "Agentes, skills, MCPs, Claude Code e o ecossistema prático da inteligência artificial no dia a dia técnico.",
    color: "#a78bfa",
    colorClass: "theme-ia",
    topicCount: 28
  },
  {
    id: "marketing",
    slug: "marketing-e-financas",
    number: 3,
    name: "Marketing e Finanças",
    shortName: "Marketing",
    iconKey: "trending-up",
    description:
      "Funis de venda, tráfego pago, SEO programático, instrumentos financeiros e estratégias que transformam ads em receita.",
    color: "#5ccb9b",
    colorClass: "theme-marketing",
    topicCount: 8
  },
  {
    id: "infraestrutura",
    slug: "infraestrutura",
    number: 4,
    name: "Infraestrutura",
    shortName: "Infra",
    iconKey: "server",
    description:
      "Containers, nuvem, stacks SaaS otimizados e ferramentas para manter sistemas rodando de forma simples e barata.",
    color: "#e8a15e",
    colorClass: "theme-infra",
    topicCount: 6
  },
  {
    id: "programacao",
    slug: "programacao",
    number: 5,
    name: "Programação",
    shortName: "Código",
    iconKey: "code",
    description:
      "Linguagens por área, stacks de backend e como escolher a tecnologia adequada a cada objetivo técnico.",
    color: "#6aa9ff",
    colorClass: "theme-prog",
    topicCount: 2
  },
  {
    id: "design",
    slug: "design",
    number: 6,
    name: "Design e Criatividade",
    shortName: "Design",
    iconKey: "palette",
    description:
      "Referências visuais, erros e acertos em home pages e como documentar um design system em markdown.",
    color: "#f08fb8",
    colorClass: "theme-design",
    topicCount: 4
  },
  {
    id: "video",
    slug: "video",
    number: 7,
    name: "Vídeo e Mídia",
    shortName: "Vídeo",
    iconKey: "video",
    description:
      "Produção, dublagem, clonagem de voz e pipelines de IA para criação e adaptação de conteúdo em vídeo.",
    color: "#5ec6d1",
    colorClass: "theme-video",
    topicCount: 4
  }
];

export const TOTAL_TOPICS = BLOCKS.reduce((sum, b) => sum + b.topicCount, 0);

const blocksById = new Map<BlockId, Block>(BLOCKS.map((b) => [b.id, b]));
const blocksBySlug = new Map<string, Block>(BLOCKS.map((b) => [b.slug, b]));

export function getBlockBySlug(slug: string): Block | undefined {
  return blocksBySlug.get(slug);
}

export function getBlockById(id: string): Block | undefined {
  return blocksById.get(id as BlockId);
}

/**
 * Mapa pronto de `BlockId` para `Block` — evita recriar o objeto
 * `Object.fromEntries` a cada render em componentes que precisam dele.
 */
export const BLOCKS_BY_ID: Record<string, Block> = Object.fromEntries(
  BLOCKS.map((b) => [b.id, b])
);
