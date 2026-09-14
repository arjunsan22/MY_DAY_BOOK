"use client";

import { useState, useEffect, useRef } from "react";
import { getWorkRecords } from "@/lib/storage/workStorage";
import { CATEGORIES } from "@/lib/constants";
import { formatDateLong, formatDuration, formatTime12h } from "@/lib/utils/timeUtils";
import FadeIn from "@/components/ui/FadeIn";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simple debounce
    const timer = setTimeout(() => {
      const allRecords = getWorkRecords();
      const lowerQuery = query.toLowerCase();
      
      const filtered = allRecords.filter(r => 
        r.title?.toLowerCase().includes(lowerQuery) ||
        r.description?.toLowerCase().includes(lowerQuery) ||
        r.category?.toLowerCase().includes(lowerQuery)
      );
      
      // Sort by newest first
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      setResults(filtered);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-0">
      <div 
        className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <FadeIn direction="down" delay={0} ease="back.out(1.2)" className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[80vh]">
        <div className="flex items-center p-4 border-b border-slate-100 dark:border-zinc-800">
          <SearchIcon className="w-5 h-5 text-slate-400 dark:text-zinc-500 mr-3 flex-shrink-0" />
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, categories, or descriptions..."
            className="flex-1 bg-transparent border-none outline-none text-slate-800 dark:text-zinc-100 placeholder-slate-400 text-lg"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors ml-2"
          >
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-slate-100 dark:bg-zinc-800 rounded border border-slate-200 dark:border-zinc-700 mr-2">ESC</kbd>
            <CloseIcon className="w-5 h-5 sm:hidden" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2 bg-slate-50 dark:bg-zinc-950/50">
          {!query.trim() && (
            <div className="p-8 text-center text-slate-500 dark:text-zinc-400">
              <p>Type to search through all your historical records.</p>
            </div>
          )}

          {query.trim() && !isSearching && results.length === 0 && (
            <div className="p-8 text-center text-slate-500 dark:text-zinc-400">
              <p>No results found for "{query}"</p>
            </div>
          )}

          {isSearching && (
            <div className="p-8 text-center text-slate-400">
              <p className="animate-pulse">Searching...</p>
            </div>
          )}

          {!isSearching && results.length > 0 && (
            <div className="space-y-2 p-2">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-zinc-500 uppercase tracking-wider mb-3 px-2">
                {results.length} Results
              </h3>
              {results.map((record) => {
                const categoryDef = CATEGORIES.find(c => c.id === record.category) || { label: "Unknown", color: "bg-slate-100 text-slate-800" };
                
                return (
                  <div key={record.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-blue-300 dark:hover:border-blue-700 group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
                          {formatDateLong(record.date)}
                        </span>
                        <span className="text-slate-300 dark:text-zinc-700">&bull;</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${categoryDef.color}`}>
                          {categoryDef.label}
                        </span>
                      </div>
                      <h4 className="font-semibold text-slate-900 dark:text-zinc-100 truncate">{record.title}</h4>
                      {record.description && (
                        <p className="text-sm text-slate-600 dark:text-zinc-400 truncate mt-1">{record.description}</p>
                      )}
                    </div>
                    
                    <div className="text-left sm:text-right flex-shrink-0">
                      <div className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                        {formatTime12h(record.startTime)} - {formatTime12h(record.endTime)}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-zinc-500 mt-1">
                        {formatDuration(record.duration)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

function SearchIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
}
function CloseIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
}
