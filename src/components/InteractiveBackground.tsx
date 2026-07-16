import { useEffect, useRef, useState } from 'react';

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHomePage, setIsHomePage] = useState(
    () => window.location.pathname === '/',
  );

  useEffect(() => {
    const updatePath = () => {
      setIsHomePage(window.location.pathname === '/');
    };

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function pushState(...args) {
      originalPushState.apply(this, args);
      updatePath();
    };

    history.replaceState = function replaceState(...args) {
      originalReplaceState.apply(this, args);
      updatePath();
    };

    window.addEventListener('popstate', updatePath);

    // Check dark mode status
    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', updatePath);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Disable particle simulation if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: null as number | null, y: null as number | null, radius: 160 };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseSize: number;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.baseSize = Math.random() * 1.5 + 0.8;
        this.size = this.baseSize;
      }

      update(w: number, h: number) {
        // Move particle
        this.x += this.vx;
        this.y += this.vy;

        // Boundary bounce
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Interaction with mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distSq = dx * dx + dy * dy;
          const mouseRadiusSq = mouse.radius * mouse.radius;

          if (distSq < mouseRadiusSq) {
            // Gentle gravitational pull towards cursor
            const distance = Math.sqrt(distSq);
            const force = (mouse.radius - distance) / mouse.radius;
            this.x += (dx / (distance || 1)) * force * 0.6;
            this.y += (dy / (distance || 1)) * force * 0.6;
            this.size = this.baseSize * (1 + force * 0.8);
          } else {
            this.size = this.baseSize;
          }
        }
      }

      draw(c: CanvasRenderingContext2D, color: string) {
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fillStyle = color;
        c.fill();
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Particle density based on screen size
      const density = isHomePage
        ? window.innerWidth < 768
          ? 10
          : 24
        : window.innerWidth < 768
          ? 24
          : 48;
      particles = Array.from({ length: density }, () => new Particle(canvas.width, canvas.height));
    };

    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const drawConnections = (c: CanvasRenderingContext2D, colorRgb: string) => {
      const len = particles.length;
      const connectionLimit = 110;
      const connectionLimitSq = connectionLimit * connectionLimit;

      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionLimitSq) {
            const dist = Math.sqrt(distSq);
            const alpha = ((connectionLimit - dist) / connectionLimit) * (isDarkMode ? 0.05 : 0.07);
            c.strokeStyle = `rgba(${colorRgb}, ${alpha})`;
            c.lineWidth = 0.5;
            c.beginPath();
            c.moveTo(particles[i].x, particles[i].y);
            c.lineTo(particles[j].x, particles[j].y);
            c.stroke();
          }
        }

        // Draw connections to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const distSq = dx * dx + dy * dy;
          const mouseRadiusSq = mouse.radius * mouse.radius;

          if (distSq < mouseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const alpha = ((mouse.radius - dist) / mouse.radius) * (isDarkMode ? 0.07 : 0.1);
            c.strokeStyle = `rgba(${colorRgb}, ${alpha})`;
            c.lineWidth = 0.65;
            c.beginPath();
            c.moveTo(particles[i].x, particles[i].y);
            c.lineTo(mouse.x, mouse.y);
            c.stroke();
          }
        }
      }
    };

    let isAnimating = false;
    let isVisible = true;

    const tick = () => {
      if (!isAnimating) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Primary color RGB values (Teal: 20, 184, 166)
      const primaryRgb = '20, 184, 166';
      const particleColor = isDarkMode
        ? `rgba(20, 184, 166, ${isHomePage ? 0.045 : 0.1})`
        : `rgba(20, 184, 166, ${isHomePage ? 0.08 : 0.16})`;

      particles.forEach((p) => {
        p.update(canvas.width, canvas.height);
        p.draw(ctx, particleColor);
      });

      drawConnections(ctx, primaryRgb);

      animationFrameId = requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (!isAnimating && isVisible && !document.hidden) {
        isAnimating = true;
        tick();
      }
    };

    const stopAnimation = () => {
      isAnimating = false;
      cancelAnimationFrame(animationFrameId);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startAnimation();

    return () => {
      stopAnimation();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDarkMode, isHomePage]);

  return (
    <>
      {/* Canvas Particle Grid Background */}
      <canvas
        ref={canvasRef}
        className={`pointer-events-none fixed inset-0 -z-20 h-full w-full ${
          isHomePage ? 'opacity-20 dark:opacity-14' : 'opacity-50 dark:opacity-30'
        }`}
        aria-hidden="true"
      />
    </>
  );
}
