import React, { createContext, useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null); // null initially, then true/false
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const requestLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const permissionGranted = status === 'granted';
      setLocationPermission(permissionGranted);

      if (permissionGranted) {
        // Only get location if permission granted
        try {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
        } catch (locationError) {
          console.error('Error getting current position:', locationError);
          setError('Could not fetch current location.');
          setLocation(null); // Ensure location is null on error
          // Optionally alert user?
          // Alert.alert('Location Error', 'Could not fetch your current location.');
        }
      } else {
        // Permission denied
        setLocation(null); // Ensure location is null if permission denied
        setError('Location permission denied.');
        Alert.alert(
          'Location Permission Denied',
          'Location permission is required for location-based features. You can enable it in your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError('Failed to request location permission.');
      setLocationPermission(false);
      setLocation(null);
      Alert.alert(
        'Permission Error',
        'An error occurred while requesting location permission.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  // Request location on initial load
  useEffect(() => {
    requestLocation();
  }, []);

  const value = {
    location,
    locationPermission,
    loading,
    error,
    requestLocation // Expose function to allow re-requesting
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook for easier consumption
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}; 