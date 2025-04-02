import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, getCurrentSession } from '../services/auth';
import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'auth_session';
const USER_KEY = 'auth_user';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app start
    const loadSession = async () => {
      try {
        // Try to load from SecureStore first
        const storedSession = await SecureStore.getItemAsync(SESSION_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_KEY);
        
        if (storedSession && storedUser) {
          setSession(JSON.parse(storedSession));
          setUser(JSON.parse(storedUser));
        } else {
          // Fallback to checking current session
          const { session: existingSession, error: sessionError } = await getCurrentSession();
          if (sessionError) throw sessionError;
          
          if (existingSession) {
            const { user: currentUser, error: userError } = await getCurrentUser();
            if (userError) throw userError;
            
            setUser(currentUser);
            setSession(existingSession);
          }
        }
      } catch (error) {
        console.log('Error restoring session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = async (userData, sessionData) => {
    try {
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionData));
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      setUser(userData);
      setSession(sessionData);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync(SESSION_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};