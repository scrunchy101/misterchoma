
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
      
      // Try a simpler approach to test Firebase connection
      // Just getting the database reference without actually querying
      if (!db) {
        throw new Error("Firebase database reference is not initialized");
      }
      
      // Try to get a collection reference - this doesn't make a network request yet
      const menuRef = collection(db, "menu_items");
      
      // Now make a small query to check connectivity
      const q = query(menuRef, limit(1));
      
      try {
        // Execute the query to test actual connection
        const querySnapshot = await getDocs(q);
        console.log("Firebase connection successful:", querySnapshot.size >= 0);
        setConnectionStatus({ connected: true, checking: false });
        return true;
      } catch (queryError) {
        console.error("Firebase query failed:", queryError);
        throw new Error("Could not query Firestore database");
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
