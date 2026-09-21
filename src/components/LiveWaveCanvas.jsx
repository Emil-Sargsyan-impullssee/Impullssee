import { useEffect, useRef } from 'react';

export default function LiveWaveCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.parentElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = Math.max(1, canvas.parentElement.offsetWidth));
    let height = (canvas.height = Math.max(1, canvas.parentElement.offsetHeight));
    let step = 0;

    const render = () => {
      step += 0.015;
      ctx.clearRect(0, 0, width, height);

      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.lineWidth = j === 0 ? 2 : 1;

        const gradient = ctx.createLinearGradient(0, 0, width, 0);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)');
        gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.35)');
        gradient.addColorStop(1, 'rgba(163, 230, 53, 0.4)');
        ctx.strokeStyle = gradient;

        for (let x = 0; x <= width; x += 6) {
          const y =
            Math.sin(x * 0.008 + step + j * 0.5) * 20 +
            Math.cos(x * 0.004 + step * 0.4) * 15 +
            height / 2;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (canvas.parentElement) {
        width = canvas.width = Math.max(1, canvas.parentElement.offsetWidth);
        height = canvas.height = Math.max(1, canvas.parentElement.offsetHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="wave-canvas-bg" aria-hidden="true" />;
}
