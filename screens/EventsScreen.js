import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Text, SafeAreaView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import EventCard from '../components/EventCard';
import CategoryFilter from '../components/CategoryFilter';
import LocationFilter from '../components/LocationFilter';
import { getEvents } from '../services/api';
import { Feather } from '@expo/vector-icons';
import { useLocation } from '../context/LocationContext';

const EventsScreen = () => {
  const router = useRouter();
  const { 
    location, 
    locationPermission, 
    loading: locationLoading, 
    requestLocation
  } = useLocation();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [locationFilterEnabled, setLocationFilterEnabled] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setError(null);
      setLoadingEvents(true);
      
      const filters = {};
      if (selectedCategory) {
        filters.category_id = selectedCategory;
      }
      
      if (locationFilterEnabled && locationPermission && location) {
        filters.lat = location.coords.latitude;
        filters.lng = location.coords.longitude;
        filters.radius = searchRadius;
      } else if (locationFilterEnabled && !locationPermission) {
        console.warn('Location filter enabled, but permission denied.');
      } else if (locationFilterEnabled && !location) {
        console.warn('Location filter enabled, but location data unavailable.');
      }
      
      const eventsData = await getEvents(filters);
      setEvents(eventsData);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoadingEvents(false);
      setRefreshing(false);
    }
  }, [
    selectedCategory, 
    location, 
    locationPermission, 
    locationFilterEnabled, 
    searchRadius
  ]);

  useEffect(() => {
    if (!locationLoading || !locationFilterEnabled) {
      fetchEvents();
    }
  }, [fetchEvents, locationLoading, locationFilterEnabled]);

  useFocusEffect(
    useCallback(() => {
      if (!locationLoading || !locationFilterEnabled) {
        fetchEvents();
      }
    }, [fetchEvents, locationLoading, locationFilterEnabled])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const onCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const toggleLocationFilter = (enabled) => {
    setLocationFilterEnabled(enabled);
    if (enabled && locationPermission === null) {
      requestLocation();
    } else if (enabled && locationPermission === false) {
      Alert.alert('Permission Denied', 'Location permission is needed for this filter.');
    }
  };

  const onRadiusChange = (radius) => {
    setSearchRadius(radius);
  };

  const handleEventPress = (event) => {
    router.push({
      pathname: '/events/detail', 
      params: { eventId: event.id, title: event.title }
    });
  };

  const renderEventItem = ({ item }) => (
    <EventCard event={item} onPress={() => handleEventPress(item)} />
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Feather name="calendar" size={50} color="#ccc" />
      <Text style={styles.emptyText}>No events found</Text>
      <Text style={styles.emptySubtext}>Try changing your filters or check back later</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filtersContainer}>
        <CategoryFilter onCategoryChange={onCategoryChange} selectedCategory={selectedCategory} />
        <LocationFilter 
          enabled={locationFilterEnabled}
          onToggle={toggleLocationFilter}
          radius={searchRadius}
          onRadiusChange={onRadiusChange}
        />
      </View>
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {(loadingEvents || (locationFilterEnabled && locationLoading)) && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5C6BC0" />
          {locationFilterEnabled && locationLoading && <Text>Getting location...</Text>}
        </View>
      ) : (
        <FlatList
          style={styles.listStyle}
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item, index) => {
            if (item && item.id !== undefined && item.id !== null) {
              return item.id.toString();
            }
            return `event-${index}`;
          }}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#5C6BC0"]} />
          }
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filtersContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  listStyle: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
    margin: 10,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
});

export default EventsScreen;
