import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BackgroundDotsProps {
  className?: string;
  speed?: number; // parallax intensity
}

// Animated dotted background using CSS radial-gradient grid and slow panning.
export function BackgroundDots({
  className,
  speed = 0.25,
}: BackgroundDotsProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const y = window.scrollY * speed;
      el.style.transform = `translate3d(0, ${-y}px, 0)`;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Base (dark/light) */}
      <div className="absolute inset-0 dark:bg-[#0b1020] bg-[#f5f7fb]" />
      {/* Blue tiny dot grid rising upward */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.45)_1px,transparent_1px)] bg-[length:14px_24px] animate-bg-rise" />
      {/* Vignette */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(70%_60%_at_50%_20%,rgba(0,0,0,0.45),transparent_60%)] bg-[radial-gradient(70%_60%_at_50%_20%,rgba(0,0,0,0.06),transparent_60%)]" />
    </div>
  );
}

export default BackgroundDots;
