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

const SCROLL_THRESHOLD = 4;

function isRouteActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function formatProgress(value: number): string {
  return String(value).padStart(2, "0");
}

export function Header() {
  const pathname = usePathname();
  const studiedCount = useStudiedSlugs().length;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu mobile ao navegar.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-200",
        scrolled
          ? "border-border-subtle bg-bg/85 backdrop-blur-lg"
          : "border-transparent bg-bg"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <BrandLink />

        <div className="hidden flex-1 md:block">
          <CommandTrigger className="w-full max-w-sm" />
        </div>

        <DesktopNav pathname={pathname} />

        <div className="hidden md:block">
          <ProgressIndicator studied={studiedCount} />
        </div>

        <MenuToggleButton
          open={menuOpen}
          onToggle={() => setMenuOpen((prev) => !prev)}
        />
      </div>

      {menuOpen && (
        <MobileMenu
          pathname={pathname}
          studied={studiedCount}
          onNavigate={() => setMenuOpen(false)}
        />
      )}
    </header>
  );
}

function BrandLink() {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-2 font-semibold tracking-tight"
      aria-label="Base de Estudos, página inicial"
    >
      <span
        className="grid h-7 w-7 place-items-center rounded-md border border-border-subtle bg-bg-elevated font-mono text-[11px] text-fg-muted"
        aria-hidden
      >
        BE
      </span>
      <span className="hidden text-[15px] text-fg sm:inline">
        Base de Estudos
      </span>
    </Link>
  );
}

function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <nav className="ml-auto hidden items-center gap-0.5 md:flex">
      {NAV_ITEMS.map((item) => {
        const active = isRouteActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              active
                ? "text-fg"
                : "text-fg-muted hover:bg-bg-hover hover:text-fg"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function ProgressIndicator({ studied }: { studied: number }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-bg-subtle px-2.5 py-1.5 font-mono text-[11px] text-fg-subtle">
      <span>PROGRESSO</span>
      <span className="text-fg">{formatProgress(studied)}</span>
      <span>/</span>
      <span>{TOTAL_TOPICS}</span>
    </div>
  );
}

function MenuToggleButton({
  open,
  onToggle
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-subtle bg-bg-subtle text-fg-muted md:hidden"
      aria-label="Menu"
      aria-expanded={open}
    >
      {open ? (
        <X className="h-4 w-4" strokeWidth={2} />
      ) : (
        <Menu className="h-4 w-4" strokeWidth={2} />
      )}
    </button>
  );
}

function MobileMenu({
  pathname,
  studied,
  onNavigate
}: {
  pathname: string;
  studied: number;
  onNavigate: () => void;
}) {
  return (
    <div className="border-t border-border-subtle md:hidden">
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-4">
        <CommandTrigger className="w-full" />
        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isRouteActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-bg-hover text-fg"
                    : "text-fg-muted hover:bg-bg-hover hover:text-fg"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center justify-between rounded-md border border-border-subtle bg-bg-subtle px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-fg-subtle">
          <span>Progresso</span>
          <span>
            <span className="text-fg">{formatProgress(studied)}</span>{" "}
            / {TOTAL_TOPICS}
          </span>
        </div>
      </div>
    </div>
  );
}
