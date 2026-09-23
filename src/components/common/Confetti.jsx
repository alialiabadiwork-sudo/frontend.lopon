import React, { useEffect, useRef } from 'react';

/**
 * Lightweight, zero-dependency Confetti component.
 * Renders an optimized canvas animation over the viewport for ~2.8s then fades out.
 * Non-blocking (`pointer-events-none`) with zero layout shift.
 */
const Confetti = ({ duration = 2800, particleCount = 65, onComplete }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const colors = [
      '#F47A20', // Lopon Brand Orange
      '#FF9D43', // Light Orange
      '#FFD166', // Gold / Yellow
      '#06D6A0', // Mint Green
      '#118AB2', // Teal Blue
      '#EF476F', // Coral Red
      '#7B2CBF', // Purple
    ];

    // Initialize confetti particles
    const particles = Array.from({ length: particleCount }).map(() => {
      const angle = Math.random() * Math.PI - Math.PI / 2; // Spread upwards
      const speed = Math.random() * 8 + 4;
      return {
        x: width * 0.5 + (Math.random() - 0.5) * 160,
        y: height * 0.45 + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: -Math.sin(angle) * speed - Math.random() * 5 - 3,
        size: Math.random() * 7 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        opacity: 1,
        gravity: 0.22,
        drag: 0.985,
      };
    });

    const startTime = Date.now();

    const render = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.vx *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        if (progress > 0.65) {
          p.opacity = Math.max(0, 1 - (progress - 0.65) / 0.35);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [duration, particleCount, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100] w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  );
};

export default Confetti;
