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
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center transform transition-all duration-300 animate-fade-in-up ${
            t.type === "success" 
              ? "bg-green-600 text-white" 
              : t.type === "error" 
              ? "bg-red-600 text-white"
              : "bg-slate-800 text-white"
          }`}
        >
          {t.type === "success" && <CheckIcon className="w-4 h-4 mr-2" />}
          {t.type === "error" && <AlertIcon className="w-4 h-4 mr-2" />}
          {t.message}
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
