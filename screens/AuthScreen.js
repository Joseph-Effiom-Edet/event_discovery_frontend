import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import NotificationBanner from '../components/NotificationBanner';

const AuthScreen = () => {
  const { login, register } = useContext(AuthContext);
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // State for password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  // Show notification message
  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    // Auto-hide after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  // Handle login
  const handleLogin = async () => {
    // Validate input
    if (!email || !password) {
      showNotification('Email and password are required');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      showNotification(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle register
  const handleRegister = async () => {
    // Validate input
    if (!username || !email || !password || !name) {
      showNotification('All fields are required');
      return;
    }
    
    if (password !== confirmPassword) {
      showNotification('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      showNotification('Password must be at least 6 characters');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    try {
      await register(username, email, password, name);
    } catch (error) {
      console.error('Registration error:', error);
      showNotification(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear notification when switching
    setNotification(null);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {notification && (
          <NotificationBanner 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
        
        {/* App Logo/Icon */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Feather name="calendar" size={60} color="#5C6BC0" />
          </View>
          <Text style={styles.logoText}>Event Discovery</Text>
          <Text style={styles.tagline}>Find amazing events near you</Text>
        </View>
        
        {/* Auth Form */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Login to your account' : 'Create a new account'}
          </Text>
          
          {/* Register Fields */}
          {!isLogin && (
            <>
              <Text style={styles.inputLabel}>Name</Text>
              <View style={styles.inputContainer}>
                <Feather name="user" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
              
              <Text style={styles.inputLabel}>Username</Text>
              <View style={styles.inputContainer}>
                <Feather name="at-sign" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Choose a username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>
            </>
          )}
          
          {/* Common Fields */}
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <Feather name="mail" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
              <Feather 
                name={isPasswordVisible ? 'eye-off' : 'eye'} 
                size={20} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>
          
          {/* Register Fields */}
          {!isLogin && (
            <>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Feather name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!isConfirmPasswordVisible}
                />
                <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIconContainer}>
                  <Feather 
                    name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={isLogin ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Login' : 'Register'}
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Switch Auth Mode */}
          <TouchableOpacity 
            style={styles.switchModeContainer}
            onPress={toggleAuthMode}
            disabled={loading}
          >
            <Text style={styles.switchModeText}>
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e8eaf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5C6BC0',
  },
  tagline: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#424242',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  eyeIconContainer: {
    padding: 5,
    position: 'absolute',
    right: 10,
    height: '100%',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: '#5C6BC0',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchModeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchModeText: {
    color: '#5C6BC0',
    fontSize: 14,
  },
});

export default AuthScreen;
