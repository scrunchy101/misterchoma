
import { useState } from "react";
import { db } from "@/integrations/firebase/config";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { ConnectionStatus } from "./types";
import { useToast } from "@/hooks/use-toast";

export const useFirebaseConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ 
    connected: false, 
    checking: false 
  });
  const { toast } = useToast();

  // Check Firebase connection
  const checkConnection = async () => {
    try {
      setConnectionStatus(prev => ({ ...prev, checking: true }));
      console.log("Checking Firebase connection...");
      
      // Validate that Firebase is properly initialized
      if (!db) {
        throw new Error("Firebase database reference is not initialized");
      }
      
      try {
        // Test with a simpler approach - just checking if we can get a collection reference
        const testRef = collection(db, "test_connection");
        
        // Create a minimal query that doesn't require specific collections to exist
        const testQuery = query(testRef, limit(1));
        
        // Execute the query to test connection
        await getDocs(testQuery);
        
        console.log("Firebase connection successful");
        setConnectionStatus({ connected: true, checking: false });
        
        return true;
      } catch (queryError: any) {
        console.error("Firebase query failed:", queryError);
        
        // Check for specific error types
        const errorMsg = queryError.message || String(queryError);
        const errorCode = queryError.code;
        
        let userFriendlyMessage = "Could not connect to Firebase database.";
        
        if (errorMsg.includes("permission-denied") || errorCode === "permission-denied") {
          userFriendlyMessage = "Firebase connection failed: Permission denied. Check your security rules.";
        } else if (errorMsg.includes("unavailable") || errorCode === "unavailable") {
          userFriendlyMessage = "Firebase service is currently unavailable. Please try again later.";
        } else if (errorMsg.includes("not-found") || errorCode === "not-found") {
          userFriendlyMessage = "Firebase project or collection not found. Check your configuration.";
        } else if (errorMsg.includes("cancelled") || errorCode === "cancelled") {
          userFriendlyMessage = "Firebase connection was cancelled. This may be due to network issues.";
        }
        
        throw new Error(userFriendlyMessage);
      }
    } catch (error) {
      console.error("Firebase connection check failed:", error);
      setConnectionStatus({ connected: false, checking: false });
      
      const errorMessage = error instanceof Error 
        ? error.message
        : "Could not connect to Firebase. Please check your internet connection and Firebase configuration.";
      
      toast({
        title: "Firebase Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      return false;
    } finally {
      // Ensure checking state is always reset
      setConnectionStatus(prev => ({ ...prev, checking: false }));
    }
  };

  return {
    connectionStatus,
    checkConnection
  };
};
