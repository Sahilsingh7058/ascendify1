import React, { useEffect, useMemo, useRef, useState } from "react";

type Step = "Basic" | "Intermediate" | "Advanced";

type Section = { step: Step; title: string; items: string[] };

const sections: Section[] = [
  // Basic
  {
    step: "Basic",
    title: "C# Fundamentals",
    items: [
      "Syntax",
      "Types",
      "Variables",
      "Operators",
      "Control Flow",
      "Methods",
    ],
  },
  {
    step: "Basic",
    title: "OOP in C#",
    items: [
      "Classes & Objects",
      "Constructors",
      "Encapsulation",
      "Inheritance",
      "Polymorphism",
      "Interfaces",
      "Abstract Classes",
    ],
  },
  {
    step: "Basic",
    title: ".NET Basics",
    items: ["CLR / BCL", ".NET CLI", "NuGet", "Project Structure", "Debugging"],
  },
  {
    step: "Basic",
    title: "Collections & LINQ",
    items: [
      "List/Dictionary/HashSet",
      "LINQ Queries",
      "Deferred Execution",
      "Lambdas",
    ],
  },

  // Intermediate
  {
    step: "Intermediate",
    title: "ASP.NET Core MVC",
    items: [
      "Controllers",
      "Views/Razor",
      "Routing",
      "Model Binding",
      "Validation",
    ],
  },
  {
    step: "Intermediate",
    title: "ASP.NET Core Web API",
    items: [
      "REST Principles",
      "DTOs",
      "FluentValidation",
      "Filters",
      "Versioning",
    ],
  },
  {
    step: "Intermediate",
    title: "Entity Framework Core",
    items: [
      "DbContext",
      "Migrations",
      "Relationships",
      "LINQ-to-Entities",
      "Tracking",
      "Queries",
    ],
  },
  {
    step: "Intermediate",
    title: "Configuration & DI",
    items: [
      "Options Pattern",
      "IOptions",
      "IConfiguration",
      "Dependency Injection",
    ],
  },
  {
    step: "Intermediate",
    title: "Authentication & Authorization",
    items: ["Identity", "JWT", "Cookies", "Policies", "Roles"],
  },

  // Advanced
  {
    step: "Advanced",
    title: "Clean Architecture",
    items: [
      "Domain Layer",
      "Application Layer",
      "Infrastructure",
      "Presentation",
      "CQRS",
    ],
  },
  {
    step: "Advanced",
    title: "Testing & Quality",
    items: [
      "xUnit",
      "Moq",
      "Integration Tests",
      "Testcontainers",
      "Performance Profiling",
    ],
  },
  {
    step: "Advanced",
    title: "Microservices",
    items: [
      "APIs Gateway",
      "Service Discovery",
      "gRPC",
      "Resilience (Polly)",
      "Messaging (RabbitMQ/Kafka)",
    ],
  },
  {
    step: "Advanced",
    title: "Cloud & DevOps",
    items: [
      "Azure Basics",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Observability (Serilog, OpenTelemetry)",
    ],
  },
];

const stepColor: Record<Step, string> = {
  Basic: "#38bdf8",
  Intermediate: "#0ea5e9",
  Advanced: "#06b6d4",
};

