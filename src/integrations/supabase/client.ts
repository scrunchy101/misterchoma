import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use environment variables if available, otherwise fallback to the hardcoded values
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ybabulttjjhmkpmjnebe.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliYWJ1bHR0ampobWtwbWpuZWJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MjIxODUsImV4cCI6MjA1NzA5ODE4NX0.s4HbPtrj4p3UInZ-xbysrW81GBemmWyaKUEskrHxys8";

// Add error handling for connection issues
const initSupabaseClient = () => {
  try {
    console.log("[Supabase] Initializing client with URL:", SUPABASE_URL);
    console.log("[Supabase] Key length:", SUPABASE_ANON_KEY ? SUPABASE_ANON_KEY.length : 0);
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error("[Supabase] Missing URL or key:", { 
        url: SUPABASE_URL ? "provided" : "missing", 
        key: SUPABASE_ANON_KEY ? "provided" : "missing" 
      });
    }
    
    // Create client with options
    const client = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        storageKey: 'supabase-auth',
        storage: window.localStorage,  // Use localStorage instead of indexedDB
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    
    console.log("[Supabase] Client created successfully");
    return client;
  } catch (error) {
    console.error("[Supabase] Failed to initialize client:", error);
    console.error("[Supabase] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    
    // Return a minimal client that will show proper error messages in the UI
    // rather than crashing the application
    return createClient<Database>(
      SUPABASE_URL || "https://placeholder.supabase.co",
      SUPABASE_ANON_KEY || "placeholder-key"
    );
  }
};

console.log("[Supabase] Setting up Supabase client");
export const supabase = initSupabaseClient();

// Helper to check if Supabase connection is working
export const checkSupabaseConnection = async () => {
  try {
    console.log("[Supabase] Testing connection...");
    const start = Date.now();
    
    // Set a timeout to avoid hanging indefinitely
    const response = await Promise.race([
      supabase.from('menu_items').select('count').limit(1),
      new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error("Supabase connection timed out after 5s")), 5000)
      )
    ]);
    
    const elapsed = Date.now() - start;
    const { data, error } = response;
    
    if (error) {
      console.error(`[Supabase] Connection test failed after ${elapsed}ms:`, error);
      console.error("[Supabase] Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        status: error.status || 'unknown'
      });
      throw error;
    }
    
    console.log(`[Supabase] Connection successful in ${elapsed}ms:`, data);
    return { connected: true };
  } catch (error) {
    console.error("[Supabase] Connection check error:", error);
    console.error("[Supabase] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown',
      code: error.code
    });
    return { connected: false, error };
  }
};

// Helper to fetch order details including items
export const fetchOrderDetails = async (orderId: string) => {
  try {
    console.log("[Supabase] Fetching order details for ID:", orderId);
    
    // Get order information
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();
    
    if (orderError) {
      console.error("[Supabase] Error fetching order:", orderError);
      throw orderError;
    }
    
    if (!order) {
      console.error("[Supabase] Order not found:", orderId);
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    console.log("[Supabase] Order data fetched:", order);
    
    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        id,
        quantity,
        unit_price,
        subtotal,
        menu_items (
          id,
          name,
          price
        )
      `)
      .eq('order_id', orderId);
    
    if (itemsError) {
      console.error("[Supabase] Error fetching order items:", itemsError);
      throw itemsError;
    }
    
    console.log("[Supabase] Order items fetched:", orderItems);
    
    return {
      order,
      items: orderItems.map(item => ({
        id: item.id,
        name: item.menu_items?.name || 'Unknown Item',
        price: item.unit_price,
        quantity: item.quantity,
        subtotal: item.subtotal
      }))
    };
  } catch (error) {
    console.error("[Supabase] Error fetching order details:", error);
    throw error;
  }
};
