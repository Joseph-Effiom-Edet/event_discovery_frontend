import React from 'react'; // Removed useState, useEffect
import MapScreenComponent from '../../screens/MapScreen';
import { useLocation } from '../../context/LocationContext'; // Corrected path
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router'; // Keep this for potential event focus

export default function MapScreen() {
  const { 
    location, 
    locationPermission, 
    loading: locationLoading, 
    error: locationError,
    requestLocation // Function to manually re-request
  } = useLocation(); // Use the custom hook
  
  const params = useLocalSearchParams(); // Get potential event focus params
  const focusEvent = params.eventId ? {
    latitude: parseFloat(params.latitude), // Ensure numbers are parsed correctly
    longitude: parseFloat(params.longitude),
    title: params.title,
    eventId: params.eventId
  } : null;

  if (locationLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5C6BC0" />
        <Text style={styles.infoText}>Fetching location...</Text>
      </View>
    );
  }

  // You could show an error message or a button to retry
  // if (locationError || !locationPermission) {
  //   return (
  //     <View style={styles.centerContainer}>
  //       <Text style={styles.errorText}>Location permission denied or error.</Text>
  //       {/* Optionally add a button to retry permission request */}
  //       {/* <TouchableOpacity onPress={requestLocation}><Text>Retry</Text></TouchableOpacity> */}
  //     </View>
  //   );
  // }

  // The MapScreenComponent now gets its data from context/hooks directly
  return (
    <MapScreenComponent />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    marginTop: 10,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
}); 