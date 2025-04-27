import React, { useState, useEffect, useContext } from 'react';
import { TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { checkBookmark, addBookmark, removeBookmark } from '../services/api';
import { AuthContext } from '../context/AuthContext';

/**
 * Bookmark Button Component
 * Toggleable button for bookmarking events
 */
const BookmarkButton = ({ eventId, size = 24, color = '#5C6BC0', style }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useContext(AuthContext);

  // Check if event is bookmarked on mount
  useEffect(() => {
    checkBookmarkStatus();
  }, [eventId]);

  // Check if event is bookmarked
  const checkBookmarkStatus = async () => {
    if (!authState.isAuthenticated) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const status = await checkBookmark(eventId);
      setIsBookmarked(status.isBookmarked);
    } catch (error) {
      console.error('Error checking bookmark status:', error);
      setError('Failed to check bookmark status');
    } finally {
      setLoading(false);
    }
  };

  // Toggle bookmark status
  const toggleBookmark = async () => {
    if (!authState.isAuthenticated) {
      // Could show a toast/alert here to prompt login
      return;
    }

    setError(null);
    try {
      setLoading(true);
      
      if (isBookmarked) {
        await removeBookmark(eventId);
      } else {
        await addBookmark(eventId);
      }
      
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      setError('Failed to update bookmark');
      Alert.alert('Error', error.response?.data?.error || 'Could not update bookmark. Please try again.');
      setIsBookmarked(isBookmarked);
    } finally {
      setLoading(false);
    }
  };

  // If not authenticated, don't show the bookmark feature
  if (!authState.isAuthenticated) {
    return null;
  }

  return (
    <TouchableOpacity 
      onPress={toggleBookmark} 
      disabled={loading}
      style={style}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <MaterialCommunityIcons 
          name={isBookmarked ? 'bookmark' : 'bookmark-outline'} 
          size={size} 
          color={color} 
        />
      )}
    </TouchableOpacity>
  );
};

export default BookmarkButton;
