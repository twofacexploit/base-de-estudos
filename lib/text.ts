/**
 * Utilitários de manipulação de texto compartilhados por busca,
 * geração de slugs e agrupamento alfabético.
 */

const DIACRITICS_REGEX = /[\u0300-\u036f]/g;

/**
 * Normaliza uma string para comparação insensível a caixa e acentos.
 * Usado por buscas fuzzy e filtros.
 */
export function normalizeText(input: string): string {
  return input.toLowerCase().normalize("NFD").replace(DIACRITICS_REGEX, "");
}

/**
 * Gera um slug ASCII estável a partir de um título livre.
 * Usado para IDs de cabeçalhos (TOC) e URLs de âncoras.
 */
export function slugify(input: string): string {
  return normalizeText(input)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Retorna a primeira letra de um termo, sem acentos, em caixa alta.
 * Usado para agrupamento alfabético no glossário.
 */
export function firstLetter(input: string): string {
  return normalizeText(input).trim().charAt(0).toUpperCase();
}
