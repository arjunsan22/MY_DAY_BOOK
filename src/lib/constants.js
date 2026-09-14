export const CATEGORIES = [
  { id: "development", label: "Development", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
  { id: "testing", label: "Testing", color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300" },
  { id: "learning", label: "Learning", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
  { id: "lab-work", label: "Computer/Lab Work", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300" },
  { id: "documentation", label: "Documentation", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300" },
  { id: "meeting", label: "Meeting", color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300" },
  { id: "break", label: "Break", color: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300" },
  { id: "other", label: "Other", color: "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-300" }
];

export const DEFAULT_CATEGORY = "other";

export function getCategoryDetails(categoryId) {
  return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES.find(c => c.id === "other");
}
