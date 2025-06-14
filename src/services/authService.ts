
import { supabase } from "@/integrations/supabase/client";
import { Profile } from '@/types/auth';

export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching profile:', error);
    // Don't throw for 404s on profiles, just return null
    if (error.code === 'PGRST116') {
      return null;
    }
    throw error;
  }
  return data;
};

export const signInWithPassword = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const signUpWithPassword = async (email: string, password: string, userData: { full_name?: string | null }) => {
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
};

export const signOutFromSession = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

export const signInAsAdmin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
        email: "misterchoma@gmail.com",
        password: "Tanzania101"
    });
    if (error) throw error;
};
