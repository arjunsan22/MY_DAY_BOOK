/**
 * Constants
 */
const STORAGE_KEY = "nit_work_records";
const NOTES_KEY = "nit_daily_notes";
const ACTIVE_SESSION_KEY = "nit_active_session";

/**
 * Generate a unique ID
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Active Session Management
 */
export function getActiveSession() {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(ACTIVE_SESSION_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error reading active session", error);
    return null;
  }
}

export function startActiveSession(sessionData) {
  try {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    
    const session = {
      ...sessionData,
      startTimeMs: now.getTime(),
      date: dateStr,
      startTime24h: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    };
    
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
    return session;
  } catch (error) {
    console.error("Error starting active session", error);
    throw error;
  }
}

export function clearActiveSession() {
  try {
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing active session", error);
    return false;
  }
}


/**
 * Get all work records
 * @returns {Array} List of all work records
 */
export function getWorkRecords() {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading work records from localStorage", error);
    return [];
  }
}

/**
 * Get work records for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Array}
 */
export function getWorkRecordsByDate(date) {
  const records = getWorkRecords();
  return records.filter((record) => record.date === date).sort((a, b) => {
    // Sort by start time if available
    if (a.startTime && b.startTime) {
      return a.startTime.localeCompare(b.startTime);
    }
    return 0;
  });
}

/**
 * Save a new work record
 * @param {Object} recordData - The record data to save
 * @returns {Object} The saved record
 */
export function saveWorkRecord(recordData) {
  const records = getWorkRecords();
  
  const newRecord = {
    id: generateId(),
    ...recordData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  records.push(newRecord);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return newRecord;
  } catch (error) {
    console.error("Error saving work record", error);
    throw error;
  }
}

/**
 * Update an existing work record
 * @param {string} id - The record ID
 * @param {Object} updates - The fields to update
 * @returns {Object|null} The updated record or null if not found
 */
export function updateWorkRecord(id, updates) {
  const records = getWorkRecords();
  const recordIndex = records.findIndex((r) => r.id === id);
  
  if (recordIndex === -1) return null;
  
  const updatedRecord = {
    ...records[recordIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  records[recordIndex] = updatedRecord;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return updatedRecord;
  } catch (error) {
    console.error("Error updating work record", error);
    throw error;
  }
}

/**
 * Delete a work record
 * @param {string} id - The record ID
 * @returns {boolean} Success status
 */
export function deleteWorkRecord(id) {
  const records = getWorkRecords();
  const initialLength = records.length;
  
  const filteredRecords = records.filter((r) => r.id !== id);
  
  if (filteredRecords.length === initialLength) return false;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
    return true;
  } catch (error) {
    console.error("Error deleting work record", error);
    return false;
  }
}

/**
 * Delete all records for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 */
export function deleteWorkRecordsByDate(date) {
  const records = getWorkRecords();
  const filteredRecords = records.filter((r) => r.date !== date);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
    return true;
  } catch (error) {
    console.error("Error deleting records by date", error);
    return false;
  }
}

/**
 * Clear all work records
 */
export function clearWorkRecords() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing work records", error);
    return false;
  }
}

/**
 * Daily Notes Management
 */

export function getDailyNote(date) {
  if (typeof window === "undefined") return "";
  try {
    const data = localStorage.getItem(NOTES_KEY);
    if (!data) return "";
    const notes = JSON.parse(data);
    return notes[date] || "";
  } catch (error) {
    console.error("Error reading daily notes", error);
    return "";
  }
}

export function saveDailyNote(date, text) {
  try {
    const data = localStorage.getItem(NOTES_KEY);
    const notes = data ? JSON.parse(data) : {};
    
    notes[date] = text;
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error("Error saving daily note", error);
    return false;
  }
}

/**
 * Data Export and Import
 */

export function exportWorkData() {
  const workRecords = getWorkRecords();
  
  let dailyNotes = {};
  try {
    const notesData = localStorage.getItem(NOTES_KEY);
    if (notesData) {
      dailyNotes = JSON.parse(notesData);
    }
  } catch (e) {
    console.error("Error reading notes for export", e);
  }
  
  const exportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    workRecords,
    dailyNotes,
  };
  
  return JSON.stringify(exportData, null, 2);
}

export function importWorkData(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    // Basic validation
    if (!data.workRecords || !Array.isArray(data.workRecords)) {
      throw new Error("Invalid import format: missing workRecords array");
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.workRecords));
    
    if (data.dailyNotes && typeof data.dailyNotes === "object") {
      localStorage.setItem(NOTES_KEY, JSON.stringify(data.dailyNotes));
    }
    
    return { success: true, count: data.workRecords.length };
  } catch (error) {
    console.error("Error importing data", error);
    return { success: false, error: error.message };
  }
}
