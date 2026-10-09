import { useEffect, useRef } from 'react';
import './FloatingParticles.css';

const randomBetween = (min, max) => min + Math.random() * (max - min);

function createParticle(width, height) {
  const depth = Math.random();

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    depth,
    radius: 0.45 + depth * 1.05,
    alpha: 0.12 + depth * 0.3,
    driftX: randomBetween(-0.09, 0.09) * (0.45 + depth),
    driftY: randomBetween(-0.08, 0.08) * (0.45 + depth),
    phase: Math.random() * Math.PI * 2,
    twinkleSpeed: randomBetween(0.00012, 0.00032),
    lime: Math.random() < 0.085,
  };
}

export default function FloatingParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return undefined;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let width = 0;
    let height = 0;
    let particles = [];
    let frameId = 0;
    let lastFrameTime = 0;
    let elapsed = 0;
    let isVisible = !document.hidden;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const mobile = width < 700;
      const density = mobile ? 0.000065 : 0.000085;
      const count = Math.min(mobile ? 52 : 105, Math.max(mobile ? 26 : 42, Math.round(width * height * density)));
      particles = Array.from({ length: count }, () => createParticle(width, height));
      draw(0, true);
    };

    const draw = (timestamp, staticFrame = false) => {
      context.clearRect(0, 0, width, height);

      const reducedMotion = motionQuery.matches;
      const delta = lastFrameTime ? Math.min(timestamp - lastFrameTime, 40) : 16;
      lastFrameTime = timestamp;
      if (!reducedMotion && !staticFrame) elapsed += delta;
      pointer.x += (pointer.targetX - pointer.x) * 0.025;
      pointer.y += (pointer.targetY - pointer.y) * 0.025;

      particles.forEach((particle) => {
        if (!reducedMotion && !staticFrame) {
          particle.x += particle.driftX * delta;
          particle.y += particle.driftY * delta;
          if (particle.x < -4) particle.x = width + 4;
          if (particle.x > width + 4) particle.x = -4;
          if (particle.y < -4) particle.y = height + 4;
          if (particle.y > height + 4) particle.y = -4;
        }

        const parallax = reducedMotion ? 0 : particle.depth * 5;
        const x = particle.x + pointer.x * parallax;
        const y = particle.y + pointer.y * parallax;
        const shimmer = reducedMotion ? 1 : 0.88 + Math.sin(elapsed * particle.twinkleSpeed + particle.phase) * 0.12;
        const opacity = particle.alpha * shimmer;
        context.beginPath();
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = particle.lime
          ? `rgba(163, 230, 53, ${opacity * 0.62})`
          : `rgba(190, 199, 214, ${opacity})`;
        context.fill();
      });
    };

    const animate = (timestamp) => {
      if (!isVisible) return;
      draw(timestamp);
      if (!motionQuery.matches) frameId = window.requestAnimationFrame(animate);
    };

    const start = () => {
      window.cancelAnimationFrame(frameId);
      lastFrameTime = 0;
      if (isVisible && !motionQuery.matches) frameId = window.requestAnimationFrame(animate);
      else draw(0, true);
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      start();
    };
    const onPointerMove = (event) => {
      pointer.targetX = (event.clientX / Math.max(width, 1) - 0.5) * 2;
      pointer.targetY = (event.clientY / Math.max(height, 1) - 0.5) * 2;
    };

    resize();
    start();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    motionQuery.addEventListener?.('change', start);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      motionQuery.removeEventListener?.('change', start);
    };
  }, []);

  return <canvas aria-hidden="true" className="floating-particles" ref={canvasRef} />;
}
