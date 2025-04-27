import { Stack } from 'expo-router';

export default function EventsStackLayout() {
  return (
    <Stack
      screenOptions={{
        // Header styles can be inherited from the Tabs layout or defined here
        headerStyle: {
          backgroundColor: '#5C6BC0',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index" // Corresponds to app/(tabs)/events/index.js
        options={{ title: 'Events' }} 
      />
      <Stack.Screen 
        name="detail" // Corresponds to app/(tabs)/events/detail.js
        options={{ 
          title: 'Event Details', // We can set dynamic title in the component itself
          // Presentation mode can be set here if needed (e.g., 'modal')
        }} 
      />
    </Stack>
  );
} 