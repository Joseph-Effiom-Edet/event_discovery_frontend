import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import BookmarkButton from '../components/BookmarkButton';
import { getEventById, registerForEvent, cancelEventRegistration } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const EventDetailScreen = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { eventId } = params;
  const { authState } = useContext(AuthContext);
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(null);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setError(null);
        setLoading(true);
        const eventData = await getEventById(eventId);
        setEvent(eventData);
        
        // Check if user is registered for this event
        if (authState.isAuthenticated && eventData.registrations) {
          setIsRegistered(
            eventData.registrations.some(reg => reg.user_id === authState.user.id)
          );
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, authState.isAuthenticated, authState.user]);

  // Format date function
  const formatEventDate = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If same day
    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      return `${format(start, 'EEE, MMM d, yyyy')} • ${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;
    }
    
    // Different days
    return `${format(start, 'EEE, MMM d, yyyy h:mm a')} - ${format(end, 'EEE, MMM d, yyyy h:mm a')}`;
  };

  // Handle registration
  const handleRegistration = async () => {
    if (!authState.isAuthenticated) {
      Alert.alert(
        'Authentication Required',
        'Please log in to register for events',
        [{ text: 'OK' }]
      );
      return;
    }
    
    try {
      setRegistering(true);
      
      if (isRegistered) {
        await cancelEventRegistration(eventId);
        Alert.alert('Success', 'Your registration has been cancelled');
        setIsRegistered(false);
      } else {
        await registerForEvent(eventId);
        Alert.alert('Success', 'You have successfully registered for this event');
        setIsRegistered(true);
      }
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Error', err.response?.data?.error || 'Failed to process registration');
    } finally {
      setRegistering(false);
    }
  };

  // Show map for this event using router
  const handleShowMap = () => {
    if (event) {
      router.push({
        pathname: '/map',
        params: {
          latitude: event.latitude,
          longitude: event.longitude,
          title: event.title,
          eventId: event.id
        }
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5C6BC0" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Event not found</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Event Image */}
      <View style={styles.imageContainer}>
        {event.image_url ? (
          <Image 
            source={{ uri: event.image_url }} 
            style={styles.image} 
            resizeMode="cover" 
          />
        ) : (
          <View style={[styles.image, styles.noImage]}>
            <Feather name="image" size={50} color="#ccc" />
          </View>
        )}
        <View style={styles.bookmarkContainer}>
          <BookmarkButton eventId={event.id} size={24} />
        </View>
      </View>
      
      {/* Event Details */}
      <View style={styles.detailsContainer}>
        {/* Title */}
        <Text style={styles.title}>{event.title}</Text>
        
        {/* Category */}
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{event.category_name}</Text>
        </View>
        
        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Feather name="calendar" size={20} color="#5C6BC0" style={styles.icon} />
          <Text style={styles.infoText}>
            {formatEventDate(event.start_date, event.end_date)}
          </Text>
        </View>
        
        {/* Location */}
        <TouchableOpacity style={styles.infoRow} onPress={handleShowMap}>
          <Feather name="map-pin" size={20} color="#5C6BC0" style={styles.icon} />
          <Text style={styles.infoText}>{event.location}</Text>
        </TouchableOpacity>
        
        {/* Price */}
        {event.price !== null && (
          <View style={styles.infoRow}>
            <Feather name="dollar-sign" size={20} color="#5C6BC0" style={styles.icon} />
            <Text style={styles.infoText}>
              {parseFloat(event.price) === 0 ? 'Free' : `$${parseFloat(event.price).toFixed(2)}`}
            </Text>
          </View>
        )}
        
        {/* Available spots */}
        {event.capacity && (
          <View style={styles.infoRow}>
            <Feather name="users" size={20} color="#5C6BC0" style={styles.icon} />
            <Text style={styles.infoText}>
              {`${event.registered_count || 0} registered • ${event.capacity - (event.registered_count || 0)} spots left`}
            </Text>
          </View>
        )}
        
        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About this event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
        
        {/* Registration button */}
        <TouchableOpacity 
          style={[
            styles.registerButton, 
            isRegistered && styles.registeredButton
          ]}
          onPress={handleRegistration}
          disabled={registering}
        >
          {registering ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.registerButtonText}>
              {isRegistered ? 'Cancel Registration' : 'Register for Event'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    marginBottom: 15,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#5C6BC0',
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: 200,
  },
  noImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoryContainer: {
    backgroundColor: '#e8eaf6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  categoryText: {
    color: '#3f51b5',
    fontWeight: '600',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#424242',
    flex: 1,
  },
  descriptionContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#616161',
  },
  registerButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  registeredButton: {
    backgroundColor: '#e53935',
  },
  registerButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EventDetailScreen;
