
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/integrations/firebase/config";
import { collection, getDocs, query, limit } from "firebase/firestore";

export interface DatabaseConnections {
  firebase: boolean;
  supabase: boolean;
  primaryAvailable: 'firebase' | 'supabase' | null;
  errors: {
    firebase: string | null;
    supabase: string | null;
  };
}

export const checkDatabaseConnections = async (): Promise<DatabaseConnections> => {
  console.log("[Connection] Starting database connection checks...");
  
  const result: DatabaseConnections = {
    firebase: false,
    supabase: false,
    primaryAvailable: null,
    errors: {
      firebase: null,
      supabase: null
    }
  };
  
  // Check Supabase connection
  try {
    console.log("[Connection] Checking Supabase connection...");
    const start = Date.now();
    const { data, error } = await Promise.race([
      supabase.from('menu_items').select('id').limit(1),
      new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error("Supabase connection timeout after 5000ms")), 5000)
      )
    ]);
    const elapsed = Date.now() - start;
    
    if (error) {
      console.error(`[Connection] Supabase check failed after ${elapsed}ms:`, error);
      console.error(`[Connection] Supabase error details:`, {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        status: error.status
      });
      result.errors.supabase = `${error.message} (Code: ${error.code})`;
      result.supabase = false;
    } else {
      console.log(`[Connection] Supabase connected successfully in ${elapsed}ms!`);
      console.log(`[Connection] Supabase data response:`, data);
      result.supabase = true;
    }
  } catch (error) {
    console.error("[Connection] Supabase check threw exception:", error);
    console.error("[Connection] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    result.errors.supabase = error instanceof Error ? error.message : String(error);
    result.supabase = false;
  }
  
  // Check Firebase connection
  try {
    console.log("[Connection] Checking Firebase connection...");
    if (!db) {
      console.error("[Connection] Firebase DB reference is null/undefined");
      result.errors.firebase = "Firebase DB reference is null/undefined";
      result.firebase = false;
    } else {
      const start = Date.now();
      try {
        const testRef = collection(db, "test_connection");  // Use a test collection
        const q = query(testRef, limit(1));
        
        const queryResult = await Promise.race([
          getDocs(q),
          new Promise<any>((_, reject) => 
            setTimeout(() => reject(new Error("Firebase connection timeout after 5000ms")), 5000)
          )
        ]);
        
        const elapsed = Date.now() - start;
        console.log(`[Connection] Firebase connected successfully in ${elapsed}ms!`);
        result.firebase = true;
      } catch (firestoreError) {
        const elapsed = Date.now() - start;
        console.error(`[Connection] Firebase query failed after ${elapsed}ms:`, firestoreError);
        console.error("[Connection] Firebase query error details:", {
          message: firestoreError instanceof Error ? firestoreError.message : String(firestoreError),
          code: firestoreError.code,
          name: firestoreError instanceof Error ? firestoreError.name : 'Unknown'
        });
        
        // Check if this is a CORS or permission error
        const errorMsg = String(firestoreError);
        if (errorMsg.includes("storage is not allowed") || 
            errorMsg.includes("Access to storage") || 
            errorMsg.includes("CORS")) {
          console.error("[Connection] Firebase error appears to be CORS or storage access related");
          result.errors.firebase = "Browser storage or CORS issue - check browser settings";
        } else if (errorMsg.includes("permission-denied")) {
          result.errors.firebase = "Permission denied - check Firebase rules";
        } else {
          result.errors.firebase = errorMsg.substring(0, 100); // Limit string length
        }
        
        result.firebase = false;
      }
    }
  } catch (error) {
    console.error("[Connection] Firebase check threw exception:", error);
    console.error("[Connection] Firebase error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    });
    result.errors.firebase = error instanceof Error ? error.message : String(error);
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
