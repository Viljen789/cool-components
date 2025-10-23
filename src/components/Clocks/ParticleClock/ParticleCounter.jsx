import React, { useEffect, useState, useRef } from 'react';
import { digitsMapBig } from '../../Digits14x8.jsx';
import styles from './ParticleCounter.module.css';

const nRandom = (arr, count) => {
  const result = [];
  const indices = new Set();
  while (indices.size < Math.min(count, arr.length)) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    indices.add(randomIndex);
  }
  indices.forEach(index => {
    result.push(arr[index]);
  });
  return result;
};

const getElementCenter = element => {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};

const move = (particle, digitBounds = []) => {
  let { x, y, vx, vy, size, xtarget, ytarget, isActive } = particle;

  if (isActive && xtarget >= 0 && ytarget >= 0) {
    const dx = xtarget - x;
    const dy = ytarget - y;
    vx = dx * 0.02;
    vy = dy * 0.02;
    x += vx;
    y += vy;
  } else {
    x += vx;
    y += vy;

    if (x + size > window.innerWidth) {
      x = window.innerWidth - size;
      vx = -vx;
    } else if (x < 0) {
      x = 0;
      vx = -vx;
    }

    if (y + size > window.innerHeight) {
      y = window.innerHeight - size;
      vy = -vy;
    } else if (y < 0) {
      y = 0;
      vy = -vy;
    }

    for (const bound of digitBounds) {
      const particleLeft = x;
      const particleRight = x + size;
      const particleTop = y;
      const particleBottom = y + size;

      const boxLeft = bound.left;
      const boxRight = bound.right;
      const boxTop = bound.top;
      const boxBottom = bound.bottom;

      if (
        particleRight > boxLeft &&
        particleLeft < boxRight &&
        particleBottom > boxTop &&
        particleTop < boxBottom
      ) {
        const overlapLeft = particleRight - boxLeft;
        const overlapRight = boxRight - particleLeft;
        const overlapTop = particleBottom - boxTop;
        const overlapBottom = boxBottom - particleTop;

        const minOverlap = Math.min(
          overlapLeft,
          overlapRight,
          overlapTop,
          overlapBottom
        );

        if (minOverlap === overlapLeft) {
          x = boxLeft - size;
          vx = -Math.abs(vx);
        } else if (minOverlap === overlapRight) {
          x = boxRight;
          vx = Math.abs(vx);
        } else if (minOverlap === overlapTop) {
          y = boxTop - size;
          vy = -Math.abs(vy);
        } else if (minOverlap === overlapBottom) {
          y = boxBottom;
          vy = Math.abs(vy);
        }

        vx *= 0.98;
        vy *= 0.98;
      }
    }
  }

  return { ...particle, x, y, vx, vy };
};

