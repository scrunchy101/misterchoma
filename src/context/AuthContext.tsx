import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

// Define types for our profile and auth context
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<void>;
  signOut: () => Promise<void>;
  isAllowed: (allowedRoles: string[]) => boolean;
  adminLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        const currentSession = sessionData?.session;
        setSession(currentSession);
        setUser(currentSession?.user || null);
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
        
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event);
            setSession(newSession);
            setUser(newSession?.user || null);
            
            if (event === 'SIGNED_IN' && newSession?.user) {
              await fetchProfile(newSession.user.id);
            } else if (event === 'SIGNED_OUT') {
              setProfile(null);
            }
          }
        );
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        toast({
          title: "Authentication Error",
          description: error.message || "Failed to initialize authentication",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, [toast]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data as Profile);
      console.log('User profile loaded:', data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Profile Error",
        description: error.message || "Failed to load user profile",
        variant: "destructive"
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in"
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            role: 'cashier'
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "You have successfully signed up"
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Sign up failed",
        description: error.message || "Could not create account",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully"
      });
      
      // Redirect to auth page after sign out
      window.location.href = "/auth";
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: error.message || "Could not sign out",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogin = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: "misterchoma@gmail.com",
        password: "Tanzania101"
      });
      
      if (error) throw error;
      
      toast({
        title: "Administrator Login",
        description: "You have successfully signed in as administrator"
      });
    } catch (error: any) {
      console.error('Admin login error:', error);
      toast({
        title: "Admin login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isAllowed = (allowedRoles: string[]) => {
    if (!profile) return false;
    return allowedRoles.includes(profile.role);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        isAllowed,
        adminLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
