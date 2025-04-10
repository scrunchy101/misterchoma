
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/integrations/firebase/config";
import { collection, getDocs, query, limit } from "firebase/firestore";

export interface DatabaseConnections {
  firebase: boolean;
  supabase: boolean;
  primaryAvailable: 'firebase' | 'supabase' | null;
}

export const checkDatabaseConnections = async (): Promise<DatabaseConnections> => {
  console.log("[Connection] Starting database connection checks...");
  
  const result: DatabaseConnections = {
    firebase: false,
    supabase: false,
    primaryAvailable: null
  };
  
  // Check Supabase connection
  try {
    console.log("[Connection] Checking Supabase connection...");
    const start = Date.now();
    const { data, error } = await supabase.from('menu_items').select('id').limit(1);
    const elapsed = Date.now() - start;
    
    if (error) {
      console.error(`[Connection] Supabase check failed after ${elapsed}ms:`, error);
      result.supabase = false;
    } else {
      console.log(`[Connection] Supabase connected successfully in ${elapsed}ms!`);
      result.supabase = true;
    }
  } catch (error) {
    console.error("[Connection] Supabase check threw exception:", error);
    result.supabase = false;
  }
  
  // Check Firebase connection
  try {
    console.log("[Connection] Checking Firebase connection...");
    if (!db) {
      console.error("[Connection] Firebase DB reference is null/undefined");
      result.firebase = false;
    } else {
      const start = Date.now();
      const testRef = collection(db, "menu_items");
      const q = query(testRef, limit(1));
      await getDocs(q);
      const elapsed = Date.now() - start;
      
      console.log(`[Connection] Firebase connected successfully in ${elapsed}ms!`);
      result.firebase = true;
    }
  } catch (error) {
    console.error("[Connection] Firebase check threw exception:", error);
    result.firebase = false;
  }
  
  // Determine primary database availability
  if (result.supabase) {
    result.primaryAvailable = 'supabase';
  } else if (result.firebase) {
    result.primaryAvailable = 'firebase';
  }
  
  console.log("[Connection] Connection check results:", result);
  return result;
};
