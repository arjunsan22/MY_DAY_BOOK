"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDestructive = true }) {
  const modalRef = useRef(null);

  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 30, scale: 0.95, opacity: 0 },
        { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.5)" }
      );
    }
  }, { dependencies: [isOpen] });

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onCancel} />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div ref={modalRef} className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl w-full max-w-sm pointer-events-auto overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-zinc-100 mb-2">{title}</h3>
            <p className="text-sm text-slate-600 dark:text-zinc-400">{message}</p>
          </div>
          
          <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-zinc-950/50 rounded-b-xl border-t border-slate-100 dark:border-zinc-800">
            <button 
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              {cancelText}
            </button>
            <button 
              onClick={() => {
                onConfirm();
                onCancel();
              }}
              className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm transition-colors ${
                isDestructive 
                  ? "bg-red-600 hover:bg-red-700" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
