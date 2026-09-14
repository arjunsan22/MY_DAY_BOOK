"use client";

import { useState, useEffect, useMemo } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { formatDuration, formatDateLong } from "@/lib/utils/timeUtils";
import { CATEGORIES } from "@/lib/constants";

export default function ReportsPage() {
  const [records, setRecords] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [viewType, setViewType] = useState("month"); // 'month' or 'week'
  const [selectedPeriod, setSelectedPeriod] = useState("");

  useEffect(() => {
    const { getWorkRecords } = require("@/lib/storage/workStorage");
    const allRecords = getWorkRecords();
    setRecords(allRecords);
    
    // Auto-select current month if available
    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    setSelectedPeriod(currentMonthKey);
    
    setIsMounted(true);
  }, []);

  // Compute available periods based on data and viewType
  const availablePeriods = useMemo(() => {
    if (records.length === 0) return [];
    
    const periods = new Set();
    records.forEach(r => {
      const d = new Date(r.date);
      if (viewType === "month") {
        periods.add(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`);
      } else {
        // Simple week grouping by ISO week
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        periods.add(`${d.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`);
      }
    });
    
    return Array.from(periods).sort().reverse();
  }, [records, viewType]);

  // Ensure selectedPeriod is valid when viewType changes
  useEffect(() => {
    if (availablePeriods.length > 0 && !availablePeriods.includes(selectedPeriod)) {
      setSelectedPeriod(availablePeriods[0]);
    }
  }, [availablePeriods, selectedPeriod]);

  // Filter records by selected period
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const d = new Date(r.date);
      if (viewType === "month") {
        const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
        return monthKey === selectedPeriod;
      } else {
        const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
        const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        const weekKey = `${d.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
        return weekKey === selectedPeriod;
      }
    });
  }, [records, selectedPeriod, viewType]);

  // Calculate totals per category
  const categoryStats = useMemo(() => {
    const stats = {};
    let maxDuration = 0;
    
    filteredRecords.forEach(r => {
      if (!stats[r.category]) {
        stats[r.category] = { duration: 0, count: 0 };
      }
      stats[r.category].duration += (r.duration || 0);
      stats[r.category].count += 1;
    });

    const colorMap = {
      blue: "#3b82f6",
      emerald: "#10b981",
      amber: "#f59e0b",
      purple: "#8b5cf6",
      slate: "#64748b",
      rose: "#f43f5e",
      indigo: "#6366f1"
    };

    const result = Object.entries(stats).map(([catId, data]) => {
      const catDef = CATEGORIES.find(c => c.id === catId) || { label: "Unknown", color: "bg-slate-100" };
      if (data.duration > maxDuration) maxDuration = data.duration;
      
      const colorMatch = catDef.color.match(/bg-([a-z]+)-/);
      const baseColor = colorMatch ? colorMatch[1] : "slate";
      const hexColor = colorMap[baseColor] || colorMap.slate;

      return {
        id: catId,
        label: catDef.label,
        hexColor,
        badgeClass: catDef.color,
        duration: data.duration,
        count: data.count
      };
    }).sort((a, b) => b.duration - a.duration);

    return { items: result, maxDuration };
  }, [filteredRecords]);

  // Calculate daily stats for the day list
  const dayStats = useMemo(() => {
    const stats = {};
    filteredRecords.forEach(r => {
      if (!stats[r.date]) {
        stats[r.date] = { duration: 0, count: 0 };
      }
      stats[r.date].duration += (r.duration || 0);
      stats[r.date].count += 1;
    });

    return Object.entries(stats)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [filteredRecords]);

  // Format period label
  const formatPeriodLabel = (period) => {
    if (!period) return "";
    if (period.includes('-W')) {
      const [year, week] = period.split('-W');
      return `Week ${week}, ${year}`;
    } else {
      const [year, month] = period.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, 1);
      return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }
  };

  if (!isMounted) return null;

  const totalTimeSeconds = categoryStats.items.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <div className="space-y-6">
      <FadeIn delay={0.1} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Reports & Analytics</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">Track your time investment over time.</p>
        </div>
      </FadeIn>

      <FadeIn delay={0.2} className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div className="flex bg-slate-100 dark:bg-zinc-800 p-1 rounded-lg self-start">
            <button 
              onClick={() => setViewType("month")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewType === "month" 
                  ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm" 
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              Monthly
            </button>
            <button 
              onClick={() => setViewType("week")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewType === "week" 
                  ? "bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-400 shadow-sm" 
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200"
              }`}
            >
              Weekly
            </button>
          </div>
          
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="p-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
          >
            {availablePeriods.length === 0 && <option value="">No data available</option>}
            {availablePeriods.map(p => (
              <option key={p} value={p}>{formatPeriodLabel(p)}</option>
            ))}
          </select>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-xl">
            <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-zinc-500">
              <ChartIcon className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-zinc-200 mb-1">No data for this period</h3>
            <p className="text-sm text-slate-500 dark:text-zinc-400">Log some work activities to see analytics here.</p>
          </div>
        ) : (
          <div>
            <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-slate-600 dark:text-blue-300 font-medium">Total Tracked Time</h3>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{formatDuration(totalTimeSeconds)}</p>
              </div>
              <div className="text-right">
                <h3 className="text-slate-600 dark:text-blue-300 font-medium">Total Activities</h3>
                <p className="text-3xl font-bold text-blue-700 dark:text-blue-400">{filteredRecords.length}</p>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-6">Time by Category</h3>
            
            <FadeIn staggerChildren={true} stagger={0.08} className="space-y-6">
              {categoryStats.items.map((cat, index) => {
                const percentage = Math.max(5, (cat.duration / categoryStats.maxDuration) * 100);
                const totalPercentage = Math.round((cat.duration / totalTimeSeconds) * 100);
                
                return (
                  <div key={cat.id} className="relative group">
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.hexColor }}></span>
                        <span className="font-medium text-slate-800 dark:text-zinc-200">{cat.label}</span>
                        <span className="text-xs text-slate-500 dark:text-zinc-400">({cat.count} entries)</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 dark:text-zinc-100">{formatDuration(cat.duration)}</span>
                        <span className="text-xs text-slate-500 dark:text-zinc-400 ml-2">{totalPercentage}%</span>
                      </div>
                    </div>
                    {/* CSS Bar */}
                    <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: cat.hexColor }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </FadeIn>

            {/* Monthly Day List */}
            {viewType === "month" && dayStats.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-6 border-b border-slate-200 dark:border-zinc-800 pb-2">Active Days</h3>
                <FadeIn staggerChildren={true} stagger={0.08} direction="up" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {dayStats.map((day) => (
                    <div key={day.date} className="bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 transition-colors hover:border-blue-300 dark:hover:border-blue-700 group">
                      <div className="font-semibold text-slate-800 dark:text-zinc-100 mb-1">
                        {formatDateLong(day.date)}
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">{formatDuration(day.duration)}</span>
                        <span className="text-slate-500 dark:text-zinc-400">{day.count} activities</span>
                      </div>
                    </div>
                  ))}
                </FadeIn>
              </div>
            )}
          </div>
        )}
      </FadeIn>
    </div>
  );
}

function ChartIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18"/><rect x="7" y="10" width="4" height="7" rx="1"/><rect x="15" y="4" width="4" height="13" rx="1"/></svg>
}
