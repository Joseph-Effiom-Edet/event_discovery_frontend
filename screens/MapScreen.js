import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions, Platform } from 'react-native';
// Revert back to standard import
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; 

// Remove debug logs
// console.log('Named MapView imported:', MapView);
// console.log('Named Marker imported:', Marker);
// console.log('Named PROVIDER_GOOGLE imported:', PROVIDER_GOOGLE);

import * as Location from 'expo-location';
import { getEvents } from '../services/api';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { LocationContext } from '../context/LocationContext';

const MapScreen = () => {
  // Remove debug logs
  // console.log('Named MapView inside component:', MapView);
  // console.log('Named Marker inside component:', Marker);

  const params = useLocalSearchParams();
  const router = useRouter();
  const { location, locationPermission, error: locationError } = useContext(LocationContext);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(null);
  
  const mapRef = useRef(null);
  
  // Initialize with user location or focus on specific event
  useEffect(() => {
    const initializeMap = async () => {
      try {
        setLoading(true);
        
        // Check if we're focusing on a specific event from params
        if (params?.latitude && params?.longitude) {
          const latitude = parseFloat(params.latitude);
          const longitude = parseFloat(params.longitude);
          setRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          });
        } 
        // Otherwise use user's location if available
        else if (location) {
          setUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          });
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          });
        }
        // Otherwise use a default location or get current location
        else if (locationPermission) {
          try {
            const currentLocation = await Location.getCurrentPositionAsync({});
            setUserLocation({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude
            });
            setRegion({
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
            });
          } catch (locationError) {
            console.error('Error getting current location:', locationError);
            // Use a default region if getting location fails
            setRegion({
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05
            });
          }
        } else {
          // Use a default region if no location permission
          setRegion({
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          });
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setApiError('Failed to initialize map');
      } finally {
        setLoading(false);
      }
    };

    initializeMap();
  }, [location, locationPermission, params?.latitude, params?.longitude]);
  
  // Fetch nearby events when the map loads or when the region changes - REMOVED
  // useEffect(() => { ... }, [region]);
  
  // Refetch ALL events when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      // No longer depends on region
      const fetchAllEvents = async () => {
        console.log("Fetching all events for map..."); // Add log
        try {
          setApiError(null); // Reset error on focus
          // Fetch events WITHOUT location filters
          const eventsData = await getEvents({ limit: 100 }); // Fetch up to 100 events
          setEvents(eventsData);
          console.log(`Fetched ${eventsData.length} events.`); // Add log
        } catch (err) {
          console.error('Error fetching all events for map:', err);
          setApiError('Failed to load events for map');
        }
      };
      
      fetchAllEvents();
      
    }, []) // Empty dependency array means it runs only on focus/blur
  );
  
  // Handle marker press
  const handleMarkerPress = (event) => {
    router.push({ 
      pathname: `/event/${event.id}`, 
      params: { title: event.title }
    });
  };
  
  // Handle region change - REMOVED
  // const handleRegionChange = (newRegion) => {
  //   setRegion(newRegion);
  // };

  // Display location error specifically
  if (locationError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Location Error: {locationError}</Text>
        {/* Maybe add a retry button for location here? */}
      </View>
    );
  }
  
  // Display API or Map init error
  if (apiError) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{apiError}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5C6BC0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === 'web' ? (
        // Display a message on the web platform
        <View style={styles.centerContainer}>
          <Text style={styles.infoText}>Map view is not available on the web yet.</Text>
        </View>
      ) : (
        // Render MapView only on native platforms (iOS, Android)
        region && (
          <MapView
            ref={mapRef}
            style={styles?.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            // onRegionChangeComplete={handleRegionChange} // REMOVED
            showsUserLocation={locationPermission}
            showsMyLocationButton={locationPermission}
          >
            {/* User Location Marker */}
            {userLocation && (
              <Marker
                coordinate={userLocation}
                title="You are here"
                pinColor="blue"
              />
            )}
            
            {/* Event Markers */}
            {events?.map(event => (
              <Marker
                key={event.id}
                coordinate={{
                  latitude: parseFloat(event.latitude),
                  longitude: parseFloat(event.longitude)
                }}
                title={event.title}
                description={event.location}
                onCalloutPress={() => handleMarkerPress(event)}
              />
            ))}
            
            {/* Highlighted Event from Navigation Params */}
            {params?.latitude && params?.longitude && (
              <Marker
                coordinate={{
                  latitude: parseFloat(params.latitude),
                  longitude: parseFloat(params.longitude)
                }}
                title={params.title || "Selected Event"}
                pinColor="red"
                onCalloutPress={() => router.push({
                   pathname: `/event/${params.eventId}`,
                   params: { title: params.title }
                })}
              />
            )}
          </MapView>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // Ensure container centers content when map isn't shown
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
    padding: 20,
  },
  // Added style for info text
  infoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    padding: 20,
  }
});

export default MapScreen;
