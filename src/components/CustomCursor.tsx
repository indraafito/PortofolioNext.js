"use client"; 
import { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type Point = { x: number; y: number };

const CustomCursor = () => {
  const { currentColor } = useTheme();

  // Number of tail dots (excluding the primary dot)
  const TAIL_COUNT = 10;

  // Refs for DOM nodes of dots (0 is primary dot, 1..N are tail)
  const dotsRef = useRef<Array<HTMLDivElement | null>>([]);

  // Positions used by the animation loop
  const positionsRef = useRef<Point[]>(Array.from({ length: TAIL_COUNT + 1 }, () => ({ x: -100, y: -100 })));
  const targetRef = useRef<Point>({ x: -100, y: -100 });

  // setup mouse listener
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // animation loop
  useEffect(() => {
    let raf = 0;

    const animate = () => {
      const positions = positionsRef.current;
      const target = targetRef.current;

      // First dot chases the target quickly
      positions[0].x += (target.x - positions[0].x) * 0.25;
      positions[0].y += (target.y - positions[0].y) * 0.25;

      // Each subsequent dot chases the previous one with slightly softer easing
      for (let i = 1; i <= TAIL_COUNT; i++) {
        const prev = positions[i - 1];
        positions[i].x += (prev.x - positions[i].x) * (0.16 + i * 0.01);
        positions[i].y += (prev.y - positions[i].y) * (0.16 + i * 0.01);
      }

      // Apply styles to DOM nodes
      for (let i = 0; i <= TAIL_COUNT; i++) {
        const el = dotsRef.current[i];
        if (!el) continue;
        const p = positions[i];
        const scale = 1 - i * 0.06; // gradually smaller
        const opacity = Math.max(0, 1 - i * 0.09);

        // Use translate3d for better performance
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${scale})`;
        el.style.opacity = `${opacity}`;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // helper to set refs from map
  const setDotRef = (el: HTMLDivElement | null, idx: number) => {
    dotsRef.current[idx] = el;
  };

  return (
    <>
      {Array.from({ length: TAIL_COUNT + 1 }).map((_, i) => {
        // primary dot is index 0 (slightly brighter), tail are 1..N
        const size = i === 0 ? 8 : Math.max(4, 8 - i);
        const z = 9999 - i; // primary on top
        const blur = i === 0 ? 8 : 4 + Math.round(i / 2);

        return (
          <div
            key={`cursor-dot-${i}`}
            ref={(el) => setDotRef(el, i)}
            className="fixed pointer-events-none"
            style={{
              left: 0,
              top: 0,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              position: "fixed",
              zIndex: z,
              transform: `translate(-50%, -50%)`,
              background: `hsl(var(--primary))`,
              boxShadow: `0 0 ${blur}px hsl(var(--primary) / ${i === 0 ? 0.95 : 0.6})`,
              border: i === 0 ? `1px solid hsl(var(--primary-glow) / 0.95)` : `1px solid transparent`,
              transition: "width 0.12s, height 0.12s",
              pointerEvents: "none",
              willChange: "transform, opacity",
            }}
          />
        );
      })}
    </>
  );
};

export default CustomCursor;
