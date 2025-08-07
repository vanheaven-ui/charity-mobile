// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSegments, useRouter } from 'expo-router';

// The type for our authentication state
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();

  // This effect handles navigation based on authentication state
  useEffect(() => {
    // Check if the auth state is ready
    if (token === undefined) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (token && !inAuthGroup) {
      // User is authenticated, but not in the auth group. Redirect to the main app.
      router.replace('/');
    } else if (!token && inAuthGroup) {
      // User is not authenticated, but is in the auth group. Redirect to login.
      router.replace('/login');
    }
  }, [token, segments, router]);

  const login = (newToken: string) => {
    // In a real app, you would save this token to secure storage (e.g., AsyncStorage)
    setToken(newToken);
  };

  const logout = () => {
    // Clear token from state and storage
    setToken(null);
  };

  const isAuthenticated = !!token;

  const value = {
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
