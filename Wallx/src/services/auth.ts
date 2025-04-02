import supabase from "../utils/supabaseClient";
import { Session, User } from "@supabase/supabase-js";

export interface AuthError {
  message: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error: { message: error.message } };
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error: any) {
    return {
      user: null,
      session: null,
      error: { message: error.message || "An unknown error occurred" },
    };
  }
};

// Sign in with email and password
export const signIn = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, session: null, error: { message: error.message } };
    }

    return {
      user: data.user,
      session: data.session,
      error: null,
    };
  } catch (error: any) {
    return {
      user: null,
      session: null,
      error: { message: error.message || "An unknown error occurred" },
    };
  }
};

// Sign out
export const signOut = async (): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message || "An unknown error occurred" } };
  }
};

// Get current session
export const getCurrentSession = async (): Promise<{
  session: Session | null;
  error: AuthError | null;
}> => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      return { session: null, error: { message: error.message } };
    }

    return { session: data.session, error: null };
  } catch (error: any) {
    return {
      session: null,
      error: { message: error.message || "An unknown error occurred" },
    };
  }
};

// Get current user
export const getCurrentUser = async (): Promise<{
  user: User | null;
  error: AuthError | null;
}> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      return { user: null, error: { message: error.message } };
    }

    return { user: data.user, error: null };
  } catch (error: any) {
    return {
      user: null,
      error: { message: error.message || "An unknown error occurred" },
    };
  }
};

// Reset password
export const resetPassword = async (
  email: string,
): Promise<{ error: AuthError | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "wallx://reset-password",
    });

    if (error) {
      return { error: { message: error.message } };
    }

    return { error: null };
  } catch (error: any) {
    return { error: { message: error.message || "An unknown error occurred" } };
  }
};
