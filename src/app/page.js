"use client";

import { useState, useEffect } from "react";
import DateSelector from "@/components/dashboard/DateSelector";
import { getCurrentDate, formatDateLong } from "@/lib/utils/timeUtils";
import FadeIn from "@/components/ui/FadeIn";
import WorkModal from "@/components/work/WorkModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import StartWorkModal from "@/components/work/StartWorkModal";
import ActiveWorkCard from "@/components/work/ActiveWorkCard";
import WorkTimeline from "@/components/dashboard/WorkTimeline";
import DailySummary from "@/components/dashboard/DailySummary";
import DailyNotes from "@/components/dashboard/DailyNotes";
import { deleteWorkRecord, getActiveSession, getWorkRecordsByDate } from "@/lib/storage/workStorage";
import { toast } from "@/components/ui/Toast";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isWorkModalOpen, setIsWorkModalOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  
  const [records, setRecords] = useState([]);
  const [recordToEdit, setRecordToEdit] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const fetchRecords = (date = selectedDate) => {
    if (!date) return;
    setRecords(getWorkRecordsByDate(date));
  };

  useEffect(() => {
    const today = getCurrentDate();
    setSelectedDate(today);
    fetchRecords(today);
    
    // Load active session from storage if it exists
    setActiveSession(getActiveSession());
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      fetchRecords(selectedDate);
    }
  }, [selectedDate, isMounted]);

  const handleSessionChange = () => {
    setActiveSession(getActiveSession());
    fetchRecords(); // Refresh records in case timer was stopped
  };

  const handleEditRecord = (record) => {
    setRecordToEdit(record);
    setIsWorkModalOpen(true);
  };

  const handleDeleteRequest = (record) => {
    setRecordToDelete(record);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      const success = deleteWorkRecord(recordToDelete.id);
      if (success) {
        toast("Work entry deleted successfully");
        fetchRecords();
      } else {
        toast("Failed to delete entry", "error");
      }
      setRecordToDelete(null);
    }
  };

  if (!isMounted) return null; // Avoid hydration mismatch for date

  return (
    <div className="space-y-6">
      {/* Header / Selected Date */}
      <FadeIn delay={0.1} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
            {selectedDate === getCurrentDate() ? "Today" : "Daily Log"}
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1">{formatDateLong(selectedDate)}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
          <DateSelector selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          
          <div className="flex space-x-2 w-full sm:w-auto">
            <button 
              onClick={() => {
                setRecordToEdit(null);
                setIsWorkModalOpen(true);
              }}
              className="flex-1 sm:flex-none px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-700 font-medium transition-colors"
            >
              + Add Work
            </button>
            <button 
              onClick={() => setIsStartModalOpen(true)}
              disabled={!!activeSession}
              className={`flex-1 sm:flex-none px-4 py-2 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center justify-center ${
                activeSession ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <PlayIcon className="w-4 h-4 mr-2" /> Start Work
            </button>
          </div>
        </div>
      </FadeIn>

      <DailySummary records={records} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Work Section */}
          {activeSession ? (
            <ActiveWorkCard session={activeSession} onStop={handleSessionChange} />
          ) : (
            <FadeIn delay={0.3} direction="up" className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/50 rounded-xl p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-2">Ready to work</h3>
              <p className="text-slate-600 dark:text-blue-100/70 mb-4">Click "Start Work" to begin tracking your activity for {selectedDate === getCurrentDate() ? "today" : "this date"}.</p>
            </FadeIn>
          )}

          {/* Timeline Section */}
          <WorkTimeline 
            records={records}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRequest}
          />
        </div>

        <div className="space-y-6">
          <DailyNotes selectedDate={selectedDate} />
        </div>
      </div>
      
      {/* Modals */}
      <WorkModal 
        isOpen={isWorkModalOpen} 
        onClose={() => {
          setIsWorkModalOpen(false);
          setTimeout(() => setRecordToEdit(null), 300); // clear after animation
        }} 
        selectedDate={selectedDate}
        editRecord={recordToEdit}
        onSave={() => fetchRecords()}
      />
      <StartWorkModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        onStart={handleSessionChange}
      />
      <ConfirmDialog 
        isOpen={!!recordToDelete}
        title="Delete Work Entry"
        message="Are you sure you want to delete this work entry? This action cannot be undone."
        confirmText="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setRecordToDelete(null)}
      />
    </div>
  );
}

function PlayIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>
}
