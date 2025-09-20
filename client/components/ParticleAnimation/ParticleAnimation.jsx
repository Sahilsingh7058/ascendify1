import React, { useEffect } from 'react';
import './ParticleAnimation.css';

function ParticleAnimation() {
  const containerRef = React.useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const numParticles = 70;

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      container.appendChild(particle);

      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      particle.style.width = `${Math.random() * 3 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.opacity = `${Math.random() * 0.7 + 0.3}`;
      
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 3;
      
      particle.style.animation = `ascendParticle ${duration}s linear ${delay}s infinite`;
    }
  }, []);

  return <div ref={containerRef} className="w-full h-full"></div>;
}

export default ParticleAnimation;
