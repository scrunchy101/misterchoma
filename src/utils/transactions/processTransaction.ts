
import { CartItem } from "@/components/pos/SimplePOSPage";
import { TransactionResult } from "./types";
import { processFirebaseTransaction } from "./firebaseTransaction";
import { processSupabaseTransaction } from "./supabaseTransaction";
import { checkDatabaseConnections } from "./connectionUtils";

// Process transaction with support for Firebase and Supabase
export const processTransaction = async (
  items: CartItem[],
  customerName: string,
  total: number,
  usePrimaryDb: 'firebase' | 'supabase' = 'supabase'
): Promise<TransactionResult> => {
  try {
    console.log(`Processing transaction with ${usePrimaryDb} as primary database`);
    
    // Validate cart first
    if (!items.length) {
      return { 
        success: false, 
        error: "Cannot process an empty order" 
      };
    }
    
    // Check connection status before attempting transaction
    const connections = await checkDatabaseConnections();
    
    // If requested database isn't available, try the other one
    if (usePrimaryDb === 'firebase' && !connections.firebase) {
      console.log("Firebase not available, checking Supabase...");
      if (connections.supabase) {
        console.log("Using Supabase as fallback");
        usePrimaryDb = 'supabase';
      } else {
        throw new Error("No database connection available");
      }
    } else if (usePrimaryDb === 'supabase' && !connections.supabase) {
      console.log("Supabase not available, checking Firebase...");
      if (connections.firebase) {
        console.log("Using Firebase as fallback");
        usePrimaryDb = 'firebase';
      } else {
        throw new Error("No database connection available");
      }
    }
    
    if (!connections.firebase && !connections.supabase) {
      throw new Error("Cannot connect to any database");
    }
    
    // Process with chosen database
    let result: TransactionResult;
    
    if (usePrimaryDb === 'firebase') {
      result = await processFirebaseTransaction(items, customerName, total);
    } else {
      result = await processSupabaseTransaction(items, customerName, total);
    }
    
    // If we used Firebase, also save to Supabase if available for consistency
    if (usePrimaryDb === 'firebase' && connections.supabase) {
      try {
        console.log("Also saving transaction to Supabase for consistency...");
        await processSupabaseTransaction(items, customerName, total);
      } catch (error) {
        console.error("Failed to save transaction to Supabase:", error);
        // Don't throw error here, since Firebase transaction was successful
      }
    }

    return result;

  } catch (error) {
    console.error("Transaction processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};
