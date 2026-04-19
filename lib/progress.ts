/**
 * Camada de persistência do progresso de estudo do usuário.
 *
 * Opera contra `localStorage` no navegador e é no-op no servidor
 * (SSR seguro). Dispara eventos `PROGRESS_EVENT` a cada escrita para
 * que componentes espalhados na página se mantenham sincronizados.
 */

const STORAGE_KEY_STUDIED = "study:studied";
const STORAGE_KEY_RECENT = "study:recent";
const MAX_RECENT_ENTRIES = 5;

export const PROGRESS_EVENT = "study:progress";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function safeParseArray(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function emitProgressChange(): void {
  if (!isBrowser()) return;
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function getStudied(): string[] {
  if (!isBrowser()) return [];
  return safeParseArray(localStorage.getItem(STORAGE_KEY_STUDIED));
}

export function isStudied(slug: string): boolean {
  return getStudied().includes(slug);
}

export function setStudied(slug: string, value: boolean): void {
  if (!isBrowser()) return;
  const current = new Set(getStudied());
  if (value) current.add(slug);
  else current.delete(slug);
  localStorage.setItem(STORAGE_KEY_STUDIED, JSON.stringify([...current]));
  emitProgressChange();
}

export function toggleStudied(slug: string): boolean {
  const next = !isStudied(slug);
  setStudied(slug, next);
  return next;
}

export function getRecent(): string[] {
  if (!isBrowser()) return [];
  return safeParseArray(localStorage.getItem(STORAGE_KEY_RECENT));
}

export function pushRecent(slug: string): void {
  if (!isBrowser()) return;
  const deduped = getRecent().filter((existing) => existing !== slug);
  deduped.unshift(slug);
  localStorage.setItem(
    STORAGE_KEY_RECENT,
    JSON.stringify(deduped.slice(0, MAX_RECENT_ENTRIES))
  );
  emitProgressChange();
}
