/**
 * Format a duration in seconds to a human-readable string.
 * Examples: 45m, 1h 20m, 2h 05m, 7h 30m
 * 
 * @param {number} totalSeconds 
 * @param {boolean} showSeconds - Whether to include seconds in output (useful for active timer)
 * @returns {string} Formatted string
 */
export function formatDuration(totalSeconds, showSeconds = false) {
  if (totalSeconds == null || isNaN(totalSeconds) || totalSeconds < 0) return "0m";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    let result = `${hours}h`;
    if (minutes > 0 || !showSeconds) {
      result += ` ${minutes.toString().padStart(2, '0')}m`;
    }
    if (showSeconds) {
      result += ` ${seconds.toString().padStart(2, '0')}s`;
    }
    return result;
  }
  
  if (minutes > 0) {
    let result = `${minutes}m`;
    if (showSeconds) {
      result += ` ${seconds.toString().padStart(2, '0')}s`;
    }
    return result;
  }
  
  if (showSeconds) {
    return `${seconds}s`;
  }
  
  return "0m";
}

/**
 * Calculate the difference between two HH:MM string times in seconds
 * @param {string} startTime - "HH:MM" 
 * @param {string} endTime - "HH:MM"
 * @returns {number} duration in seconds
 */
export function calculateDurationInSeconds(startTime, endTime) {
  if (!startTime || !endTime) return 0;
  
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);
  
  const startTotalMinutes = startH * 60 + startM;
  const endTotalMinutes = endH * 60 + endM;
  
  // If end time is before start time (e.g. crossing midnight), we handle it by adding 24 hours
  let diffMinutes = endTotalMinutes - startTotalMinutes;
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60;
  }
  
  return diffMinutes * 60;
}

/**
 * Format a 24h time string (HH:MM) to 12h format (HH:MM AM/PM)
 * @param {string} time24 - "HH:MM"
 * @returns {string} - "HH:MM AM/PM"
 */
export function formatTime12h(time24) {
  if (!time24) return "";
  
  const [h, m] = time24.split(':');
  const hours = parseInt(h, 10);
  
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12; // Convert 0 to 12 for midnight
  
  return `${hours12.toString().padStart(2, '0')}:${m} ${period}`;
}

/**
 * Get current time in HH:MM format
 */
export function getCurrentTime24h() {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a YYYY-MM-DD date to a long display string.
 * Example: "Monday, September 14, 2026"
 * 
 * @param {string} dateString - "YYYY-MM-DD"
 * @returns {string}
 */
export function formatDateLong(dateString) {
  if (!dateString) return "";
  
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return dateString;
  }
}
