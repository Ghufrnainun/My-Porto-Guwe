import { useEffect, useRef, useState } from "react";

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isHomePage, setIsHomePage] = useState(
    () => window.location.pathname === "/",
  );

  useEffect(() => {
    const updatePath = () => {
      setIsHomePage(window.location.pathname === "/");
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

    window.addEventListener("popstate", updatePath);

    const updateTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setIsDarkMode(isDark);
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", updatePath);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    if (!ctx) return;

    const CONNECTION_LIMIT = 120;
    const CONNECTION_LIMIT_SQ = CONNECTION_LIMIT * CONNECTION_LIMIT;
    const MOUSE_RADIUS = 140;
    const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
    const PRIMARY_RGB = "20, 184, 166";

    // Particle count: fewer = exponentially cheaper (connections are O(n²)).
    // Homepage has the mesh gradient already so canvas can be lighter.
    const density = isHomePage
      ? window.innerWidth < 768 ? 6 : 12
      : window.innerWidth < 768 ? 6 : 10;

    const particles: Float64Array[] = [];
    for (let i = 0; i < density; i++) {
      particles.push(new Float64Array([
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        Math.random() * 1.4 + 0.7,
        Math.random() * 1.4 + 0.7,
      ]));
    }

    const mouse = { x: -9999, y: -9999, active: false };
    let frameCount = 0;
    let animationFrameId = 0;

    const particleAlpha = isDarkMode
      ? (isHomePage ? 0.045 : 0.1)
      : (isHomePage ? 0.08 : 0.16);
    const particleColor = `rgba(20, 184, 166, ${particleAlpha})`;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => { mouse.active = false; };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < density; i++) {
        const p = particles[i];
        p[0] += p[2];
        p[1] += p[3];
        if (p[0] < 0 || p[0] > w) p[2] *= -1;
        if (p[1] < 0 || p[1] > h) p[3] *= -1;

        if (mouse.active) {
          const dx = mouse.x - p[0];
          const dy = mouse.y - p[1];
          const distSq = dx * dx + dy * dy;
          if (distSq < MOUSE_RADIUS_SQ) {
            const distance = Math.sqrt(distSq);
            const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
            p[0] += (dx / (distance || 1)) * force * 0.5;
            p[1] += (dy / (distance || 1)) * force * 0.5;
            p[5] = p[4] * (1 + force * 0.7);
          } else {
            p[5] = p[4];
          }
        }

        ctx.beginPath();
        ctx.arc(p[0], p[1], p[5], 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }

      // Draw connections every other frame on mobile
      if (frameCount % 2 === 0 || window.innerWidth >= 768) {
        const connAlpha = isDarkMode ? 0.05 : 0.07;
        const mouseAlpha = isDarkMode ? 0.07 : 0.1;
        for (let i = 0; i < density; i++) {
          const pi = particles[i];
          for (let j = i + 1; j < density; j++) {
            const pj = particles[j];
            const dx = pi[0] - pj[0];
            const dy = pi[1] - pj[1];
            const distSq = dx * dx + dy * dy;
            if (distSq < CONNECTION_LIMIT_SQ) {
              const dist = Math.sqrt(distSq);
              const alpha = ((CONNECTION_LIMIT - dist) / CONNECTION_LIMIT) * connAlpha;
              ctx.strokeStyle = `rgba(${PRIMARY_RGB}, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(pi[0], pi[1]);
              ctx.lineTo(pj[0], pj[1]);
              ctx.stroke();
            }
          }
          if (mouse.active) {
            const dx = pi[0] - mouse.x;
            const dy = pi[1] - mouse.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < MOUSE_RADIUS_SQ) {
              const dist = Math.sqrt(distSq);
              const alpha = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * mouseAlpha;
              ctx.strokeStyle = `rgba(${PRIMARY_RGB}, ${alpha})`;
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(pi[0], pi[1]);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
            }
          }
        }
      }

      frameCount++;
      animationFrameId = requestAnimationFrame(tick);
    };

    let isRunning = true;

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
        isRunning = false;
      } else if (!isRunning) {
        isRunning = true;
        animationFrameId = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isRunning) { isRunning = true; animationFrameId = requestAnimationFrame(tick); }
        } else {
          cancelAnimationFrame(animationFrameId);
          isRunning = false;
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDarkMode, isHomePage]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className={`pointer-events-none fixed inset-0 -z-20 h-full w-full ${
          isHomePage ? "opacity-20 dark:opacity-14" : "opacity-50 dark:opacity-30"
        }`}
        aria-hidden="true"
      />
    </>
  );
}
