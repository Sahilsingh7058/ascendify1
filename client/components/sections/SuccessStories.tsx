import React from "react";
import Reveal from "@/components/effects/Reveal";

const testimonials = [
  {
    quote:
      "Ascendify's AI assessment identified my hidden potential in data science. Within 6 months, I transitioned from accounting to a data analyst role with a 40% salary increase!",
    initial: "P",
    name: "Priya Sharma",
    role: "Accountant → Data Analyst",
  },
  {
    quote:
      "The personalized roadmap and hands-on projects helped me master full-stack development. Now I'm working at a top tech company in Bangalore!",
    initial: "R",
    name: "Rahul Patel",
    role: "Student → Full Stack Developer",
  },
  {
    quote:
      "From manual testing to automation engineering in 8 months. The AI mentor guided me through every step of my career transformation.",
    initial: "A",
    name: "Anjali Singh",
    role: "Manual Tester → Automation Engineer",
  },
];

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const SuccessStories: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section className="container py-20">
      <Reveal>
        <h2 className="text-center text-3xl md:text-4xl font-extrabold tracking-tight">
          Success Stories
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
          Real people, real career transformations
        </p>
      </Reveal>

      <div className="mt-10">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((t, i) => (
              <div className="min-w-0 flex-[0_0_100%] px-4" key={t.name}>
                <Reveal delay={i * 120}>
                  <article className="relative">
                    <div className="rounded-2xl border-2 border-sky-600 bg-white/5 p-6">
                      <p className="text-sm leading-relaxed">{t.quote}</p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-full bg-sky-600 text-white font-bold">
                          {t.initial}
                        </div>
                        <div>
                          <div className="font-semibold">{t.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {t.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
        {/* Controls */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            aria-label="Previous"
            onClick={() => emblaApi?.scrollPrev()}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <ChevronLeft className="size-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`size-2 rounded-full ${selected === i ? "bg-sky-500" : "bg-sky-500/40"}`}
              />
            ))}
          </div>
          <button
            aria-label="Next"
            onClick={() => emblaApi?.scrollNext()}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
