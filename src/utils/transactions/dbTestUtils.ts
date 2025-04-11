
import { supabase } from "@/integrations/supabase/client";

// Function to create test_data table if it doesn't exist
export const ensureTestTableExists = async (): Promise<boolean> => {
  try {
    console.log("[Test Utils] Checking if test_data table exists...");
    
    // Check if the table exists by querying it
    const { error: checkError } = await supabase
      .from('test_data')
      .select('count')
      .limit(1);
    
    // If no error, table exists
    if (!checkError) {
      console.log("[Test Utils] test_data table exists");
      return true;
    }
    
    // If error is not "relation doesn't exist", return false
    if (checkError.code !== '42P01') {
      console.error("[Test Utils] Error checking table:", checkError);
      return false;
    }
    
    console.log("[Test Utils] test_data table doesn't exist, creating...");
    
    // Create the table using a RPC function (if available) or direct SQL
    const { error: createError } = await supabase.rpc(
      'create_test_table',
      {}
    );
    
    if (createError) {
      console.error("[Test Utils] Failed to create test table via RPC:", createError);
      
      // If RPC fails, we can't create the table from the client side safely
      // This would require server-side access or proper permissions
      return false;
    }
    
    console.log("[Test Utils] test_data table created successfully");
    return true;
  } catch (error) {
    console.error("[Test Utils] Error ensuring test table exists:", error);
    return false;
  }
};

// Function to run a write test to Supabase
export const testSupabaseWrite = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // Ensure the table exists first
    const tableExists = await ensureTestTableExists();
    if (!tableExists) {
      return { 
        success: false, 
        error: "Could not ensure test table exists" 
      };
    }
    
    // Try to write a test record
    const testRecord = {
      message: "Test write operation",
      timestamp: new Date().toISOString(),
      source: "manual_test"
    };
    
    const { error } = await supabase
      .from('test_data')
      .insert(testRecord);
    
    if (error) {
      console.error("[Test Utils] Write test failed:", error);
      return { 
        success: false, 
        error: `Write failed: ${error.message} (${error.code})` 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error("[Test Utils] Unexpected error in write test:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
};

// Function to run a write test to Firebase
export const testFirebaseWrite = async (): Promise<{ success: boolean; error?: string }> => {
  // Implementation here - this is just a placeholder
  // The actual implementation is in the DatabaseConnectionTest component
  return { success: false, error: "Not implemented in utils" };
};
