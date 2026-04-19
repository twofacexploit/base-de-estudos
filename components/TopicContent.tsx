"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { GlossaryTerm } from "@/lib/types";
import { pushRecent } from "@/lib/progress";
import { wrapGlossaryChildren } from "@/lib/glossaryWrap";
import { slugify } from "@/lib/text";

interface Props {
  slug: string;
  content: string;
  glossary: GlossaryTerm[];
}

/**
 * Extrai o texto puro de uma árvore de nós React (incluindo strings,
 * arrays e elementos aninhados). Usado para gerar IDs estáveis para
 * os cabeçalhos do markdown.
 */
function extractText(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const element = node as { props?: { children?: React.ReactNode } };
    return extractText(element.props?.children);
  }
  return "";
}

export function TopicContent({ slug, content, glossary }: Props) {
  useEffect(() => {
    pushRecent(slug);
  }, [slug]);

  // Set compartilhado durante o render para garantir que cada termo
  // do glossário vire tooltip apenas em sua primeira ocorrência.
  const usedTerms = new Set<string>();
  const wrap = (children: React.ReactNode) =>
    wrapGlossaryChildren(children, glossary, usedTerms);

  return (
    <div className="topic-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children, ...props }) => (
            <h1
              {...props}
              id={slugify(extractText(children))}
              className="heading-tight mt-12 scroll-mt-24 text-3xl font-bold text-fg first:mt-0"
            >
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2
              {...props}
              id={slugify(extractText(children))}
              className="heading-tight mt-12 scroll-mt-24 text-2xl font-bold text-fg first:mt-0"
            >
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3
              {...props}
              id={slugify(extractText(children))}
              className="mt-8 scroll-mt-24 text-lg font-semibold tracking-tight text-fg"
            >
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 {...props} className="mt-6 text-[15px] font-semibold text-fg">
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => (
            <p
              {...props}
              className="my-4 text-[15px] leading-[1.75] text-fg-muted"
            >
              {wrap(children)}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul
              {...props}
              className="my-5 list-disc space-y-2 pl-5 text-[15px] text-fg-muted marker:text-fg-faint"
            >
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol
              {...props}
              className="my-5 list-decimal space-y-2 pl-5 text-[15px] text-fg-muted marker:font-mono marker:text-fg-subtle"
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li {...props} className="leading-[1.7] pl-1">
              {wrap(children)}
            </li>
          ),
          a: (props) => (
            <a
              {...props}
              className="font-medium underline decoration-fg-subtle/40 decoration-1 underline-offset-[3px] transition-colors hover:decoration-current"
              style={{ color: "var(--block)" }}
            />
          ),
          strong: (props) => (
            <strong {...props} className="font-semibold text-fg" />
          ),
          em: (props) => <em {...props} className="italic text-fg" />,
          blockquote: ({ children, ...props }) => (
            <blockquote
              {...props}
              className="my-6 rounded-r-md border-l-2 bg-bg-subtle/50 py-3 pl-5 pr-4 italic text-fg"
              style={{ borderColor: "var(--block)" }}
            >
              {wrap(children)}
            </blockquote>
          ),
          code: ({ className, children, ...props }) => {
            // No react-markdown, blocos de código vêm com className
            // `language-xxx`; código inline vem sem className.
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  {...props}
                  className="rounded border border-border-subtle bg-bg-subtle px-1.5 py-0.5 font-mono text-[0.8125em] text-fg before:content-none after:content-none"
                >
                  {children}
                </code>
              );
            }
            return (
              <code
                {...props}
                className="block whitespace-pre font-mono text-[13px] leading-[1.65] text-fg"
              >
                {children}
              </code>
            );
          },
          pre: (props) => (
            <pre
              {...props}
              className="my-6 overflow-x-auto rounded-lg border border-border-subtle bg-bg-inset p-4"
            />
          ),
          table: (props) => (
            <div className="my-6 overflow-x-auto rounded-lg border border-border-subtle">
              <table {...props} className="w-full border-collapse text-[13px]" />
            </div>
          ),
          thead: (props) => (
            <thead
              {...props}
              className="bg-bg-subtle font-mono text-[11px] uppercase tracking-wider"
            />
          ),
          th: (props) => (
            <th
              {...props}
              className="border-b border-border-subtle px-4 py-2.5 text-left font-medium text-fg-muted"
            />
          ),
          td: ({ children, ...props }) => (
            <td
              {...props}
              className="border-b border-border-subtle/60 px-4 py-2.5 align-top text-fg-muted last:border-0"
            >
              {wrap(children)}
            </td>
          ),
          hr: (props) => (
            <hr {...props} className="my-10 border-border-subtle" />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
