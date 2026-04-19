import {
  Shield,
  Cpu,
  TrendingUp,
  Server,
  Code2,
  Palette,
  Video,
  type LucideIcon
} from "lucide-react";
import type { BlockIconKey } from "@/lib/types";

const MAP: Record<BlockIconKey, LucideIcon> = {
  shield: Shield,
  cpu: Cpu,
  "trending-up": TrendingUp,
  server: Server,
  code: Code2,
  palette: Palette,
  video: Video
};

export function BlockIcon({
  iconKey,
  className,
  strokeWidth = 1.5,
  size = 20
}: {
  iconKey: BlockIconKey;
  className?: string;
  strokeWidth?: number;
  size?: number;
}) {
  const Icon = MAP[iconKey];
  if (!Icon) return null;
  return (
    <Icon
      className={className}
      strokeWidth={strokeWidth}
      width={size}
      height={size}
      aria-hidden
    />
  );
}
