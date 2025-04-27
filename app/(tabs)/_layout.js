import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5C6BC0',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          // paddingBottom: 5, // Adjust padding as needed
          // paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: '#5C6BC0',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="events" // This corresponds to app/(tabs)/events/_layout.js or index.js
        options={{
          title: 'Events',
          headerShown: false, // The stack navigator inside will show its own header
          tabBarIcon: ({ color, size }) => <Feather name="list" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map" // This corresponds to app/(tabs)/map.js
        options={{
          title: 'Map',
          headerShown: true, // Show header directly for this tab
          tabBarIcon: ({ color, size }) => <Feather name="map" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar" // This corresponds to app/(tabs)/calendar.js
        options={{
          title: 'Event Calendar',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile" // This corresponds to app/(tabs)/profile.js
        options={{
          title: 'My Profile',
          headerShown: true,
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
} 