const ParticleCounter = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink'];
  const [particleCount, setParticleCount] = useState(0);
  const [amount] = useState(400);
  const [now, setNow] = useState(new Date());
  const [time, setTime] = useState('00:00:00');

  const particlesRef = useRef([]);
  const animationFrameRef = useRef();
  const digitsWrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const prevTimeRef = useRef(null);
  const digitBoundsRef = useRef([]);

  const updateDigitBounds = () => {
    if (!digitsWrapperRef.current) return;

    const bounds = [];
    const digitContainers = digitsWrapperRef.current.querySelectorAll(
      `.${styles.digitsContainer}`
    );

    digitContainers.forEach(container => {
      const rect = container.getBoundingClientRect();
      bounds.push({
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      });
    });

    const blockingEls = document.querySelectorAll('[data-particle-block]');
    blockingEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        bounds.push({
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
        });
      }
    });

    digitBoundsRef.current = bounds;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    contextRef.current = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      particlesRef.current = particlesRef.current.map(particle => {
        const { x, y, size } = particle;
        return {
          ...particle,
          x: Math.min(x, window.innerWidth - size),
          y: Math.min(y, window.innerHeight - size),
        };
      });

      updateDigitBounds();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const newTime = hours + ':' + minutes + ':' + seconds;
    setTime(newTime);
  }, [now]);

  useEffect(() => {
    updateDigitBounds();
  }, [time]);

  useEffect(() => {
    if (!digitsWrapperRef.current) {
      prevTimeRef.current = time;
      return;
    }

    if (particlesRef.current.length === 0) return;

    const prevTime = prevTimeRef.current;

    if (prevTime === null) {
      prevTimeRef.current = time;
      let particles = [...particlesRef.current];
      let availableParticles = particles.filter(
        p => p.assignedDigitIndex === null
      );

      for (let i = 0; i < time.length; i++) {
        const digitContainer = digitsWrapperRef.current.children[i];
        if (!digitContainer) continue;

        const dotElements = digitContainer.querySelectorAll(`.${styles.on}`);
        const newTargets = Array.from(dotElements).map(getElementCenter);
        if (newTargets.length === 0) continue;

        const newParts = nRandom(availableParticles, newTargets.length);
        for (let j = 0; j < newParts.length; j++) {
          const particle = newParts[j];
          const target = newTargets[j];
          particle.isActive = true;
          particle.assignedDigitIndex = i;
          particle.xtarget = target.x - particle.size / 2;
          particle.ytarget = target.y - particle.size / 2;
          availableParticles = availableParticles.filter(
            p => p.id !== particle.id
          );
        }
      }

      particlesRef.current = particles;
      return;
    }

    if (prevTime === time) return;

    let particles = [...particlesRef.current];
    let availableParticles = particles.filter(
      p => p.assignedDigitIndex === null
    );

    for (let i = 0; i < time.length; i++) {
      if (prevTime[i] === time[i]) continue;

      const particlesRelease = particles.filter(
        p => p.assignedDigitIndex === i
      );
      for (const particle of particlesRelease) {
        particle.isActive = false;
        particle.assignedDigitIndex = null;
        particle.xtarget = -1;
        particle.ytarget = -1;
        particle.vx = (Math.random() - 0.5) * 6;
        particle.vy = (Math.random() - 0.5) * 6;
        availableParticles.push(particle);
      }

      const digitContainer = digitsWrapperRef.current.children[i];
      if (!digitContainer) continue;

      const dotElements = digitContainer.querySelectorAll(`.${styles.on}`);
      const newTargets = Array.from(dotElements).map(getElementCenter);
      if (newTargets.length === 0) continue;

      const newParts = nRandom(availableParticles, newTargets.length);
      for (let j = 0; j < newParts.length; j++) {
        const particle = newParts[j];
        const target = newTargets[j];
        particle.isActive = true;
        particle.assignedDigitIndex = i;
        particle.xtarget = target.x - particle.size / 2;
        particle.ytarget = target.y - particle.size / 2;
        availableParticles = availableParticles.filter(
          p => p.id !== particle.id
        );
      }
    }

    particlesRef.current = particles;
    prevTimeRef.current = time;
  }, [time, particleCount]);

  useEffect(() => {
    const updateParticles = () => {
      const ctx = contextRef.current;
      if (!ctx) return;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particlesRef.current = particlesRef.current.map(p => {
        const updated = move(p, digitBoundsRef.current);

        ctx.beginPath();
        ctx.arc(
          updated.x + updated.size / 2,
          updated.y + updated.size / 2,
          updated.size / 2,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = updated.color;
        ctx.globalAlpha = updated.isActive ? 1 : 0.5;
        ctx.fill();

        return updated;
      });

      animationFrameRef.current = requestAnimationFrame(updateParticles);
    };

    animationFrameRef.current = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < amount; i++) {
      const size = Math.random() * 10 + 5;
      const x = Math.random() * (window.innerWidth - size);
      const y = Math.random() * (window.innerHeight - size);
      const vx = (Math.random() - 0.5) * 2;
      const vy = (Math.random() - 0.5) * 2;
      const color = colors[Math.floor(Math.random() * colors.length)];
      newParticles.push({
        x,
        y,
        vx,
        vy,
        size,
        color,
        id: Date.now() + i,
        xtarget: -1,
        ytarget: -1,
        isActive: false,
        assignedDigitIndex: null,
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];
    setParticleCount(particlesRef.current.length);

    setTimeout(updateDigitBounds, 0);
  }, []);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        className={styles.particleCanvas}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />

      <div className={styles.digitsWrapper} ref={digitsWrapperRef}>
        {Array.from(time).map((digit, dIdx) => (
          <div key={`digit-${dIdx}`} className={styles.digitsContainer}>
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} className={styles.row}>
                {Array.from({ length: 8 }, (_, j) => {
                  const index = i * 8 + j;
                  const on = digitsMapBig[digit]
                    ? digitsMapBig[digit][index]
                    : 0;
                  return (
                    <div
                      key={`${i}-${dIdx}-${j}`}
                      className={`${styles.pixel} ${on ? styles.on : ''}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticleCounter;
