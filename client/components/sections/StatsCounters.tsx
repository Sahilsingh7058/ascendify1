import React, { useEffect, useRef, useState } from "react";
import Reveal from "@/components/effects/Reveal";

interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

const STATS: Stat[] = [
  { label: "Careers Transformed", value: 25000, suffix: "+" },
  { label: "Skill Roadmaps", value: 120, suffix: "+" },
  { label: "Success Rate", value: 92, suffix: "%" },
];

function useCountUp(
  target: number,
  start = 0,
  duration = 1600,
  enabled = true,
) {
  const [value, setValue] = useState(start);
  const ref = useRef<number>(start);

  useEffect(() => {
    if (!enabled) return;
    const startTs = performance.now();
    let raf = 0;
    const step = (ts: number) => {
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const current = Math.round(start + (target - start) * eased);
      if (current !== ref.current) {
        ref.current = current;
        setValue(current);
      }
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration, enabled]);

  return value;
}

export const StatsCounters: React.FC = () => {
  return (
    <section className="py-16 bg-[#009EC7] dark:bg-[#009EC7]">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 120}>
              <Counter stat={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

function Counter({ stat }: { stat: Stat }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const value = useCountUp(stat.value, 0, 1600, visible);
  return (
    <div ref={ref}>
      <div className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_22px_rgba(56,189,248,0.9)] dark:text-slate-900 dark:drop-shadow-[0_0_28px_rgba(255,255,255,0.75)]">
        {value.toLocaleString()} {stat.suffix ?? ""}
      </div>
      <div className="mt-2 text-sm text-white dark:text-slate-900">
        {stat.label}
      </div>
    </div>
  );
}

export default StatsCounters;
