import React, { useEffect, useState, useRef } from 'react';
import { digitsMapBig } from '../Digits14x8.jsx';

const ParticleCounter = () => {
  const colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink'];
  const [particles, setParticles] = useState([]);
  const [amount, setAmount] = useState(30);
  const animationFrameRef = useRef();
  const [digitToShow, setDigitToShow] = useState('5');

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  };

  const createParticles = () => {
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
      });
    }
    setParticles(prevParticles => [...prevParticles, ...newParticles]);
  };

  useEffect(() => {
    const updateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let { x, y, vx, vy, size } = particle;

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

          return { ...particle, x, y, vx, vy };
        })
      );

      animationFrameRef.current = requestAnimationFrame(updateParticles);
    };
    animationFrameRef.current = requestAnimationFrame(updateParticles);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          const { x, y, size } = particle;
          const newX = Math.min(x, window.innerWidth - size);
          const newY = Math.min(y, window.innerHeight - size);
          return { ...particle, x: newX, y: newY };
        })
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={containerStyle}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            backgroundColor: particle.color,
            position: 'absolute',
            transform: `translate3d(${particle.x}px, ${particle.y}px, 0)`,
            borderRadius: '50%',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          aria-hidden="true"
        >
          {'\u00A0'}
        </div>
      ))}
      <div>
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            display: 'grid',
            gridTemplateRows: 'repeat(12, 15px)',
            gap: '1px',
            zIndex: 5,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              display: 'grid',
              gridTemplateRows: 'repeat(14, 15px)',
              gap: '1px',
              zIndex: 5,
            }}
          >
            {Array.from({ length: 14 }, (_, i) => (
              <div key={i} style={{ display: 'flex' }}>
                {Array.from({ length: 8 }, (_, j) => {
                  const index = i * 8 + j;
                  return (
                    <div
                      key={j}
                      style={{
                        width: '15px',
                        height: '15px',
                        backgroundColor: digitsMapBig[digitToShow][index] === 1 ? 'black' : 'transparent',
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 10,
        }}
      >
        <button onClick={createParticles}>Create Particles!</button>
        <p>{particles.length} particles</p>
        <button onClick={() => setParticles([])}>Reset</button>
      </div>
    </div>
  );
};

export default ParticleCounter;
