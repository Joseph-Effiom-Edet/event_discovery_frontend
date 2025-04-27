import * as Location from 'expo-location';

/**
 * Get the user's current location
 * @returns {Promise<Object>} - Location object with coords
 */
export const getCurrentLocation = async () => {
  try {
    // Check if permission is granted
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }
    
    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return location;
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
  }
};

/**
 * Get a location name from coordinates using reverse geocoding
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<string>} - Formatted address
 */
export const getLocationName = async (latitude, longitude) => {
  try {
    const reverseGeocode = await Location.reverseGeocodeAsync({
      latitude,
      longitude
    });
    
    if (reverseGeocode.length > 0) {
      const location = reverseGeocode[0];
      // Construct a readable address
      const addressParts = [
        location.street,
        location.city,
        location.region,
        location.postalCode,
        location.country
      ].filter(Boolean);
      
      return addressParts.join(', ');
    }
    
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    // Return coordinates in case of error
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  
  // Convert degrees to radians
  const toRad = (degree) => degree * Math.PI / 180;
  
  // Radius of Earth in kilometers
  const R = 6371;
  
  // Haversine formula
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Get distance text in a human-readable format
 * @param {number} distance - Distance in kilometers
 * @returns {string} - Formatted distance
 */
export const getDistanceText = (distance) => {
  if (distance === null || distance === undefined) return '';
  
  if (distance < 1) {
    // Convert to meters if less than 1 km
    return `${Math.round(distance * 1000)} m`;
  }
  
  return `${distance.toFixed(1)} km`;
};
