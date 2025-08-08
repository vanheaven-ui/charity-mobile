import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../src/context/AuthContext';
import { loginUser } from '../src/services/api';

const LoginScreen = () => {
  // Use the useAuth hook to get access to the login function
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Start loading state
    setLoading(true);
    try {
      // First, call the API service to authenticate the user
      // The loginUser function should return a response with a token and user data
      const response = await loginUser({ email, password });
      
      // Destructure the token and user data from the API response
      const { token, user } = response;

      // Now, call the login function from the context with both required arguments
      await login(token, user);

      // The context will handle storing the data and navigating the user
    } catch (e: any) {
      // Handle any login errors and display an alert to the user
      Alert.alert('Login Failed', e.response?.data?.error || 'An error occurred during login.');
    } finally {
      // Always stop the loading state, regardless of success or failure
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
      {/* You would typically add a link to a registration screen here */}
      <TouchableOpacity onPress={() => console.log('Navigate to Register')}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#007bff',
  },
});

export default LoginScreen;