function generatePath(
  segments: number,
  w = 1200,
  segH = 200, // Reduced from 320 for a more compact design
  startX = 200,
  topPad = 100,
) {
  let d = `M ${startX} ${topPad}`;
  let x = startX;
  let y = topPad;
  const leftX = w * 0.15;
  const rightX = w * 0.85;
  const ctrl = w * 0.2;
  for (let i = 0; i < segments; i++) {
    const dirRight = i % 2 === 0;
    const nextX = dirRight ? rightX : leftX;
    const nextY = y + segH;
    const c1x = x + (dirRight ? ctrl : -ctrl);
    const c2x = nextX + (dirRight ? -ctrl : ctrl);
    const c1y = y + segH * 0.3;
    const c2y = y + segH * 0.7;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${nextX} ${nextY}`;
    x = nextX;
    y = nextY;
  }
  const viewBox = { w, h: y + 150 };
  return { d, viewBox };
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setP(Math.max(0, Math.min(1, progress)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return p;
}

export default function DotNetRoadmap() {
  const segments = 14;
  const { d, viewBox } = useMemo(() => generatePath(segments), [segments]);

  const markers = useMemo(
    () =>
      sections.map((s, i) => ({
        id: `${s.step}-${s.title}`.toLowerCase().replace(/\s+/g, "-"),
        label: s.title,
        step: s.step,
        items: s.items,
        t: Math.min(0.98, (i + 1) / segments),
      })),
    [segments],
  );

  const svgRef = useRef<SVGSVGElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const [length, setLength] = useState(0);
  const [scale, setScale] = useState({ x: 1, y: 1, top: 0, left: 0 });
  const progress = useScrollProgress();

  useEffect(() => {
    const update = () => {
      if (!pathRef.current || !svgRef.current) return;
      const L = pathRef.current.getTotalLength();
      setLength(L);
      const rect = svgRef.current.getBoundingClientRect();
      setScale({
        x: rect.width / viewBox.w,
        y: rect.height / viewBox.h,
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    if (svgRef.current) ro.observe(svgRef.current);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [viewBox.w, viewBox.h]);

  const markerPositions = useMemo(() => {
    if (!pathRef.current || length === 0)
      return [] as { id: string; x: number; y: number; m: any }[];
    return markers.map((m) => {
      const p = pathRef.current!.getPointAtLength(length * m.t);
      return {
        id: m.id,
        x: p.x * scale.x + scale.left,
        y: p.y * scale.y + scale.top,
        m,
      };
    });
  }, [markers, length, scale]);

  const drawOffset = Math.max(0, length - length * progress);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-1 w-8 bg-sky-400" />
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-sky-400 drop-shadow-[0_0_18px_rgba(56,189,248,0.35)]">
              Full Stack Development – .NET
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl">
            From C# fundamentals to modern ASP.NET Core, EF Core, microservices,
            and cloud deployment.
          </p>
        </div>
      </div>

      <section className="relative mx-auto">
        <div className="relative" style={{ height: `${viewBox.h * 0.5}px` }}> {/* Reduced multiplier for smaller height */}
          <svg
            ref={svgRef}
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${viewBox.w} ${viewBox.h}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              d={d}
              stroke="#020617"
              strokeWidth={70}
              fill="none"
              transform="translate(4, 4)"
              opacity={0.6}
            />
            <path d={d} stroke="#0b1020" strokeWidth={60} fill="none" />
            <path d={d} stroke="#1f2937" strokeWidth={2} fill="none" />
            <path
              d={d}
              ref={pathRef}
              stroke="#38bdf8"
              strokeWidth={3}
              fill="none"
              strokeDasharray={length}
              strokeDashoffset={drawOffset}
              style={{
                transition: "stroke-dashoffset 0.1s linear",
                filter: "drop-shadow(0 0 8px rgba(56, 189, 248, 0.6))",
              }}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {markerPositions.map(({ id, x, y, m }, idx) => {
            const side = idx % 2 === 0 ? "right" : "left";
            const cardShift =
              side === "left"
                ? "-translate-x-[calc(100%+24px)]"
                : "translate-x-6";
            const align =
              side === "left"
                ? "items-end text-right"
                : "items-start text-left";
            const pinColor = stepColor[m.step as Step];
            const itemsText = (m.items as string[]).join(", ");
            return (
              <div
                key={id}
                className="group pointer-events-auto absolute z-20"
                style={{ left: x - 20, top: y - 20 }}
              >
                <div className="relative">
                  <div
                    className="h-12 w-12 rounded-full ring-4 ring-black/50 shadow-2xl transition-transform duration-200 group-hover:scale-110"
                    style={{ backgroundColor: pinColor }}
                  >
                    <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/80" />
                  </div>
                  <div
                    className={`absolute ${side === "left" ? "right-14" : "left-14"} top-0`}
                  >
                    <div className={`flex ${align} gap-2`}>
                      <div
                        className="rounded-full px-3 py-1 text-xs font-bold text-black shadow-lg"
                        style={{ backgroundColor: pinColor }}
                      >
                        {m.step}
                      </div>
                    </div>
                    <div className={`mt-2 ${align}`}>
                      <div className="text-white font-bold text-lg leading-tight max-w-xs hover:underline">
                        {m.label}
                      </div>
                    </div>
                    <div
                      className={`invisible absolute top-10 z-30 w-[720px] max-w-[80vw] origin-top scale-95 rounded-xl border border-slate-700 bg-slate-900/95 p-5 opacity-0 shadow-2xl backdrop-blur-sm transition-all duration-300 group-hover:visible group-hover:scale-100 group-hover:opacity-100 ${cardShift}`}
                      style={{ boxShadow: `0 0 30px rgba(56, 189, 248, 0.25)` }}
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: pinColor }}
                        />
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          {m.step} Level
                        </div>
                      </div>
                      <div className="mb-2 font-semibold text-white">
                        {m.label}
                      </div>
                      <div className="text-sm text-slate-200 leading-relaxed">
                        {itemsText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="relative z-10 px-6 py-12 mt-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-muted-foreground">
            <p className="mb-2">🚀 Build production-grade .NET apps</p>
            <p className="text-sm">
              Scroll up to explore each section • Hover over titles for detailed
              topics
            </p>
          </div>
          <div className="mt-6">
            <a
              href="#course"
              className="inline-block px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition"
            >
              Go to Course
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}