
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables if available, otherwise fallback to the hardcoded values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ybabulttjjhmkpmjnebe.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliYWJ1bHR0ampobWtwbWpuZWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MjIxODUsImV4cCI6MjA1NzA5ODE4NX0.s4HbPtrj4p3UInZ-xbysrW81GBemmWyaKUEskrHxys8";

// Add error handling for connection issues
const initSupabaseClient = () => {
  try {
    return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
    // Return a minimal client that will show proper error messages in the UI
    // rather than crashing the application
    return createClient<Database>(
      SUPABASE_URL || "https://placeholder.supabase.co",
      SUPABASE_ANON_KEY || "placeholder-key"
    );
  }
};

export const supabase = initSupabaseClient();

// Helper to check if Supabase connection is working
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('inventory').select('count').limit(1);
    if (error) throw error;
    return { connected: true };
  } catch (error) {
    console.error("Supabase connection check failed:", error);
    return { connected: false, error };
  }
};
