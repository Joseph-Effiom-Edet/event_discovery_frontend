import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';

/**
 * Notification Banner Component
 * Displays a notification message with type-based styling (success, error, info, warning)
 */
const NotificationBanner = ({ message, type = 'info', onClose, duration = 3000 }) => {
  const fadeAnim = new Animated.Value(0);
  
  // Set up fade in and fade out animations
  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Auto-hide after duration
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        if (onClose) onClose();
      });
    }, duration);
    
    // Clean up timer
    return () => clearTimeout(timer);
  }, []);
  
  // Get icon and colors based on notification type
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return { icon: 'check-circle', color: '#042f2e', bgColor: '#ccfbf1' };
      case 'error':
        return { icon: 'alert-circle', color: '#f44336', bgColor: '#ffebee' };
      case 'warning':
        return { icon: 'alert-triangle', color: '#ff9800', bgColor: '#fff3e0' };
      case 'info':
      default:
        return { icon: 'info', color: '#2196f3', bgColor: '#e3f2fd' };
    }
  };
  
  const { icon, color, bgColor } = getTypeConfig();

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: bgColor, opacity: fadeAnim },
      ]}
    >
      <Feather name={icon} size={20} color={color} style={styles.icon} />
      <Text style={[styles.message, { color }]}>{message}</Text>
      
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Feather name="x" size={18} color={color} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  closeButton: {
    padding: 4,
  },
});

export default NotificationBanner;
