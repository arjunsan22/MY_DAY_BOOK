"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ToastContainer from "@/components/ui/Toast";

export default function MainLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col">
          <div className="max-w-6xl mx-auto w-full flex-1">
            {children}
          </div>
          
<footer className="mt-28 mb-8 flex justify-center px-4">
  <div className="group relative inline-flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white/70 px-5 py-2 text-xs font-medium tracking-wide text-slate-600 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.07)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1 hover:border-slate-300 hover:bg-white/90 hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12)] dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:text-zinc-400 dark:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.4)] dark:hover:border-zinc-700 dark:hover:bg-zinc-900/90 dark:hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.6)]">
    
    {/* Ambient Glow on Hover */}
    <div className="pointer-events-none absolute -inset-0.5 rounded-full bg-gradient-to-r from-rose-500/20 via-pink-500/10 to-amber-500/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />

    <span className="relative text-slate-400 dark:text-zinc-500">Crafted with</span>
    
    {/* GSAP-Style Bouncy Heart */}
    <span className="relative flex items-center justify-center">
      <svg 
        className="h-3.5 w-3.5 text-rose-500 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-150 group-hover:-rotate-12" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </span>

    <span className="relative text-slate-400 dark:text-zinc-500">by</span>
    
    <span className="relative font-bold text-slate-900 dark:text-zinc-100 tracking-tight transition-colors duration-300 group-hover:text-rose-600 dark:group-hover:text-rose-400">
      Arjun
    </span>
  </div>
</footer>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
