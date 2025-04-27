import React, { createContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, validateToken, getUserData, updateUserData } from '../services/auth';

// Create the Auth Context
export const AuthContext = createContext();

/**
 * Auth Provider Component
 * Manages authentication state and provides auth-related functions
 */
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    isLoading: true,
    error: null
  });

  // Check for existing token on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get user data from storage
        const userData = await getUserData();
        
        if (userData) {
          // Validate token with server
          try {
            const validatedUser = await validateToken();
            setAuthState({
              isAuthenticated: true,
              user: validatedUser,
              isLoading: false,
              error: null
            });
          } catch (error) {
            // Token validation failed, clear auth state
            setAuthState({
              isAuthenticated: false,
              user: null,
              isLoading: false,
              error: 'Session expired'
            });
          }
        } else {
          // No user data found
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
          error: 'Authentication error'
        });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { token, user } = await loginUser(email, password);
      
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null
      });
      
      return { token, user };
    } catch (error) {
      console.error('Login error in context:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.response?.data?.error || 'Login failed' 
      }));
      throw error;
    }
  };

  // Register function
  const register = async (username, email, password, name) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { token, user } = await registerUser(username, email, password, name);
      
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
        error: null
      });
      
      return { token, user };
    } catch (error) {
      console.error('Registration error in context:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }));
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      await logoutUser();
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Logout error in context:', error);
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: 'Logout failed'
      }));
    }
  };

  // Update user in context and storage
  const updateUser = async (userData) => {
    try {
      await updateUserData(userData);
      
      setAuthState(prev => ({ 
        ...prev, 
        user: userData 
      }));
    } catch (error) {
      console.error('Update user error in context:', error);
      // Don't update state on error
    }
  };

  // Clear error
  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  // Create auth context value
  const authContextValue = {
    authState: {
      ...authState,
      // Add updateUser to the auth state
      updateUser
    },
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};
