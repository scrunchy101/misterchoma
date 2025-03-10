
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ybabulttjjhmkpmjnebe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliYWJ1bHR0ampobWtwbWpuZWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MjIxODUsImV4cCI6MjA1NzA5ODE4NX0.s4HbPtrj4p3UInZ-xbysrW81GBemmWyaKUEskrHxys8";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
