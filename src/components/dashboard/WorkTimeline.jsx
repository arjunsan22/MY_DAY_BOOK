"use client";

import { getCategoryDetails } from "@/lib/constants";
import { formatTime12h, formatDuration } from "@/lib/utils/timeUtils";
import FadeIn from "@/components/ui/FadeIn";

export default function WorkTimeline({ records, onEdit, onDelete }) {
  if (!records || records.length === 0) {
    return (
      <FadeIn
        delay={0.4}
        direction="up"
        className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-12 text-center shadow-sm backdrop-blur-sm dark:border-zinc-800/80 dark:from-zinc-900 dark:to-zinc-950 min-h-[320px] flex flex-col items-center justify-center"
      >
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-800/80 text-slate-400 dark:text-zinc-400">
          <span className="absolute inset-0 rounded-2xl bg-blue-500/5 blur-md dark:bg-blue-400/10 pointer-events-none" />
          <ClockIcon className="h-7 w-7 transition-transform duration-500 ease-out hover:rotate-12" />
        </div>
        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
          No work recorded yet
        </h2>
        <p className="mt-1.5 max-w-xs text-xs font-normal leading-relaxed text-slate-500 dark:text-zinc-400">
          Activities you track or add manually will populate here chronologically.
        </p>
      </FadeIn>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90 sm:p-7">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-5 dark:border-zinc-800/60">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
            Daily Timeline
          </h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">
            Overview of today&apos;s tracked activities
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/70 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {records.length} {records.length === 1 ? "Activity" : "Activities"}
        </span>
      </div>

      {/* Timeline Stream */}
      <FadeIn
        staggerChildren={true}
        stagger={0.1}
        className="relative mt-8 ml-3 sm:ml-5 pb-2"
      >
        {/* Continuous track line */}
        <div className="absolute left-[7px] top-3 bottom-3 w-[1.5px] bg-gradient-to-b from-blue-500 via-slate-200 to-slate-200/40 dark:from-blue-400 dark:via-zinc-800 dark:to-zinc-800/30" />

        <div className="space-y-7">
          {records.map((record) => {
            const category = getCategoryDetails(record.category);

            return (
              <div key={record.id} className="relative pl-7 sm:pl-9 group">
                {/* GSAP-Style Node Ring with Outer Pulse */}
                <div className="absolute left-0 top-3 flex items-center justify-center -translate-x-[0.5px]">
                  <span className="absolute -inset-1 rounded-full bg-blue-500/20 opacity-0 blur-[2px] transition-all duration-300 ease-out group-hover:scale-150 group-hover:opacity-100 dark:bg-blue-400/25" />
                  <span className="relative h-3.5 w-3.5 rounded-full border-2 border-blue-500 bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 group-hover:border-blue-600 dark:border-blue-400 dark:bg-zinc-900" />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-start">
                  {/* Time badge rail */}
                  <div className="w-full sm:w-28 flex-shrink-0 pt-1.5 flex sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-1">
                    <div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200 tabular-nums">
                        {formatTime12h(record.startTime)}
                      </div>
                      <div className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1 mt-0.5 tabular-nums">
                        <ArrowDownIcon className="w-2.5 h-2.5 opacity-60" />
                        {formatTime12h(record.endTime)}
                      </div>
                    </div>

                    <div className="text-[11px] font-medium tracking-tight text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100/60 dark:border-blue-900/40 px-2 py-0.5 rounded-md mt-1 tabular-nums">
                      {formatDuration(record.duration)}
                    </div>
                  </div>

                  {/* Card Container with GSAP hover elevation */}
                  <div className="w-full flex-1 rounded-xl border border-slate-200/70 bg-white/70 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06)] dark:border-zinc-800/70 dark:bg-zinc-950/40 dark:hover:border-zinc-700 dark:hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.4)]">
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100 leading-snug">
                        {record.title}
                      </h3>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0">
                        <button
                          onClick={() => onEdit(record)}
                          className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-950/50 transition-colors"
                          title="Edit entry"
                        >
                          <EditIcon className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(record)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-950/50 transition-colors"
                          title="Delete entry"
                        >
                          <TrashIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2">
                      <span
                        className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md ${category.color}`}
                      >
                        {category.label}
                      </span>
                    </div>

                    {record.description && (
                      <p className="text-xs font-normal leading-relaxed text-slate-600 dark:text-zinc-400 whitespace-pre-wrap">
                        {record.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </div>
  );
}

function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ArrowDownIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function EditIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}