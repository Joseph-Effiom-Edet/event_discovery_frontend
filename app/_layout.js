import React, { useContext, useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { AuthContext, AuthProvider } from '../context/AuthContext';
import { LocationProvider } from '../context/LocationContext';
import { View, ActivityIndicator } from 'react-native';

// Inner component that consumes context and renders the stack
function AppLayout() {
  const { authState } = useContext(AuthContext);
  // Location context would also be available here if needed directly
  // const { location } = useLocation(); 

  // Show loading indicator while checking auth state
  if (authState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5C6BC0" />
      </View>
    );
  }

  // Use a Stack navigator as the root layout.
  // It will conditionally display Auth or the Main Tabs.
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {authState.isAuthenticated ? (
        // If authenticated, load the main app layout (tabs)
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      ) : (
        // If not authenticated, load the authentication screen
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}

// Default export: The Root Layout component wraps AppLayout with providers
export default function RootLayout() {
  return (
    // Providers wrap the component that needs the context
    <AuthProvider>
      <LocationProvider>
        <AppLayout />
      </LocationProvider>
    </AuthProvider>
  );
} 