
import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface POSContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: Error | null;
  checkConnection: () => Promise<boolean>;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const checkConnection = async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simple check to verify Supabase connection
      const { data, error: supabaseError } = await supabase.from('menu_items').select('count').limit(1);
      
      if (supabaseError) throw new Error(supabaseError.message);
      
      setIsConnected(true);
      console.log("Connected to Supabase successfully");
      return true;
    } catch (err) {
      const error = err as Error;
      console.error("Failed to connect to Supabase:", error);
      setIsConnected(false);
      setError(error);
      
      toast({
        title: "Connection Error",
        description: "Could not connect to the database. Some features may be unavailable.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Check connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <POSContext.Provider value={{ isConnected, isLoading, error, checkConnection }}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = (): POSContextType => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error("usePOS must be used within a POSProvider");
  }
  return context;
};
