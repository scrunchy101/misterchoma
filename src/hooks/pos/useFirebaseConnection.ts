
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
      
      // Simple query to check if Firebase is accessible
      const menuRef = collection(db, "menu_items");
      const q = query(menuRef, limit(1));
      const querySnapshot = await getDocs(q);
      
      console.log("Firebase connection successful:", querySnapshot.size >= 0);
      setConnectionStatus({ connected: true, checking: false });
      return true;
    } catch (error) {
      console.error("Firebase connection check failed:", error);
      setConnectionStatus({ connected: false, checking: false });
      
      toast({
        title: "Connection Error",
        description: "Could not connect to Firebase. Please check your internet connection.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  return {
    connectionStatus,
    checkConnection
  };
};
