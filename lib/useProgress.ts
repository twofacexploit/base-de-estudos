"use client";

import { useEffect, useState } from "react";
import { getRecent, getStudied, isStudied, PROGRESS_EVENT } from "./progress";

/**
 * Assina alterações locais de progresso, rodando `read()` no mount
 * e a cada evento `PROGRESS_EVENT` (mesma aba) ou `storage` (outras abas).
 */
function subscribeToProgress(read: () => void): () => void {
  read();
  window.addEventListener(PROGRESS_EVENT, read);
  window.addEventListener("storage", read);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, read);
    window.removeEventListener("storage", read);
  };
}

/** Lista de slugs já marcados como estudados, reativa a mudanças. */
export function useStudiedSlugs(): string[] {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    return subscribeToProgress(() => setSlugs(getStudied()));
  }, []);

  return slugs;
}

/** Booleano reativo indicando se o slug específico está estudado. */
export function useIsStudied(slug: string): boolean {
  const [studied, setStudied] = useState(false);

  useEffect(() => {
    return subscribeToProgress(() => setStudied(isStudied(slug)));
  }, [slug]);

  return studied;
}

/** Fila de slugs visitados recentemente, reativa a mudanças. */
export function useRecentSlugs(): string[] {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    return subscribeToProgress(() => setSlugs(getRecent()));
  }, []);

  return slugs;
}

/**
 * Indica se o componente já montou no cliente — útil para evitar
 * hidratação incorreta em conteúdo dependente de `localStorage`.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
