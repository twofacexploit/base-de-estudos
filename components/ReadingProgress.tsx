"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

function computeScrollPercentage(): number {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  if (scrollHeight <= 0) return 0;
  const pct = (scrollTop / scrollHeight) * 100;
  return Math.min(100, Math.max(0, pct));
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => setProgress(computeScrollPercentage());
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const style = { "--progress": `${progress}%` } as CSSProperties;

  return <div className="reading-progress" style={style} aria-hidden />;
}
