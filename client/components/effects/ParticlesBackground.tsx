import React, { useEffect, useRef } from "react";

/**
 * Particle background animation based on user-provided vanilla JS.
 * Renders tiny glowing blue particles ascending vertically with varied speeds.
 */
export default function ParticlesBackground({
  count = 70,
}: {
  count?: number;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      container.appendChild(particle);

      // Randomize initial position and size
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = `${Math.random() * 0.7 + 0.3}`;

      // Randomize animation duration and delay
      const duration = Math.random() * 15 + 10; // 10-25s
      const delay = Math.random() * 15; // 0-15s
      particle.style.animation = `ascendParticle ${duration}s linear ${delay}s infinite`;
    }

    // Append CSS for particle animation
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      .particle {
        position: absolute;
        background-color: rgba(0, 191, 255, 0.7);
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(0, 191, 255, 0.8), 0 0 15px rgba(138, 43, 226, 0.5);
        pointer-events: none;
        animation: ascendParticle 20s linear infinite;
      }
      @keyframes ascendParticle {
        0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
        20% { opacity: 0.7; }
        80% { opacity: 0.5; }
        100% { transform: translateY(-50vh) scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(styleSheet);
    styleRef.current = styleSheet;

    // Cleanup
    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }
      if (container) container.innerHTML = "";
    };
  }, [count]);

  return (
    <div
      id="background-animations"
      ref={containerRef}
      className="pointer-events-none absolute inset-0 -z-10"
      aria-hidden
    />
  );
}
