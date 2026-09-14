"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CATEGORIES, DEFAULT_CATEGORY } from "@/lib/constants";
import { saveWorkRecord, updateWorkRecord } from "@/lib/storage/workStorage";
import { calculateDurationInSeconds, formatDuration } from "@/lib/utils/timeUtils";
import { toast } from "@/components/ui/Toast";

export default function WorkModal({ isOpen, onClose, selectedDate, onSave, editRecord = null }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [date, setDate] = useState(selectedDate);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState(0);
  const [hasOverlap, setHasOverlap] = useState(false);

  // Initialize form when opened
  useEffect(() => {
    if (isOpen) {
      if (editRecord) {
        setTitle(editRecord.title || "");
        setDescription(editRecord.description || "");
        setCategory(editRecord.category || DEFAULT_CATEGORY);
        setDate(editRecord.date || selectedDate);
        setStartTime(editRecord.startTime || "");
        setEndTime(editRecord.endTime || "");
      } else {
        setTitle("");
        setDescription("");
        setCategory(DEFAULT_CATEGORY);
        setDate(selectedDate);
        
        // Auto-fill times for a new entry to be around now
        const now = new Date();
        const start = `${now.getHours().toString().padStart(2, '0')}:00`;
        const end = `${(now.getHours() + 1).toString().padStart(2, '0')}:00`;
        setStartTime(start);
        setEndTime(end);
      }
    }
  }, [isOpen, editRecord, selectedDate]);

  // Recalculate duration automatically
  useEffect(() => {
    if (startTime && endTime) {
      const dur = calculateDurationInSeconds(startTime, endTime);
      setDuration(dur);
      
      // Check for overlap
      if (dur > 0 && date) {
        const { getWorkRecordsByDate } = require("@/lib/storage/workStorage");
        const dailyRecords = getWorkRecordsByDate(date);
        
        const overlap = dailyRecords.some(r => {
          if (editRecord && r.id === editRecord.id) return false;
          return startTime < r.endTime && r.startTime < endTime;
        });
        setHasOverlap(overlap);
      } else {
        setHasOverlap(false);
      }
    } else {
      setDuration(0);
      setHasOverlap(false);
    }
  }, [startTime, endTime, date, editRecord]);

  const modalRef = useRef(null);

  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 50, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.5)" }
      );
    }
  }, { dependencies: [isOpen] });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast("Title is required", "error");
      return;
    }
    
    if (!startTime || !endTime) {
      toast("Start and End times are required", "error");
      return;
    }

    if (duration < 0) {
      toast("End time cannot be before start time", "error");
      return;
    }

    const recordData = {
      title: title.trim(),
      description: description.trim(),
      category,
      date,
      startTime,
      endTime,
      duration
    };

    try {
      if (editRecord) {
        updateWorkRecord(editRecord.id, recordData);
        toast("Work updated successfully");
      } else {
        saveWorkRecord(recordData);
        toast("Work saved successfully");
      }
      if (onSave) onSave();
      onClose();
    } catch (error) {
      toast("Failed to save work", "error");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div ref={modalRef} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl w-full max-w-lg pointer-events-auto overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-zinc-100">
              {editRecord ? "Edit Work" : "Add Work manually"}
            </h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors">
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Start Time</label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1 flex justify-between">
                  <span>End Time</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{formatDuration(duration)}</span>
                </label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className={`w-full p-2.5 bg-slate-50 dark:bg-zinc-950 border rounded-lg text-sm outline-none focus:ring-2 ${duration < 0 ? 'border-red-500 focus:ring-red-500' : 'border-slate-200 dark:border-zinc-800 focus:ring-blue-500'}`}
                  required
                />
              </div>
            </div>
            
            {hasOverlap && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start text-amber-800 dark:text-amber-300 text-sm">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>Warning: This time period overlaps with an existing activity for this date.</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Title</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. PHP Learning"
                className="w-full p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What did you work on?"
                className="w-full h-24 p-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <button 
                type="button" 
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
              >
                {editRecord ? "Save Changes" : "Save Work"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

function CloseIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
