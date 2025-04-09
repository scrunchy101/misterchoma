
import { db } from "@/integrations/firebase/config";
import { supabase } from "@/integrations/supabase/client";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { DatabaseConnectionStatus } from "./types";

// Check connection status for both databases
export const checkDatabaseConnections = async (): Promise<DatabaseConnectionStatus> => {
  let firebaseConnected = false;
  let supabaseConnected = false;
  
  // Check Firebase connection with timeout
  try {
    console.log("Checking Firebase connection...");
    if (db) {
      const firebasePromise = new Promise(async (resolve, reject) => {
        try {
          // Create a simple query test
          const testRef = collection(db, "test_connection");
          const testQuery = query(testRef, limit(1));
          await getDocs(testQuery);
          resolve(true);
        } catch (queryError) {
          console.error("Firebase query failed:", queryError);
          // Even if the test collection doesn't exist, if we didn't get a connection error
          // we can still consider Firebase connected
          resolve(!queryError.toString().includes("failed to connect"));
        }
      });
      
      // Add timeout to Firebase check
      const timeoutPromise = new Promise(resolve => {
        setTimeout(() => resolve(false), 5000);
      });
      
      firebaseConnected = await Promise.race([firebasePromise, timeoutPromise]) as boolean;
      console.log("Firebase connection:", firebaseConnected ? "successful" : "failed or timed out");
    } else {
      console.error("Firebase db object is not initialized");
    }
  } catch (error) {
    console.error("Firebase connection check failed:", error);
  }
  
  // Check Supabase connection with timeout
  try {
    console.log("Checking Supabase connection...");
    const supabasePromise = new Promise(async (resolve, reject) => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('id')
          .limit(1);
        
        resolve(!error);
      } catch (error) {
        console.error("Supabase check error:", error);
        resolve(false);
      }
    });
    
    // Add timeout to Supabase check
    const timeoutPromise = new Promise(resolve => {
      setTimeout(() => resolve(false), 5000);
    });
    
    supabaseConnected = await Promise.race([supabasePromise, timeoutPromise]) as boolean;
    console.log("Supabase connection:", supabaseConnected ? "successful" : "failed or timed out");
  } catch (error) {
    console.error("Supabase connection check failed:", error);
  }
  
  // Determine which database to use as primary
  let primaryAvailable: 'firebase' | 'supabase' | null = null;
  if (firebaseConnected) {
    primaryAvailable = 'firebase';
  } else if (supabaseConnected) {
    primaryAvailable = 'supabase';
  }
  
  return {
    firebase: firebaseConnected,
    supabase: supabaseConnected,
    primaryAvailable
  };
};
