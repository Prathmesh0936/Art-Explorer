
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  type User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type AuthError,
} from 'firebase/auth';
import { auth } from '@/lib/firebase'; // auth can be undefined if firebase.ts fails to initialize
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!auth) {
      console.error(
        "AuthContext: Firebase Auth service (`auth` object from '@/lib/firebase') is not available. This typically means Firebase failed to initialize in `src/lib/firebase.ts`, most likely due to MISSING or INCORRECT `NEXT_PUBLIC_FIREBASE_...` environment variables. Authentication will NOT work. Please check your console for messages from `firebase.ts` and verify your `.env.local` file or Firebase Studio environment configuration. Ensure your development environment was restarted after any changes to environment variables."
      );
      toast({
        title: "Authentication Service Unavailable",
        description: "Critical: Firebase Auth service could not initialize. Check console logs from 'firebase.ts' and ensure your environment variables (e.g., NEXT_PUBLIC_FIREBASE_API_KEY) are correctly set and your environment was restarted. Auth features are disabled.",
        variant: "destructive",
        duration: 30000, // Longer duration for this critical setup error
      });
      setLoading(false); // Crucial: stop loading if auth is not available
      return; // Stop further auth processing
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error("Error in onAuthStateChanged:", error);
      toast({
        title: "Authentication State Error",
        description: "Could not retrieve authentication status. " + error.message,
        variant: "destructive",
      });
      setLoading(false);
    });

    return unsubscribe;
  }, [toast]);

  const signup = async (email: string, password: string): Promise<User | null> => {
    if (!auth) {
      toast({ title: "Signup Failed", description: "Authentication service not properly initialized. Check environment variables and console logs.", variant: "destructive" });
      return null;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      toast({ title: "Success", description: "Account created successfully!" });
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      console.error('Signup Error:', authError);
      toast({ title: "Signup Failed", description: authError.message, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    if (!auth) {
      toast({ title: "Login Failed", description: "Authentication service not properly initialized. Check environment variables and console logs.", variant: "destructive" });
      return null;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      toast({ title: "Success", description: "Logged in successfully!" });
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      console.error('Login Error:', authError);
      toast({ title: "Login Failed", description: authError.message, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!auth) {
      toast({ title: "Logout Failed", description: "Authentication service not properly initialized. Check environment variables and console logs.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      toast({ title: "Success", description: "Logged out successfully." });
    } catch (error) {
      const authError = error as AuthError;
      console.error('Logout Error:', authError);
      toast({ title: "Logout Failed", description: authError.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
  };

  // If loading and auth is not available, show a minimal state or a message.
  // This helps prevent rendering children that might depend on auth context prematurely.
  if (loading && !auth && !currentUser) {
     return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'hsl(var(--destructive-foreground))', background: 'hsl(var(--destructive))' }}>
        Critical Firebase Configuration Error: Authentication service is not available.
        Please check console logs for details and ensure your Firebase environment variables are correctly set up.
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
