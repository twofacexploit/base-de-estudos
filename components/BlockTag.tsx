import Link from "next/link";
import type { Block } from "@/lib/types";
import { BlockIcon } from "./BlockIcon";
import { cn } from "@/lib/cn";

export function BlockTag({
  block,
  asLink = true,
  className
}: {
  block: Block;
  asLink?: boolean;
  className?: string;
}) {
  const content = (
    <span
      className={cn(
        block.colorClass,
        "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all"
      )}
      style={{
        borderColor: `${block.color}30`,
        color: block.color,
        background: `${block.color}10`
      }}
    >
      <BlockIcon iconKey={block.iconKey} size={11} strokeWidth={2.25} />
      {block.shortName}
    </span>
  );

  if (!asLink) return content;
  return (
    <Link href={`/bloco/${block.slug}`} className={cn("hover:opacity-80 transition-opacity", className)}>
      {content}
    </Link>
  );
}
