import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay, isBefore, isAfter } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import EventCard from '../components/EventCard';
import { getEvents } from '../services/api';

const CalendarScreen = ({ navigation }) => {
  const [selected, setSelected] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [markedDates, setMarkedDates] = useState({});

  // Initial data loading
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events
  const fetchEvents = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Get current date
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      
      // Format dates for API
      const startDate = format(startOfMonth, 'yyyy-MM-dd');
      const endDate = format(endOfMonth, 'yyyy-MM-dd');
      
      const eventsData = await getEvents({
        start_date: startDate,
        end_date: endDate,
        limit: 100 // Get more events for calendar view
      });
      
      setEvents(eventsData);
      
      // Create marked dates for the calendar
      const marked = createMarkedDates(eventsData);
      setMarkedDates(marked);
      
      // Set today as selected date
      const todayStr = format(today, 'yyyy-MM-dd');
      setSelected(todayStr);
      filterEventsByDate(todayStr, eventsData);
    } catch (err) {
      console.error('Error fetching events for calendar:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  // Create marked dates object for the calendar
  const createMarkedDates = (eventsData) => {
    const marked = {};
    
    eventsData.forEach(event => {
      const startDate = parseISO(event.start_date);
      const endDate = parseISO(event.end_date);
      
      // Mark all dates between start and end
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateString = format(currentDate, 'yyyy-MM-dd');
        
        if (dateString === selected) {
          marked[dateString] = { 
            selected: true, 
            marked: true, 
            selectedColor: '#5C6BC0' 
          };
        } else {
          marked[dateString] = { 
            marked: true, 
            dotColor: '#5C6BC0' 
          };
        }
        
        // Move to next day
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    // Make sure selected date is marked
    if (selected && !marked[selected]) {
      marked[selected] = { 
        selected: true, 
        selectedColor: '#5C6BC0' 
      };
    }
    
    return marked;
  };

  // Filter events by selected date
  const filterEventsByDate = (dateString, eventsToFilter = events) => {
    // Get the start and end of the selected day in the local timezone
    const selectedDayStart = startOfDay(parseISO(dateString)); 
    const selectedDayEnd = endOfDay(parseISO(dateString)); 

    const filtered = eventsToFilter.filter(event => {
      const eventStart = parseISO(event.start_date);
      // const eventEnd = parseISO(event.end_date); // No longer needed for this logic

      // Check if the event START date is within the selected day
      return isWithinInterval(eventStart, { start: selectedDayStart, end: selectedDayEnd });
    });
    
    setFilteredEvents(filtered);
  };

  // Handle date selection
  const onDayPress = (day) => {
    const selectedDate = day.dateString;
    
    // Update marked dates
    const updatedMarkedDates = { ...markedDates };
    
    // Remove selection from previous date
    if (selected && updatedMarkedDates[selected]) {
      if (updatedMarkedDates[selected].marked) {
        updatedMarkedDates[selected] = { 
          marked: true, 
          dotColor: '#5C6BC0' 
        };
      } else {
        delete updatedMarkedDates[selected];
      }
    }
    
    // Mark new date as selected
    if (updatedMarkedDates[selectedDate]) {
      updatedMarkedDates[selectedDate] = { 
        ...updatedMarkedDates[selectedDate], 
        selected: true, 
        selectedColor: '#5C6BC0' 
      };
    } else {
      updatedMarkedDates[selectedDate] = { 
        selected: true, 
        selectedColor: '#5C6BC0' 
      };
    }
    
    setMarkedDates(updatedMarkedDates);
    setSelected(selectedDate);
    filterEventsByDate(selectedDate);
  };

  // Navigate to event details
  const handleEventPress = (event) => {
    navigation.navigate('EventsTab', {
      screen: 'EventDetail',
      params: { eventId: event.id, title: event.title }
    });
  };

  // Render event item
  const renderEventItem = ({ item }) => (
    <EventCard event={item} onPress={() => handleEventPress(item)} />
  );

  // Render empty state
  const renderEmptyEvents = () => (
    <View style={styles.emptyContainer}>
      <Feather name="calendar" size={40} color="#ccc" />
      <Text style={styles.emptyText}>No events on this date</Text>
      <Text style={styles.emptySubtext}>Try selecting a different day</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Calendar
        style={styles.calendar}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#5C6BC0',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#5C6BC0',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#5C6BC0',
          selectedDotColor: '#ffffff',
          arrowColor: '#5C6BC0',
          monthTextColor: '#2d4150',
          indicatorColor: '#5C6BC0',
        }}
        onDayPress={onDayPress}
        markedDates={markedDates}
      />
      
      <View style={styles.eventsContainer}>
        <View style={styles.eventHeaderContainer}>
          <Text style={styles.eventsTitle}>
            Events for {selected ? format(parseISO(selected), 'MMMM d, yyyy') : 'today'}
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={fetchEvents}
            disabled={loading}
          >
            <Feather name="refresh-cw" size={16} color="#5C6BC0" />
          </TouchableOpacity>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5C6BC0" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton} 
              onPress={fetchEvents}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={filteredEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id.toString()}
            ListEmptyComponent={renderEmptyEvents}
            contentContainerStyle={filteredEvents.length === 0 ? { flex: 1 } : null}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  eventsContainer: {
    flex: 1,
    padding: 10,
  },
  eventHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242',
  },
  refreshButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    marginBottom: 15,
    textAlign: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  },
});

export default CalendarScreen;
