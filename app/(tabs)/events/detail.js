import React from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import EventDetailScreenComponent from '../../../screens/EventDetailScreen';

export default function EventDetailScreen() {
  const params = useLocalSearchParams();
  const eventTitle = params.title; // Get title from params if passed

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: eventTitle ? eventTitle : 'Event Details' 
        }} 
      />
      {/* Render the component directly, it will use its own hooks */}
      <EventDetailScreenComponent /> 
    </>
  );
} 