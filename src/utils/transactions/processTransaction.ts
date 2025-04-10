
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
    console.log(`[Transaction] Starting transaction processing with ${usePrimaryDb} as primary database`);
    console.log(`[Transaction] Cart items:`, items.length, `Customer: "${customerName}", Total: ${total}`);
    
    // Validate cart first
    if (!items.length) {
      console.error("[Transaction] Error: Cannot process an empty order");
      return { 
        success: false, 
        error: "Cannot process an empty order" 
      };
    }
    
    // Check connection status before attempting transaction
    console.log("[Transaction] Checking database connections...");
    const connections = await checkDatabaseConnections();
    console.log("[Transaction] Connection status details:", {
      firebase: connections.firebase,
      supabase: connections.supabase,
      primaryAvailable: connections.primaryAvailable
    });
    
    // If requested database isn't available, try the other one
    if (usePrimaryDb === 'firebase' && !connections.firebase) {
      console.log("[Transaction] Firebase not available, checking Supabase...");
      if (connections.supabase) {
        console.log("[Transaction] Using Supabase as fallback");
        usePrimaryDb = 'supabase';
      } else {
        console.error("[Transaction] Error: No database connection available");
        throw new Error("No database connection available");
      }
    } else if (usePrimaryDb === 'supabase' && !connections.supabase) {
      console.log("[Transaction] Supabase not available, checking Firebase...");
      if (connections.firebase) {
        console.log("[Transaction] Using Firebase as fallback");
        usePrimaryDb = 'firebase';
      } else {
        console.error("[Transaction] Error: No database connection available");
        throw new Error("No database connection available");
      }
    }
    
    if (!connections.firebase && !connections.supabase) {
      console.error("[Transaction] Error: Cannot connect to any database");
      throw new Error("Cannot connect to any database");
    }
    
    // Process with chosen database
    let result: TransactionResult;
    
    console.log(`[Transaction] Processing with ${usePrimaryDb}...`);
    if (usePrimaryDb === 'firebase') {
      result = await processFirebaseTransaction(items, customerName, total);
    } else {
      result = await processSupabaseTransaction(items, customerName, total);
    }
    
    console.log(`[Transaction] Result:`, result);
    
    // If we used Firebase, also save to Supabase if available for consistency
    if (usePrimaryDb === 'firebase' && connections.supabase) {
      try {
        console.log("[Transaction] Also saving transaction to Supabase for consistency...");
        await processSupabaseTransaction(items, customerName, total);
      } catch (error) {
        console.error("[Transaction] Failed to save transaction to Supabase:", error);
        // Don't throw error here, since Firebase transaction was successful
      }
    }

    return result;

  } catch (error) {
    console.error("[Transaction] Processing error:", error);
    console.error("[Transaction] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};
