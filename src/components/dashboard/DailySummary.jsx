"use client";

import { useMemo, useRef, useEffect } from "react";
import { formatDuration } from "@/lib/utils/timeUtils";
import FadeIn from "@/components/ui/FadeIn";
import gsap from "gsap";

export default function DailySummary({ records }) {
  const containerRef = useRef(null);

  // LOGIC PRESERVED EXACTLY
  const stats = useMemo(() => {
    if (!records || records.length === 0) {
      return [
        { label: "Active Work", value: "0h 00m" },
        { label: "Break Time", value: "0h 00m" },
        { label: "Total Logged", value: "0h 00m" },
        { label: "Activities", value: "0" },
      ];
    }

    let activeWorkSeconds = 0;
    let breakSeconds = 0;
    records.forEach(r => {
      if (r.category === "break") {
        breakSeconds += (r.duration || 0);
      } else {
        activeWorkSeconds += (r.duration || 0);
      }
    });
    const totalDurationSeconds = activeWorkSeconds + breakSeconds;

    return [
      { 
        label: "Active Work", 
        value: formatDuration(activeWorkSeconds),
        accent: "bg-blue-500",
        textColor: "text-blue-600 dark:text-blue-400"
      },
      { 
        label: "Break Time", 
        value: formatDuration(breakSeconds),
        accent: "bg-amber-500",
        textColor: "text-amber-600 dark:text-amber-400"
      },
      { 
        label: "Total Logged", 
        value: formatDuration(totalDurationSeconds),
        accent: "bg-emerald-500",
        textColor: "text-emerald-600 dark:text-emerald-400"
      },
      { 
        label: "Activities", 
        value: records.length.toString(),
        accent: "bg-purple-500",
        textColor: "text-purple-600 dark:text-purple-400"
      }
    ];
  }, [records]);

  // GSAP: Kinetic Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bento-card",
        { 
          scale: 0.8, 
          opacity: 0, 
          y: 40 
        },
        { 
          scale: 1, 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          stagger: 0.1, 
          ease: "elastic.out(1, 0.75)",
          delay: 0.1 
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [records]);

  return (
    <div ref={containerRef} className="w-full">
      <FadeIn delay={0.1} staggerChildren={true} stagger={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bento-card group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/[0.08] bg-white p-5 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:border-white/[0.08] dark:bg-zinc-950 dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
          >
            {/* Animated Hover Glow */}
            <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${stat.accent} opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-40`} />

            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${stat.accent} animate-pulse`} />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">
                  {stat.label}
                </p>
              </div>
              
              <div className="mt-4">
                <p className={`text-2xl font-black italic tracking-tight md:text-3xl lg:text-4xl ${stat.textColor || "text-slate-900 dark:text-zinc-100"}`}>
                  {stat.value}
                </p>
              </div>
            </div>

            {/* Bottom Graphic Detail */}
            <div className="relative z-10 mt-6 flex items-center justify-between">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent dark:via-zinc-800" />
                <svg 
                    className={`ml-2 h-4 w-4 opacity-0 transition-all duration-300 group-hover:opacity-100 ${stat.textColor}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </div>

            {/* Inset Border on Hover */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent transition-all duration-500 group-hover:border-black/5 dark:group-hover:border-white/5" />
          </div>
        ))}
      </FadeIn>
    </div>
  );
}