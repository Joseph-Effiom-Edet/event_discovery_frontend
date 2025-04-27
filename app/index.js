import React, { useContext } from 'react';
import { Redirect } from 'expo-router';
import { AuthContext } from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootIndex() {
  const { authState } = useContext(AuthContext);

  if (authState.isLoading) {
    // Optional: Show a loading spinner while auth state is resolving
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5C6BC0" />
      </View>
    );
  }

  if (!authState.isAuthenticated) {
    // Redirect to the login/auth screen
    return <Redirect href="/auth" />;
  }

  // Redirect to the main app screen (e.g., the events tab)
  // Redirecting to '/(tabs)/events' ensures the tab navigator is active
  return <Redirect href="/(tabs)/events" />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 