"use client";

import { useState } from "react";
import SearchModal from "./SearchModal";
import { useTheme } from "@/context/ThemeContext";

export default function Header({ toggleSidebar, toggleTheme: propToggleTheme, isDarkMode: propIsDarkMode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const contextTheme = useTheme();

  // Use props if provided, otherwise fallback to context
  const isDarkMode = propIsDarkMode !== undefined ? propIsDarkMode : contextTheme?.isDarkMode;
  const toggleTheme = propToggleTheme || contextTheme?.toggleTheme;

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 transition-colors duration-200">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 lg:hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle sidebar navigation"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold tracking-tight text-slate-800 dark:text-zinc-100 hidden sm:block">
            NITC DAILY WORK TRACKER
          </h2>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Search Records"
            aria-label="Search records"
          >
            <SearchIcon className="w-5 h-5" />
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title={isDarkMode ? "Switch to white (light) mode" : "Switch to dark mode"}
            aria-label={isDarkMode ? "Switch to white (light) mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <SunIcon className="w-5 h-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <MoonIcon className="w-5 h-5 text-slate-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        </div>
      </header>
      
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function SunIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

