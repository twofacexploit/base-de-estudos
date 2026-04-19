"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { CommandTrigger } from "./CommandPalette";
import { TOTAL_TOPICS } from "@/lib/blocks";
import { useStudiedSlugs } from "@/lib/useProgress";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/", label: "Início" },
  { href: "/busca", label: "Buscar" },
  { href: "/glossario", label: "Glossário" }
] as const;

function isRouteActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const studiedCount = useStudiedSlugs().length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-all duration-300",
        scrolled
          ? "border-border-subtle bg-bg/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(74,222,128,0.06)]"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 group"
          aria-label="Base de Estudos, página inicial"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-accent/20 bg-accent/10 font-mono text-[11px] font-semibold text-accent transition-all group-hover:border-accent/40 group-hover:bg-accent/15 group-hover:shadow-glow-green-sm">
            BE
          </span>
          <span className="hidden text-[15px] font-semibold tracking-tight text-fg transition-colors group-hover:text-accent sm:inline">
            Base de Estudos
          </span>
        </Link>

        {/* Search — desktop */}
        <div className="hidden flex-1 md:block">
          <CommandTrigger className="w-full max-w-sm" />
        </div>

        {/* Nav — desktop */}
        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isRouteActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-fg-muted hover:bg-bg-hover hover:text-fg"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Progresso — desktop */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-accent/15 bg-accent/5 px-3 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-glow-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-fg-muted">
            <span className="text-accent font-semibold">{String(studiedCount).padStart(2, "0")}</span>
            {" / "}{TOTAL_TOPICS}
          </span>
        </div>

        {/* Hambúrguer — mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-bg-subtle text-fg-muted transition-colors hover:border-accent/30 hover:text-accent md:hidden"
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen
            ? <X className="h-4 w-4" strokeWidth={2} />
            : <Menu className="h-4 w-4" strokeWidth={2} />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="border-t border-border-subtle bg-bg/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-6xl space-y-3 px-4 py-4">
            <CommandTrigger className="w-full" />
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const active = isRouteActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-fg-muted hover:bg-bg-hover hover:text-fg"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center justify-between rounded-lg border border-accent/15 bg-accent/5 px-3 py-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-fg-muted">Progresso</span>
              <span className="font-mono text-[11px] text-fg-muted">
                <span className="text-accent font-semibold">{String(studiedCount).padStart(2, "0")}</span>
                {" / "}{TOTAL_TOPICS}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
