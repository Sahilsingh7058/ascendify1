import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ParticleAnimation from "../ParticleAnimation/ParticleAnimation";

export const Hero: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Simple parallax on mouse move
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      const x = (e.clientX - w / 2) / w;
      const y = (e.clientY - h / 2) / h;
      el.style.setProperty("--parallax-x", String(x * 10));
      el.style.setProperty("--parallax-y", String(y * 10));
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <section className="relative overflow-hidden bg-background text-foreground">
      {/* Particle overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <ParticleAnimation />
      </div>

      <div
        ref={ref}
        className="relative container flex min-h-[80vh] flex-col items-center justify-center py-24 text-center"
      >
        <h1
          className="max-w-4xl text-balance text-4xl md:text-6xl font-extrabold tracking-tight leading-tight 
                     text-sky-600 dark:text-sky-400 drop-shadow-[0_0_18px_rgba(56,189,248,0.45)]"
          style={{
            transform:
              "translate3d(calc(var(--parallax-x,0)*1px), calc(var(--parallax-y,0)*1px), 0)",
          }}
        >
          Ascendify – Elevate your skills, amplify your career.
        </h1>

        <p className="mt-5 max-w-2xl text-muted-foreground text-base md:text-lg">
          Discover your path. Build your skills. Land your dream role with
          AI-powered guidance.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Button
            asChild
            size="lg"
            variant="gradient"
            className="shadow-neon rounded-full border-2 border-sky-400/60 
                       text-white dark:text-white px-8 py-6"
          >
            <Link to="/assessment">Start Free Career Assessment</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-2 border-sky-500/60 
                       text-sky-600 dark:text-sky-400 px-8 py-6 bg-transparent"
          >
            <Link to="/roadmaps">Explore Skill Roadmaps</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
