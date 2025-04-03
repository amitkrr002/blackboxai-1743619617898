import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Define custom storage for mobile platforms
const createSecureStoreAdapter = () => ({
  async getItem(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('SecureStore getItem error:', error);
      return null;
    }
  },
  async setItem(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('SecureStore setItem error:', error);
    }
  },
  async removeItem(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('SecureStore removeItem error:', error);
    }
  },
});

// Initialize Supabase client
const supabaseUrl = 'https://rlpgokkcfjrnakugljen.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJscGdva2tjZmpybmFrdWdsamVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMzE5MTQsImV4cCI6MjA1ODcwNzkxNH0.vputwjXKV-fqBtt78d0B6Bdcz2pwP3ZOQaAfiYzY1sk';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: (key) => createSecureStoreAdapter().getItem(key),
      setItem: (key, value) => createSecureStoreAdapter().setItem(key, value),
      removeItem: (key) => createSecureStoreAdapter().removeItem(key),
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase;
