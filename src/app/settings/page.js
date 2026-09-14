"use client";

import { useState, useRef, useEffect } from "react";
import FadeIn from "@/components/ui/FadeIn";
import { toast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getCurrentDate } from "@/lib/utils/timeUtils";

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef(null);
  
  // Clear Data State
  const [clearDate, setClearDate] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'date' or 'all'

  useEffect(() => {
    setClearDate(getCurrentDate());
    setIsMounted(true);
  }, []);

  const handleExport = () => {
    try {
      const { exportWorkData } = require("@/lib/storage/workStorage");
      const dataStr = exportWorkData();
      
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      const date = new Date().toISOString().split("T")[0];
      link.href = url;
      link.download = `nit_tracker_backup_${date}.json`;
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast("Data exported successfully!");
    } catch (error) {
      toast("Failed to export data", "error");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target.result;
        const { importWorkData } = require("@/lib/storage/workStorage");
        
        const result = importWorkData(jsonString);
        if (result.success) {
          toast(`Successfully imported ${result.count} records!`);
          // Reload page to reflect changes across all states
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast(result.error || "Failed to import data", "error");
        }
      } catch (error) {
        toast("Invalid backup file", "error");
      }
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = "";
  };

  const requestClear = (type) => {
    setConfirmType(type);
    setIsConfirmOpen(true);
  };

  const executeClear = () => {
    const { deleteWorkRecordsByDate, clearWorkRecords } = require("@/lib/storage/workStorage");
    
    if (confirmType === "date") {
      if (!clearDate) return;
      const success = deleteWorkRecordsByDate(clearDate);
      if (success) {
        toast(`Records for ${clearDate} deleted successfully`);
      } else {
        toast("Failed to delete records", "error");
      }
    } else if (confirmType === "all") {
      const success = clearWorkRecords();
      if (success) {
        // Also clear notes? Let's just clear records as per prompt "clear all work records"
        toast("All work records cleared successfully");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast("Failed to clear all records", "error");
      }
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <FadeIn delay={0.1} className="pb-4 border-b border-slate-200 dark:border-zinc-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50">Settings & Data Management</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-1">Manage your local data backups and app preferences.</p>
      </FadeIn>

      <FadeIn staggerChildren={true} stagger={0.1} delay={0.2} className="space-y-6">
        
        {/* Export Data */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-zinc-100 flex items-center">
                <DownloadIcon className="w-5 h-5 mr-2 text-blue-500" /> Export Data
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-lg">
                Download a JSON backup of all your work records and daily notes. Keep this file safe.
              </p>
            </div>
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex-shrink-0"
            >
              Download Backup
            </button>
          </div>
        </div>

        {/* Import Data */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-zinc-100 flex items-center">
                <UploadIcon className="w-5 h-5 mr-2 text-indigo-500" /> Import Data
              </h2>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-lg">
                Restore your work records from a previous JSON backup file. This will merge or overwrite existing data.
              </p>
            </div>
            <button 
              onClick={handleImportClick}
              className="px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 font-medium rounded-lg shadow-sm transition-colors flex-shrink-0"
            >
              Upload Backup File
            </button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>
        </div>

        {/* Clear Data */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-red-200 dark:border-red-900/30 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 flex items-center mb-1">
              <TrashIcon className="w-5 h-5 mr-2" /> Danger Zone
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Permanently delete data from your browser. This action cannot be undone unless you have a backup.
            </p>
          </div>
          
          <div className="p-5 sm:p-6 space-y-6 bg-red-50/30 dark:bg-red-900/10">
            {/* Clear by Date */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-800 dark:text-zinc-200">Clear Records by Date</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400">Delete all work records for a specific day.</p>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="date" 
                  value={clearDate}
                  onChange={(e) => setClearDate(e.target.value)}
                  className="p-2 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 outline-none"
                />
                <button 
                  onClick={() => requestClear("date")}
                  className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 font-medium rounded-lg transition-colors flex-shrink-0"
                >
                  Clear Date
                </button>
              </div>
            </div>

            <hr className="border-red-100 dark:border-red-900/20" />

            {/* Clear All */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-800 dark:text-zinc-200">Clear ALL Data</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400">Wipe the entire database. Fresh start.</p>
              </div>
              <button 
                onClick={() => requestClear("all")}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow-sm transition-colors flex-shrink-0"
              >
                Clear Everything
              </button>
            </div>
          </div>
        </div>

      </FadeIn>

      <ConfirmDialog 
        isOpen={isConfirmOpen}
        title={confirmType === "all" ? "Clear ALL Data?" : `Clear data for ${clearDate}?`}
        message={
          confirmType === "all" 
            ? "Are you absolutely sure you want to wipe all your records? This is permanent."
            : `Are you sure you want to delete all work records for ${clearDate}?`
        }
        confirmText={confirmType === "all" ? "Yes, Wipe Everything" : "Yes, Delete Records"}
        isDestructive={true}
        onConfirm={executeClear}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
}

function DownloadIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
}
function UploadIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
}
function TrashIcon(props) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
}
