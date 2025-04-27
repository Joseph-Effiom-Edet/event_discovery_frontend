import axios from 'axios';
import { getAuthToken } from './auth';

// Use the ngrok tunnel URL directly
// Make sure ngrok is running and forwarding to your local backend (port 8000)
const API_BASE_URL = 'https://event-discovery-backend.onrender.com/api'; 
// const API_BASE_URL = 'http://localhost:8000/api'; 

console.log(`Using API Base URL: ${API_BASE_URL}`); // Log the ngrok URL being used

// Create axios instance with the ngrok baseURL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Keep the timeout we added
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Event API endpoints

/**
 * Fetch events with optional filters
 */
export const getEvents = async (filters = {}) => {
  try {
    const response = await api.get('/events', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Fetch a single event by ID
 */
export const getEventById = async (eventId) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Get nearby events
 */
export const getNearbyEvents = async (lat, lng, radius = 10) => {
  try {
    const response = await api.get('/events/nearby', {
      params: { lat, lng, radius }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    throw error;
  }
};

/**
 * Get events by date range
 */
export const getEventsByDateRange = async (startDate, endDate) => {
  try {
    const response = await api.get('/events/dates', {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching events by date range:', error);
    throw error;
  }
};

/**
 * Register for an event
 */
export const registerForEvent = async (eventId) => {
  try {
    const response = await api.post(`/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    console.error(`Error registering for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Cancel event registration
 */
export const cancelEventRegistration = async (eventId) => {
  try {
    const response = await api.delete(`/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling registration for event ${eventId}:`, error);
    throw error;
  }
};

// Category API endpoints

/**
 * Fetch all categories
 */
export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// User API endpoints

/**
 * Get user profile
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Change user password
 */
export const changeUserPassword = async (passwordData) => {
  try {
    const response = await api.put('/users/password', passwordData);
    return response.data;
  } catch (error) {
    console.error('Error changing password:', error);
    throw error;
  }
};

/**
 * Get user's registered events
 */
export const getRegisteredEvents = async () => {
  try {
    const response = await api.get('/users/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching registered events:', error);
    throw error;
  }
};

// Bookmark API endpoints

/**
 * Get user's bookmarks
 */
export const getUserBookmarks = async () => {
  try {
    const response = await api.get('/bookmarks');
    return response.data;
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    throw error;
  }
};

/**
 * Add bookmark
 */
export const addBookmark = async (eventId) => {
  try {
    const response = await api.post(`/bookmarks/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error adding bookmark for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Remove bookmark
 */
export const removeBookmark = async (eventId) => {
  try {
    const response = await api.delete(`/bookmarks/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing bookmark for event ${eventId}:`, error);
    throw error;
  }
};

/**
 * Check if an event is bookmarked
 */
export const checkBookmark = async (eventId) => {
  try {
    const response = await api.get(`/bookmarks/${eventId}/check`);
    return response.data;
  } catch (error) {
    console.error(`Error checking bookmark status for event ${eventId}:`, error);
    throw error;
  }
};

export default api;
