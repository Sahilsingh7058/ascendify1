import React, { useEffect } from 'react';
import './ParticleAnimation.css';

function ParticleAnimation() {
  useEffect(() => {
    const backgroundAnimations = document.getElementById('background-animations');
    const numParticles = 70;

    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      backgroundAnimations.appendChild(particle);

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

  return <div id="background-animations"></div>;
}

export default ParticleAnimation;