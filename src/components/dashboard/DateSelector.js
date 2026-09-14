"use client";

import { formatDateLong, getCurrentDate } from "@/lib/utils/timeUtils";
import { useRef } from "react";

export default function DateSelector({ selectedDate, setSelectedDate }) {
  const dateInputRef = useRef(null);
  
  const today = getCurrentDate();
  const isToday = selectedDate === today;

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d - 1);
    const newDateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    setSelectedDate(newDateStr);
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const date = new Date(y, m - 1, d + 1);
    
    const newDateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    
    // Optional: Prevent going into the future if that's a strict requirement
    // But requirement says: "Do not allow accidental creation of work records for invalid/future dates unless deliberate reason"
    // So selecting it is fine, we just might warn on creation.
    setSelectedDate(newDateStr);
  };

  const handleToday = () => {
    setSelectedDate(today);
  };

  const handleDateChange = (e) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-1 shadow-sm w-max">
      <button 
        onClick={handlePrevDay}
        className="p-1.5 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        title="Previous Day"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>

      <div className="flex items-center relative group">
        <button 
          onClick={() => dateInputRef.current?.showPicker()}
          className="flex items-center gap-2 px-4 py-2 font-semibold text-slate-700 dark:text-zinc-200 bg-slate-50 dark:bg-zinc-800/50 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <span>{isToday ? "Today" : formatDateLong(selectedDate)}</span>
          <svg className="w-4 h-4 text-slate-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </button>
        {/* Hidden date input for native picker */}
        <input 
          type="date"
          ref={dateInputRef}
          value={selectedDate}
          max={today}
          onChange={handleDateChange}
          className="hidden"
        />
      </div>

      <button 
        onClick={handleNextDay}
        disabled={isToday}
        className={`p-2 rounded-md transition-colors ${
          isToday 
            ? "text-slate-300 dark:text-zinc-700 cursor-not-allowed" 
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800"
        }`}
        title="Next Day"
      >
        <ChevronRightIcon className="w-5 h-5" />
      </button>

      {!isToday && (
        <button 
          onClick={handleToday}
          className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors ml-2"
        >
          Go to Today
        </button>
      )}
    </div>
  );
}

function ChevronLeftIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6"/></svg>
}

function ChevronRightIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"/></svg>
}
