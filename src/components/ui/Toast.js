"use client";

import { useState, useEffect } from "react";

// Simple global event bus for toasts to avoid context boilerplate
export const toastEvent = new EventTarget();

export function toast(message, type = "success") {
  toastEvent.dispatchEvent(new CustomEvent("show-toast", { detail: { message, type } }));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = (e) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, ...e.detail }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };

    toastEvent.addEventListener("show-toast", handleToast);
    return () => toastEvent.removeEventListener("show-toast", handleToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className={`pointer-events-auto px-4 py-2.5 rounded-xl shadow-lg border text-xs font-semibold tracking-wide flex items-center gap-2.5 backdrop-blur-md transition-all duration-300 ${
            t.type === "success" 
              ? "bg-emerald-950/90 text-emerald-200 border-emerald-500/30 shadow-emerald-950/20" 
              : t.type === "error" 
              ? "bg-rose-950/90 text-rose-200 border-rose-500/30 shadow-rose-950/20"
              : "bg-zinc-900/90 text-zinc-100 border-zinc-700/40 shadow-black/30"
          }`}
        >
          {t.type === "success" && <CheckIcon className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
          {t.type === "error" && <AlertIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function CheckIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>
}
function AlertIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
}