import AsyncStorage from '@react-native-async-storage/async-storage';
// Remove direct axios import if only used for base URL before
// import axios from 'axios';
import api from './api'; // Import the configured Axios instance

// Remove the hardcoded Base URL here, it's handled in api.js
// const API_BASE_URL = 'http://localhost:8000/api';

// Storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} - Auth token and user data
 */
export const loginUser = async (email, password) => {
  try {
    console.log('Attempting login with:', { email, password }); // Log credentials being sent
    // Use the configured api instance and relative path
    const response = await api.post('/auth/login', {
      email,
      password
    });

    const { token, user } = response.data;
    
    // Store token and user data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return { token, user };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register user
 * @param {string} username - Username
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} name - User's full name
 * @returns {Promise<Object>} - Auth token and user data
 */
export const registerUser = async (username, email, password, name) => {
  try {
    console.log('Attempting registration with:', { username, email, password, name });
    // Use the configured api instance and relative path
    const response = await api.post('/auth/register', {
      username,
      email,
      password,
      name
    });

    const { token, user } = response.data;
    
    // Store token and user data
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    
    return { token, user };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Logout user
 * Remove token and user data from storage
 */
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Validate token with the server
 * @returns {Promise<Object>} - User data if token is valid
 */
export const validateToken = async () => {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('No token found');
    }
    
    // Use the configured api instance and relative path
    // The interceptor in api.js already adds the Authorization header
    const response = await api.get('/auth/validate'); 
    
    if (response.data.valid) {
      // Update stored user data
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
      return response.data.user;
    } else {
      throw new Error('Invalid token');
    }
  } catch (error) {
    console.error('Token validation error:', error);
    // Clear invalid token and user data
    await logoutUser();
    throw error;
  }
};

/**
 * Get stored auth token
 * @returns {Promise<string|null>} - Auth token or null if not found
 */
export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Get stored user data
 * @returns {Promise<Object|null>} - User data or null if not found
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Update stored user data
 * @param {Object} userData - Updated user data
 */
export const updateUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};
