import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CommandPaletteProvider } from "@/components/CommandPalette";
import { getAllTopicSummaries, getGlossary } from "@/lib/content";
import "./globals.css";

const SITE_URL = "https://base-de-estudos-production.up.railway.app";
const SITE_TITLE = "Base de Estudos — Tecnologia, IA e Cibersegurança";
const SITE_DESCRIPTION =
  "86 tópicos sobre Tecnologia, IA e Cibersegurança, explicados com clareza técnica.";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter"
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono"
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Base de Estudos"
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "pt_BR"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const topics = getAllTopicSummaries();
  const glossary = getGlossary();

  return (
    <html
      lang="pt-BR"
      className={`dark ${inter.variable} ${mono.variable}`}
    >
      <body className="flex min-h-screen flex-col antialiased">
        <CommandPaletteProvider topics={topics} glossary={glossary}>
          <Header />
          <div className="flex-1">{children}</div>
          <Footer />
        </CommandPaletteProvider>
      </body>
    </html>
  );
}
