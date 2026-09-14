"use client";

import { useState, useEffect } from "react";
import { getDailyNote, saveDailyNote } from "@/lib/storage/workStorage";
import { formatDateLong } from "@/lib/utils/timeUtils";
import FadeIn from "@/components/ui/FadeIn";
import { toast } from "@/components/ui/Toast";

export default function DailyNotes({ selectedDate }) {
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load note when date changes
  useEffect(() => {
    if (!selectedDate) return;
    const existingNote = getDailyNote(selectedDate);
    setNote(existingNote || "");
    setHasUnsavedChanges(false);
  }, [selectedDate]);

  const handleChange = (e) => {
    setNote(e.target.value);
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!selectedDate) return;
    
    setIsSaving(true);
    
    // Simulate slight delay for UX (shows saving state)
    setTimeout(() => {
      const success = saveDailyNote(selectedDate, note);
      if (success) {
        setHasUnsavedChanges(false);
        toast("Note saved successfully");
      } else {
        toast("Failed to save note", "error");
      }
      setIsSaving(false);
    }, 300);
  };

  // Optional: Auto-save with Cmd/Ctrl + S
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <FadeIn delay={0.5} direction="left" className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5 flex flex-col h-full min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-zinc-100 flex items-center">
          <BookIcon className="w-5 h-5 mr-2 text-blue-500" /> Daily Notes
        </h2>
        {hasUnsavedChanges && (
          <span className="text-xs font-medium text-amber-500 flex items-center">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1 animate-pulse"></span> Unsaved
          </span>
        )}
      </div>
      
      <textarea 
        value={note}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="flex-1 w-full p-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg resize-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700 dark:text-zinc-300 leading-relaxed"
        placeholder={`Any thoughts, reflections, or reminders for ${formatDateLong(selectedDate)}?`}
      ></textarea>
      
      <button 
        onClick={handleSave}
        disabled={!hasUnsavedChanges || isSaving}
        className={`mt-4 w-full px-4 py-2.5 rounded-lg font-medium transition-all flex justify-center items-center ${
          !hasUnsavedChanges 
            ? "bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 cursor-not-allowed" 
            : isSaving
            ? "bg-blue-500 text-white cursor-wait"
            : "bg-slate-800 hover:bg-slate-900 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-sm"
        }`}
      >
        {isSaving ? (
          <>
            <SpinnerIcon className="w-4 h-4 mr-2 animate-spin" /> Saving...
          </>
        ) : !hasUnsavedChanges ? (
          <>
            <CheckIcon className="w-4 h-4 mr-2" /> Saved
          </>
        ) : (
          "Save Note"
        )}
      </button>
    </FadeIn>
  );
}

function BookIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
}
function SpinnerIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
}
function CheckIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>
}
