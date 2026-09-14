"use client";

import { useState, useEffect } from "react";
import { clearActiveSession, saveWorkRecord } from "@/lib/storage/workStorage";
import { formatDuration, formatTime12h, getCurrentTime24h } from "@/lib/utils/timeUtils";
import { getCategoryDetails } from "@/lib/constants";
import { toast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function ActiveWorkCard({ session, onStop }) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (!session) return;

    // Calculate initial elapsed
    const calcElapsed = () => {
      const diffMs = Date.now() - session.startTimeMs;
      return Math.floor(diffMs / 1000);
    };

    setElapsedSeconds(calcElapsed());

    // Update every second
    const interval = setInterval(() => {
      setElapsedSeconds(calcElapsed());
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  if (!session) return null;

  const categoryDetails = getCategoryDetails(session.category);

  const handleStopWork = () => {
    const finalDuration = elapsedSeconds;
    const endTime24h = getCurrentTime24h();

    const recordData = {
      title: session.title,
      description: session.description,
      category: session.category,
      date: session.date,
      startTime: session.startTime24h,
      endTime: endTime24h,
      duration: finalDuration
    };

    try {
      saveWorkRecord(recordData);
      clearActiveSession();
      toast("Work saved successfully");
      if (onStop) onStop();
    } catch (error) {
      toast("Failed to save work", "error");
    }
  };

  const handleCancelSession = () => {
    clearActiveSession();
    toast("Active session cancelled", "error");
    if (onStop) onStop();
  };

  return (
    <>
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-400 dark:border-blue-700 rounded-2xl p-6 shadow-md relative overflow-hidden animate-fade-in-up">
        {/* Pulse effect in background */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">
                Currently Working
              </h3>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1 mb-1">
              {session.title}
            </h2>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${categoryDetails.color}`}>
                {categoryDetails.label}
              </span>
              <span className="text-sm text-slate-600 dark:text-blue-200">
                Started at {formatTime12h(session.startTime24h)}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500 dark:text-blue-300 font-medium mb-1">Elapsed</p>
            <p className="text-3xl font-mono font-bold text-blue-700 dark:text-blue-400">
              {formatDuration(elapsedSeconds, true)}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 relative z-10 border-t border-blue-200 dark:border-blue-800/50 pt-5">
          <button 
            onClick={() => setIsConfirmOpen(true)}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-300 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
          >
            Cancel Timer
          </button>
          <button 
            onClick={handleStopWork}
            className="px-6 py-2 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
          >
            <StopIcon className="w-4 h-4 mr-2" fill="currentColor" /> Stop Work
          </button>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        title="Cancel Active Session"
        message="Are you sure you want to cancel this timer? The time tracked so far will be lost."
        confirmText="Yes, Cancel it"
        onConfirm={handleCancelSession}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </>
  );
}

function StopIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
}
