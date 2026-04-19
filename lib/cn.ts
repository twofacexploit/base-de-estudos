type ClassDict = { [key: string]: boolean | null | undefined };

export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | ClassDict;

/**
 * Concatena condicionalmente valores em uma string de classes CSS.
 * Aceita strings, números, arrays aninhados e objetos `{ classe: boolean }`.
 *
 * Exemplo: `cn("btn", isActive && "btn-active", { "btn-lg": large })`.
 */
export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];

  const walk = (value: ClassValue) => {
    if (value === null || value === undefined || value === false) return;

    if (typeof value === "string" || typeof value === "number") {
      const str = String(value);
      if (str) out.push(str);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }

    if (typeof value === "object") {
      for (const key in value) {
        if (value[key]) out.push(key);
      }
    }
  };

  inputs.forEach(walk);
  return out.join(" ");
}
