"use client";

import { useMemo } from "react";
import { formatDuration, formatTime12h } from "@/lib/utils/timeUtils";
import FadeIn from "@/components/ui/FadeIn";

export default function DailySummary({ records }) {
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
        color: "text-blue-600 dark:text-blue-400"
      },
      { 
        label: "Break Time", 
        value: formatDuration(breakSeconds),
        color: "text-amber-600 dark:text-amber-400"
      },
      { 
        label: "Total Logged", 
        value: formatDuration(totalDurationSeconds) 
      },
      { 
        label: "Activities", 
        value: records.length.toString() 
      }
    ];
  }, [records]);

  return (
    <FadeIn delay={0.1} staggerChildren={true} stagger={0.1} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md group overflow-hidden relative">
            {/* Subtle gradient effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <p className="text-sm text-slate-500 dark:text-zinc-400 font-medium">{stat.label}</p>
              <p className={`text-2xl font-semibold mt-1 tracking-tight ${stat.color || "text-slate-900 dark:text-zinc-50"}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </FadeIn>
  );
}
