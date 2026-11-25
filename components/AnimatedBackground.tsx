import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let frame = 0;

    const lines = 18; // Fewer lines for a cleaner look
    const verticalSpacing = height / 1.5 / lines;
    
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Time factor for animation
      const t = frame * 0.005;

      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        
        // Base Y position centered vertically
        const yBase = (height / 2) - ((lines * verticalSpacing) / 2) + (i * verticalSpacing);
        
        // Opacity fades out at top and bottom lines
        const centerDist = Math.abs(i - lines / 2);
        const opacity = Math.max(0.01, 0.08 - (centerDist * 0.005));
        
        // Use subtle black/dark gray for the lines to match the Cream/Black theme
        ctx.strokeStyle = `rgba(0, 0, 0, ${opacity * 1.5})`; 
        ctx.lineWidth = 1.5;

        // Draw curve
        for (let x = 0; x <= width; x += 10) {
          // Normalized positions
          const nx = x / width;
          const ny = i / lines;

          // Mouse interaction
          const dx = x - mouseRef.current.x;
          const dy = yBase - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const mouseInfluence = Math.max(0, 1 - dist / 400); // 400px radius

          // Wave calculations
          // Large slow wave
          const wave1 = Math.sin(nx * 5 + t + ny * 2) * 20;
          // Faster ripples
          const wave2 = Math.cos(nx * 12 - t * 2) * 10;
          // Mouse deformation
          const mouseWave = Math.sin(nx * 10 + t * 5) * (mouseInfluence * 40);

          const y = yBase + wave1 + wave2 + mouseWave;

          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }

      frame++;
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 bg-brand-cream pointer-events-none overflow-hidden">
      {/* Soft Gradient Overlay to blend lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-cream via-transparent to-brand-cream opacity-80" />
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
    </div>
  );
};

export default AnimatedBackground;