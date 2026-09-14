"use client";

import { getCategoryDetails } from "@/lib/constants";
import { formatTime12h, formatDuration } from "@/lib/utils/timeUtils";
import FadeIn from "@/components/ui/FadeIn";

export default function WorkTimeline({ records, onEdit, onDelete }) {
  if (!records || records.length === 0) {
    return (
      <FadeIn delay={0.4} direction="up" className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm p-8 min-h-[300px] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 text-slate-400 dark:text-zinc-500">
          <ClockIcon className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-zinc-100 mb-2">No work recorded yet</h2>
        <p className="text-slate-500 dark:text-zinc-400 max-w-sm">
          Activities you track or add manually will appear here in chronological order.
        </p>
      </FadeIn>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-100">Daily Timeline</h2>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 px-3 py-1 rounded-full">
          {records.length} {records.length === 1 ? 'Activity' : 'Activities'}
        </span>
      </div>
      
      <FadeIn staggerChildren={true} stagger={0.1} className="relative border-l-2 border-slate-200 dark:border-zinc-800 ml-4 sm:ml-6 mt-6 space-y-8 pb-4">
        {records.map((record, index) => {
          const category = getCategoryDetails(record.category);
          
          return (
            <div key={record.id} className="relative pl-6 sm:pl-8 group">
              {/* Timeline dot */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-blue-500 dark:border-blue-400 z-10 shadow-sm group-hover:scale-125 transition-transform duration-300" />
              
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                {/* Time block */}
                <div className="w-32 flex-shrink-0 pt-1">
                  <div className="text-sm font-bold text-slate-700 dark:text-zinc-200">
                    {formatTime12h(record.startTime)}
                  </div>
                  <div className="text-xs font-medium text-slate-400 dark:text-zinc-500 mt-1 flex items-center">
                    <ArrowDownIcon className="w-3 h-3 mr-1 inline-block opacity-50" />
                    {formatTime12h(record.endTime)}
                  </div>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-2 bg-blue-50 dark:bg-blue-900/20 inline-block px-2 py-0.5 rounded-md">
                    {formatDuration(record.duration)}
                  </div>
                </div>

                {/* Content block */}
                <div className="flex-1 bg-slate-50 dark:bg-zinc-950/50 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/80 hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors w-full">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-zinc-100 leading-snug">
                      {record.title}
                    </h3>
                    
                    {/* Action buttons (Edit/Delete) */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button 
                        onClick={() => onEdit(record)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                        title="Edit entry"
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(record)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/30 rounded-md transition-colors"
                        title="Delete entry"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-md mb-3 ${category.color}`}>
                    {category.label}
                  </span>

                  {record.description && (
                    <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
                      {record.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </FadeIn>
    </div>
  );
}

function ClockIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
}
function ArrowDownIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
}
function EditIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}
function TrashIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
}
