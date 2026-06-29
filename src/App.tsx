/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic dimensions handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = width;
          canvas.height = height;
        }
      }
    });
    resizeObserver.observe(container);

    // Initial setup
    const rect = container.getBoundingClientRect();
    if (canvasRef.current) {
      canvasRef.current.width = rect.width;
      canvasRef.current.height = rect.height;
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Soft ambient cursor trail on canvas
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const tick = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Clean off-white background with subtle trail clearing
      ctx.fillStyle = "rgba(250, 249, 246, 0.2)";
      ctx.fillRect(0, 0, w, h);

      const m = mouseRef.current;
      m.x += (m.targetX - m.x) * 0.08;
      m.y += (m.targetY - m.y) * 0.08;

      if (m.active) {
        // Very subtle warm beige-grey glow around cursor
        const aura = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 350);
        aura.addColorStop(0, "rgba(220, 215, 201, 0.22)");
        aura.addColorStop(0.5, "rgba(220, 215, 201, 0.06)");
        aura.addColorStop(1, "rgba(250, 249, 246, 0)");
        
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(m.x, m.y, 350, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(tick);
    };

    tick();
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const m = mouseRef.current;
    m.targetX = e.clientX - rect.left;
    m.targetY = e.clientY - rect.top;
    m.active = true;
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
  };

  const characters = ["来", "日", "创", "造"];

  return (
    <main
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center bg-[#faf9f6]/95 text-[#121212] select-none"
    >
      {/* Absolute Minimal Dynamic Canvas Layer */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0"
      />

      {/* Main Centered Typography Scene */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* Core 4 Characters Horizontal Line */}
        <div className="flex flex-row items-center justify-center gap-12 sm:gap-20 md:gap-24 lg:gap-32 select-none">
          {characters.map((char, index) => {
            return (
              <div
                key={index}
                className="relative flex flex-col items-center group cursor-grab active:cursor-grabbing"
              >
                {/* Tactile Motion Physics wrapper with organic entrada transition */}
                <motion.div
                  initial={{ opacity: 0, y: 70, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 1.8,
                    delay: index * 0.18,
                    ease: [0.16, 1, 0.3, 1], // Poetic super fluid ease out
                  }}
                  drag
                  dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                  dragElastic={0.4}
                  dragTransition={{ bounceStiffness: 400, bounceDamping: 24 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -12,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileDrag={{
                    scale: 1.15,
                  }}
                  className="relative pointer-events-auto select-none"
                >
                  {/* Outer delicate micro-anchor dot shown only during hovering */}
                  <span className="absolute -inset-2 rounded-full border border-neutral-300/0 group-hover:border-neutral-300/20 group-hover:scale-105 transition-all duration-500 ease-out pointer-events-none" />

                  {/* High art master character font */}
                  <span 
                    style={{ fontFamily: "'Noto Serif SC', serif" }}
                    className="block text-7xl sm:text-8xl md:text-9xl lg:text-[10.5rem] font-extralight text-[#1c1c1c] tracking-[0.1em] leading-none transition-all duration-700 select-none"
                  >
                    {char}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Elegant, ultra-fine vertical artistic text "未来已至" in bottom-right corner */}
      <motion.div
        initial={{ opacity: 0, x: 15, filter: "blur(4px)" }}
        animate={{ opacity: 0.6, x: 0, filter: "blur(0px)" }}
        transition={{ duration: 2.5, delay: 1.1, ease: "easeOut" }}
        style={{ 
          fontFamily: "'Noto Serif SC', serif",
          writingMode: "vertical-rl"
        }}
        className="absolute bottom-12 right-12 text-xs md:text-sm font-extralight tracking-[0.7em] text-neutral-400 pointer-events-none select-none transition-colors duration-700"
      >
        未来已至
      </motion.div>

      {/* Elegant, minimalist ICP registration link at the bottom center */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.45 }}
        whileHover={{ opacity: 0.8 }}
        transition={{ duration: 2.5, delay: 1.3, ease: "easeOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-[10px] md:text-xs font-light tracking-[0.2em] text-neutral-400 z-20"
      >
        <a 
          href="https://beian.miit.gov.cn/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-neutral-800 transition-colors duration-300 relative group py-1"
        >
          浙ICP备2025170013号-4
          <span className="absolute bottom-0 left-0 w-full h-[0.5px] bg-neutral-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </a>
      </motion.div>
    </main>
  );
}
