
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Profile } from '@/types/auth';
import * as authService from '@/services/authService';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: { full_name?: string | null }) => Promise<void>;
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
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        if (initialSession?.user) {
          const profileData = await authService.fetchProfile(initialSession.user.id);
          setProfile(profileData);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (event === 'SIGNED_IN' && newSession?.user) {
            const profileData = await authService.fetchProfile(newSession.user.id);
            setProfile(profileData);
          } else if (event === 'SIGNED_OUT') {
            setProfile(null);
          }
        });

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast({ title: "Authentication Error", description: "Failed to initialize authentication.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [toast]);
  
  const handleAuthAction = async (
    action: Promise<any>, 
    successMessage: string, 
    failureTitle: string, 
    successCallback?: () => void
  ) => {
    setIsLoading(true);
    try {
      await action;
      toast({
        title: "Success",
        description: successMessage,
      });
      if (successCallback) successCallback();
    } catch (error: any) {
      console.error(`${failureTitle} error:`, error);
      
      // Provide more specific error messages
      let errorMessage = error.message || "An unexpected error occurred.";
      
      if (error.message?.includes('fetch')) {
        errorMessage = "Connection failed. Please check your internet connection and try again.";
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      }
      
      toast({
        title: `${failureTitle} failed`,
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const signIn = async (email: string, password: string) => {
    await handleAuthAction(
      authService.signInWithPassword(email, password),
      "You have successfully signed in.",
      "Sign in"
    );
  };

  const signUp = async (email: string, password: string, userData: { full_name?: string | null }) => {
    await handleAuthAction(
      authService.signUpWithPassword(email, password, userData),
      "Account created. You have successfully signed up.",
      "Sign up"
    );
  };

  const signOut = async () => {
    await handleAuthAction(
      authService.signOutFromSession(),
      "You have been signed out successfully.",
      "Sign out",
      () => navigate('/login')
    );
  };

  const adminLogin = async () => {
    await handleAuthAction(
      authService.signInAsAdmin(),
      "You have successfully signed in as administrator.",
      "Admin login"
    );
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
