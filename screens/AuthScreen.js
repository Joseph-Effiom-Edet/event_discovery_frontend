import React, { useState, useContext, useEffect } from 'react';
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
  Image,
  SafeAreaView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import NotificationBanner from '../components/NotificationBanner';

const AuthScreen = () => {
  const { login, register, authState, clearError } = useContext(AuthContext);
  
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
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

  // Clear local error when authState.error changes or on component mount
  useEffect(() => {
    setLocalError(authState.error);
    // Clear the context error if it was set
    if(authState.error) {
      clearError(); // Clear context error after copying it locally
    }
  }, [authState.error, clearError]);

  // Clear errors when switching forms
  useEffect(() => {
    setLocalError(null);
    setSuccessMessage(null);
    clearError();
  }, [isLogin]);

  // Handle login
  const handleAuth = async () => {
    setLocalError(null); // Clear local error on new attempt
    setSuccessMessage(null);
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        // Login success is handled by navigation, no need for a banner here
      } else {
        await register(username, email, password, name);
        setSuccessMessage('Registration successful! Please log in.'); // Set success message
        setIsLogin(true); // Switch to login view after registration
        // Reset fields after successful registration
        setUsername('');
        setEmail('');
        setPassword('');
        setName('');
      }
    } catch (error) {
      console.log('Caught auth error in AuthScreen:', error);
      setLocalError(error.response?.data?.error || (isLogin ? 'Login failed' : 'Registration failed'));
      // We don't need NotificationBanner here anymore
    } finally {
      setLoading(false);
    }
  };

  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    // Clear notification when switching
    setSuccessMessage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* <Image source={require('../assets/event_icon.png')} style={styles.logo} /> */}
        <Text style={styles.title}>{isLogin ? 'Login' : 'Register'}</Text>

        {/* Display Success Message */}
        {successMessage && (
          <NotificationBanner
            message={successMessage}
            type="success"
            visible={!!successMessage}
            onDismiss={() => setSuccessMessage(null)}
          />
        )}
        
        {/* Display Local Error Message */}
        {localError && (
          <Text style={styles.errorText}>{localError}</Text>
        )}

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
            onPress={handleAuth}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5C6BC0',
    marginBottom: 20,
    textAlign: 'center',
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
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default AuthScreen;
