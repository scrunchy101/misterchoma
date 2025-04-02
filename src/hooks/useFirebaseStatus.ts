
import { useState, useEffect, useCallback } from "react";
import { db } from "@/integrations/firebase/config";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export interface FirebaseConnectionStatus {
  connected: boolean;
  checking: boolean;
  lastChecked: Date | null;
  error: Error | null;
}

export const useFirebaseStatus = () => {
  const [status, setStatus] = useState<FirebaseConnectionStatus>({
    connected: false,
    checking: false,
    lastChecked: null,
    error: null
  });
  const { toast } = useToast();

  const checkConnection = useCallback(async (showToast = true): Promise<boolean> => {
    if (!db) {
      const error = new Error("Firebase database reference is not initialized");
      setStatus({
        connected: false,
        checking: false,
        lastChecked: new Date(),
        error
      });
      
      if (showToast) {
        toast({
          title: "Firebase Error",
          description: "Database reference not initialized. Please check your configuration.",
          variant: "destructive"
        });
      }
      
      return false;
    }
    
    try {
      setStatus(prev => ({ ...prev, checking: true, error: null }));
      console.log("Checking Firebase connection...");
      
      // Test with a lightweight query
      const testRef = collection(db, "test_connection");
      const testQuery = query(testRef, limit(1));
      await getDocs(testQuery);
      
      console.log("Firebase connection successful");
      setStatus({
        connected: true,
        checking: false,
        lastChecked: new Date(),
        error: null
      });
      
      return true;
    } catch (error) {
      console.error("Firebase connection check failed:", error);
      
      const errorObj = error instanceof Error ? error : new Error(String(error));
      
      setStatus({
        connected: false,
        checking: false,
        lastChecked: new Date(),
        error: errorObj
      });
      
      if (showToast) {
        toast({
          title: "Firebase Connection Error",
          description: getFirebaseErrorMessage(errorObj),
          variant: "destructive"
        });
      }
      
      return false;
    }
  }, [toast]);
  
  // Helper to get user-friendly error messages from Firebase errors
  const getFirebaseErrorMessage = (error: Error): string => {
    const errorMessage = error.message || String(error);
    
    if (errorMessage.includes("permission-denied")) {
      return "Permission denied. Check your Firebase security rules.";
    } else if (errorMessage.includes("unavailable")) {
      return "Firebase service is currently unavailable. Please try again later.";
    } else if (errorMessage.includes("not-found")) {
      return "Collection or document not found. Check your Firebase configuration.";
    } else if (errorMessage.includes("network")) {
      return "Network error. Please check your internet connection.";
    } else if (errorMessage.includes("resource-exhausted")) {
      return "Firebase quota exceeded. Please try again later.";
    }
    
    return "Could not connect to Firebase. Please try again later.";
  };

  // Check connection on mount
  useEffect(() => {
    // Initial check with no toast notification
    checkConnection(false);
    
    // Set up regular connection checks (every 5 minutes)
    const intervalId = setInterval(() => {
      checkConnection(false);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [checkConnection]);

  return {
    connectionStatus: status,
    checkConnection
  };
};
