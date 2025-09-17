import React, { useEffect, useRef } from 'react';
import styles from './ParticleAnimation.module.css'; // Import as a module

function ParticleAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const numParticles = 70;

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add(styles.particle);
      container.appendChild(particle);

      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.top = `${Math.random() * 100}vh`;
      particle.style.width = `${Math.random() * 3 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.opacity = `${Math.random() * 0.7 + 0.3}`;

      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 3;

      // Reference the scoped keyframe animation name
      particle.style.animation = `${styles.ascendParticle} ${duration}s linear ${delay}s infinite`;
    }
  }, []);

  return <div ref={containerRef} className="w-full h-full"></div>;
}

export default ParticleAnimation;