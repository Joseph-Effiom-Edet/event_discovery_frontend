import { format, parseISO, isToday, isTomorrow, isThisWeek, differenceInDays } from 'date-fns';

/**
 * Format a date to a readable string
 * @param {string} dateString - ISO date string
 * @param {string} formatString - Format string for date-fns
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, formatString = 'MMM d, yyyy') => {
  try {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' 
      ? parseISO(dateString) 
      : dateString;
    
    return format(date, formatString);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format time from ISO date string
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted time (e.g., "7:30 PM")
 */
export const formatTime = (dateString) => {
  try {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' 
      ? parseISO(dateString) 
      : dateString;
    
    return format(date, 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Get relative date description (Today, Tomorrow, Wednesday, etc.)
 * @param {string} dateString - ISO date string
 * @returns {string} - Relative date description
 */
export const getRelativeDateDescription = (dateString) => {
  try {
    if (!dateString) return '';
    
    const date = typeof dateString === 'string' 
      ? parseISO(dateString) 
      : dateString;
    
    if (isToday(date)) {
      return 'Today';
    } else if (isTomorrow(date)) {
      return 'Tomorrow';
    } else if (isThisWeek(date)) {
      return format(date, 'EEEE'); // Day of week
    } else {
      return format(date, 'MMM d, yyyy');
    }
  } catch (error) {
    console.error('Error getting relative date:', error);
    return '';
  }
};

/**
 * Format a date range
 * @param {string} startDateString - ISO start date string
 * @param {string} endDateString - ISO end date string
 * @returns {string} - Formatted date range
 */
export const formatDateRange = (startDateString, endDateString) => {
  try {
    if (!startDateString || !endDateString) return '';
    
    const startDate = parseISO(startDateString);
    const endDate = parseISO(endDateString);
    
    // Same day
    if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
      return `${format(startDate, 'EEE, MMM d, yyyy')} • ${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
    }
    
    // Different days
    return `${format(startDate, 'EEE, MMM d, yyyy h:mm a')} - ${format(endDate, 'EEE, MMM d, yyyy h:mm a')}`;
  } catch (error) {
    console.error('Error formatting date range:', error);
    return '';
  }
};

/**
 * Get days remaining until the event
 * @param {string} dateString - ISO date string
 * @returns {number} - Days remaining (0 for today)
 */
export const getDaysRemaining = (dateString) => {
  try {
    if (!dateString) return null;
    
    const date = parseISO(dateString);
    const today = new Date();
    
    // Set time to beginning of day for accurate day diff
    today.setHours(0, 0, 0, 0);
    
    const daysRemaining = differenceInDays(date, today);
    return daysRemaining < 0 ? 0 : daysRemaining;
  } catch (error) {
    console.error('Error calculating days remaining:', error);
    return null;
  }
};

/**
 * Check if an event has ended
 * @param {string} endDateString - ISO end date string
 * @returns {boolean} - True if event has ended
 */
export const hasEventEnded = (endDateString) => {
  try {
    if (!endDateString) return false;
    
    const endDate = parseISO(endDateString);
    const now = new Date();
    
    return endDate < now;
  } catch (error) {
    console.error('Error checking if event ended:', error);
    return false;
  }
};

/**
 * Check if an event is happening now
 * @param {string} startDateString - ISO start date string
 * @param {string} endDateString - ISO end date string
 * @returns {boolean} - True if event is happening now
 */
export const isEventHappeningNow = (startDateString, endDateString) => {
  try {
    if (!startDateString || !endDateString) return false;
    
    const startDate = parseISO(startDateString);
    const endDate = parseISO(endDateString);
    const now = new Date();
    
    return startDate <= now && now <= endDate;
  } catch (error) {
    console.error('Error checking if event is happening now:', error);
    return false;
  }
};
