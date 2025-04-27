import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';

/**
 * Event Card Component
 * Displays an event in a card format with image, title, date, location, and category
 */
const EventCard = ({ event, onPress }) => {
  // Format the date
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'EEE, MMM d • h:mm a');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
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
            <Feather name="image" size={30} color="#ccc" />
          </View>
        )}
      </View>
      
      {/* Event Details */}
      <View style={styles.detailsContainer}>
        {/* Category */}
        {event.category_name && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{event.category_name}</Text>
          </View>
        )}
        
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{event.title}</Text>
        
        {/* Date */}
        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color="#5C6BC0" style={styles.icon} />
          <Text style={styles.infoText}>{formatDate(event.start_date)}</Text>
        </View>
        
        {/* Location */}
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={16} color="#5C6BC0" style={styles.icon} />
          <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
        </View>
        
        {/* Price (if available) */}
        {event.price !== undefined && event.price !== null && (
          <View style={styles.infoRow}>
            <Feather name="dollar-sign" size={16} color="#5C6BC0" style={styles.icon} />
            <Text style={styles.infoText}>
              {parseFloat(event.price) === 0 ? 'Free' : `$${parseFloat(event.price).toFixed(2)}`}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    width: 100,
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImage: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 1,
    padding: 12,
  },
  categoryContainer: {
    backgroundColor: '#e8eaf6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  categoryText: {
    color: '#3f51b5',
    fontWeight: '500',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#212121',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
    width: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#616161',
    flex: 1,
  },
});

export default EventCard;
