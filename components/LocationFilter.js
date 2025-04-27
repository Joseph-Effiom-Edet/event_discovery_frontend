import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import { Feather } from '@expo/vector-icons';

/**
 * Location Filter Component
 * Toggle and radius slider for location-based filtering
 */
const LocationFilter = ({ enabled, onToggle, radius = 10, onRadiusChange }) => {
  // Internal state for radius slider
  const [localRadius, setLocalRadius] = useState(radius);

  // Handle slider value change
  const handleRadiusChange = (value) => {
    setLocalRadius(value);
  };

  // Handle slider complete
  const handleRadiusComplete = (value) => {
    onRadiusChange(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Location Filter</Text>
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#e0e0e0', true: '#c5cae9' }}
          thumbColor={enabled ? '#5C6BC0' : '#f5f5f5'}
          ios_backgroundColor="#e0e0e0"
        />
      </View>
      
      {enabled && (
        <View style={styles.radiusContainer}>
          <View style={styles.radiusHeader}>
            <Feather name="map-pin" size={16} color="#5C6BC0" />
            <Text style={styles.radiusText}>
              Search radius: <Text style={styles.radiusValue}>{Math.round(localRadius)} km</Text>
            </Text>
          </View>
          
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={500}
            value={localRadius}
            onValueChange={handleRadiusChange}
            onSlidingComplete={handleRadiusComplete}
            minimumTrackTintColor="#5C6BC0"
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor="#5C6BC0"
          />
          
          <View style={styles.rangeLabels}>
            <Text style={styles.rangeLabel}>1 km</Text>
            <Text style={styles.rangeLabel}>500 km</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
    marginTop: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#424242',
  },
  radiusContainer: {
    marginBottom: 10,
  },
  radiusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radiusText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#616161',
  },
  radiusValue: {
    fontWeight: 'bold',
    color: '#5C6BC0',
  },
  slider: {
    height: 40,
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  rangeLabel: {
    fontSize: 12,
    color: '#9e9e9e',
  },
});

export default LocationFilter;
