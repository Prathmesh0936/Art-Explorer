
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
import { auth } from '@/lib/firebase';
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
        "Firebase Auth service is not available. This often means Firebase isn't configured correctly with environment variables. Please check your .env.local file and ensure your Next.js server was restarted after changes."
      );
      toast({
        title: "Authentication Error",
        description: "Firebase authentication service is not available. Please check the setup and console for details.",
        variant: "destructive",
        duration: 10000, // Keep this message visible longer
      });
      setLoading(false); // Stop loading as auth operations will fail
      return; // Skip setting up onAuthStateChanged
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      // Handle errors from onAuthStateChanged itself, e.g., network issues or permissions
      console.error("Error in onAuthStateChanged:", error);
      toast({
        title: "Authentication State Error",
        description: "Could not retrieve authentication status. " + error.message,
        variant: "destructive",
      });
      setLoading(false);
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, [toast]); // Add toast to dependency array

  const signup = async (email: string, password: string): Promise<User | null> => {
    if (!auth) {
      toast({ title: "Signup Failed", description: "Authentication service not available.", variant: "destructive" });
      return null;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      toast({ title: "Success", description: "Account created successfully!" });
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      console.error('Signup Error:', authError);
      toast({ title: "Signup Failed", description: authError.message, variant: "destructive" });
      setLoading(false);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<User | null> => {
    if (!auth) {
      toast({ title: "Login Failed", description: "Authentication service not available.", variant: "destructive" });
      return null;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(userCredential.user);
      toast({ title: "Success", description: "Logged in successfully!" });
      setLoading(false);
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      console.error('Login Error:', authError);
      toast({ title: "Login Failed", description: authError.message, variant: "destructive" });
      setLoading(false);
      return null;
    }
  };

  const logout = async () => {
    if (!auth) {
      toast({ title: "Logout Failed", description: "Authentication service not available.", variant: "destructive" });
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
