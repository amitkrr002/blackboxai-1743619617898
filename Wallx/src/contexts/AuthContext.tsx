import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import * as authService from "../services/auth";
import { Alert } from "react-native";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const loadSession = async () => {
      setIsLoading(true);
      try {
        const { session: currentSession, error: sessionError } =
          await authService.getCurrentSession();

        if (sessionError) {
          console.error("Session error:", sessionError.message);
        } else if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
        }
      } catch (err: any) {
        console.error("Failed to load session:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event);
        setSession(newSession);
        setUser(newSession?.user ?? null);
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        user: newUser,
        session: newSession,
        error: signInError,
      } = await authService.signIn(email, password);

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setUser(newUser);
      setSession(newSession);
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        user: newUser,
        session: newSession,
        error: signUpError,
      } = await authService.signUp(email, password);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!newSession) {
        // If no session is returned, the user needs to confirm their email
        Alert.alert(
          "Verification Required",
          "Please check your email to verify your account before logging in.",
        );
      } else {
        setUser(newUser);
        setSession(newSession);
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: signOutError } = await authService.signOut();

      if (signOutError) {
        setError(signOutError.message);
        return;
      }

      setUser(null);
      setSession(null);
    } catch (err: any) {
      setError(err.message || "Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await authService.resetPassword(email);

      if (resetError) {
        setError(resetError.message);
        return;
      }

      Alert.alert(
        "Password Reset",
        "Check your email for a password reset link",
      );
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    session,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import supabase from "../utils/supabaseClient";
