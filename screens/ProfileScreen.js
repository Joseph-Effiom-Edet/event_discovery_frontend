import React, { useState, useEffect, useContext, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator,
  Alert,
  TextInput,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { getRegisteredEvents, getUserBookmarks, updateUserProfile, changeUserPassword } from '../services/api';
import EventCard from '../components/EventCard';
import NotificationBanner from '../components/NotificationBanner';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = () => {
  const { authState, logout } = useContext(AuthContext);
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('upcoming');
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Initial user data
  useEffect(() => {
    if (authState.user) {
      setName(authState.user.name || '');
      setEmail(authState.user.email || '');
      setUsername(authState.user.username || '');
    }
  }, [authState.user]);

  // Fetch user events and bookmarks function
  const fetchUserData = useCallback(async () => {
    if (!authState.isAuthenticated) return;
    
    setLoading(true);
    console.log('[ProfileScreen] Fetching user data...'); // Add log
    try {
      // Fetch registered events
      const eventsData = await getRegisteredEvents();
      setRegisteredEvents(eventsData);
      console.log(`[ProfileScreen] Fetched ${eventsData.length} registered events.`); // Add log
      
      // Fetch bookmarked events
      const bookmarksData = await getUserBookmarks();
      setBookmarkedEvents(bookmarksData);
      console.log(`[ProfileScreen] Fetched ${bookmarksData.length} bookmarked events.`); // Add log
    } catch (error) {
      console.error('[ProfileScreen] Error fetching profile data:', error);
      showNotification('Failed to load your events', 'error');
    } finally {
      setLoading(false);
    }
  }, [authState.isAuthenticated]); // Dependency: only re-create if auth status changes
  
  // Fetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('[ProfileScreen] Screen focused, fetching data...');
      fetchUserData(); 
    }, [fetchUserData]) // Depend on the fetchUserData callback
  );
  
  // Show notification message
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    // Auto-hide after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Handle event press using router.push
  const handleEventPress = (event) => {
    router.push({
      pathname: '/events/detail', 
      params: { eventId: event.id, title: event.title }
    });
  };
  
  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!name || !email || !username) {
      showNotification('All fields are required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await updateUserProfile({ name, email, username });
      // Update the auth context with new user data
      const updatedUser = { ...authState.user, name, email, username };
      authState.updateUser(updatedUser);
      
      setEditMode(false);
      showNotification('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification(error.response?.data?.error || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle password change
  const handleChangePassword = async () => {
    // Validate passwords
    if (!currentPassword) {
      showNotification('Current password is required', 'error');
      return;
    }
    
    if (!newPassword || !confirmPassword) {
      showNotification('New password and confirmation are required', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showNotification('New passwords do not match', 'error');
      return;
    }
    
    if (newPassword.length < 6) {
      showNotification('Password must be at least 6 characters', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await changeUserPassword({ currentPassword, newPassword });
      
      // Reset password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setChangingPassword(false);
      
      showNotification('Password changed successfully', 'success');
    } catch (error) {
      console.error('Error changing password:', error);
      showNotification(error.response?.data?.error || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: () => logout() }
      ]
    );
  };

  // Cancel edit mode
  const cancelEdit = () => {
    // Reset to original values
    if (authState.user) {
      setName(authState.user.name || '');
      setEmail(authState.user.email || '');
      setUsername(authState.user.username || '');
    }
    setEditMode(false);
    setChangingPassword(false);
  };
  
  // Get events based on active tab
  const getActiveEvents = () => {
    if (activeTab === 'upcoming') {
      return registeredEvents.filter(e => new Date(e.start_date) >= new Date());
    } else if (activeTab === 'past') {
      return registeredEvents.filter(e => new Date(e.end_date) < new Date());
    } else if (activeTab === 'bookmarks') {
      return bookmarkedEvents;
    }
    return [];
  };
  
  // Render profile info
  const renderProfileInfo = () => {
    if (!authState.user) return null;
    
    if (editMode) {
      return (
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
          
          <Text style={styles.formLabel}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Your username"
          />
          
          <Text style={styles.formLabel}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={cancelEdit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          </View>
          
          {!changingPassword ? (
            <TouchableOpacity 
              style={styles.changePasswordButton}
              onPress={() => setChangingPassword(true)}
            >
              <Text style={styles.changePasswordText}>Change Password</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.passwordFormContainer}>
              <Text style={styles.formLabel}>Current Password</Text>
              <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Current password"
                secureTextEntry
              />
              
              <Text style={styles.formLabel}>New Password</Text>
              <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="New password"
                secureTextEntry
              />
              
              <Text style={styles.formLabel}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
              />
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={() => setChangingPassword(false)}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleChangePassword}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Change Password</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    }
    
    return (
      <View style={styles.profileInfoContainer}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          {authState.user.avatar_url ? (
            <Image 
              source={{ uri: authState.user.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>
                {authState.user.name ? authState.user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
        </View>
        
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <Text style={styles.userName}>{authState.user.name}</Text>
          <Text style={styles.userUsername}>@{authState.user.username}</Text>
          <Text style={styles.userEmail}>{authState.user.email}</Text>
        </View>
        
        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <Feather name="edit" size={16} color="#5C6BC0" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Feather name="log-out" size={16} color="#e53935" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  
  // Render tab content (events)
  const renderEvents = () => {
    const events = getActiveEvents();
    
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5C6BC0" />
        </View>
      );
    }
    
    if (events.length === 0) {
      let emptyMessage = '';
      switch (activeTab) {
        case 'upcoming':
          emptyMessage = 'You have no upcoming events';
          break;
        case 'past':
          emptyMessage = 'You have no past events';
          break;
        case 'bookmarks':
          emptyMessage = 'You have no bookmarked events';
          break;
      }
      
      return (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={40} color="#ccc" />
          <Text style={styles.emptyText}>{emptyMessage}</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.eventsContainer}>
        {events?.map(event => (
          <EventCard 
            key={event.id} 
            event={event} 
            onPress={() => handleEventPress(event)} 
          />
        ))}
      </View>
    );
  };

  if (!authState.isAuthenticated) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>You need to be logged in to view this page.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {notification && (
        <NotificationBanner 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
      
      {renderProfileInfo()}
      
      {!editMode && (
        <>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
              onPress={() => setActiveTab('upcoming')}
            >
              <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
                Upcoming
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'past' && styles.activeTab]}
              onPress={() => setActiveTab('past')}
            >
              <Text style={[styles.tabText, activeTab === 'past' && styles.activeTabText]}>
                Past
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'bookmarks' && styles.activeTab]}
              onPress={() => setActiveTab('bookmarks')}
            >
              <Text style={[styles.tabText, activeTab === 'bookmarks' && styles.activeTabText]}>
                Bookmarks
              </Text>
            </TouchableOpacity>
          </View>
          
          {renderEvents()}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
  },
  profileInfoContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#5C6BC0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#999',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 15,
    backgroundColor: '#e8eaf6',
    borderRadius: 20,
    marginRight: 10,
  },
  editButtonText: {
    color: '#5C6BC0',
    fontWeight: '600',
    marginLeft: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 15,
    backgroundColor: '#ffebee',
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#e53935',
    fontWeight: '600',
    marginLeft: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#5C6BC0',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#5C6BC0',
    fontWeight: 'bold',
  },
  loadingContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  eventsContainer: {
    padding: 15,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#5C6BC0',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  changePasswordButton: {
    padding: 12,
    alignItems: 'center',
  },
  changePasswordText: {
    color: '#5C6BC0',
    fontWeight: 'bold',
    fontSize: 16,
  },
  passwordFormContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 15,
    marginTop: 10,
  },
});

export default ProfileScreen;
