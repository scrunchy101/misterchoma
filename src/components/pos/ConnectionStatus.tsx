
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConnectionStatusProps {
  isConnected: boolean;
  isChecking: boolean;
  onCheckConnection: () => Promise<boolean | void>;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  isChecking,
  onCheckConnection
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const { toast } = useToast();
  
  // Handle network status changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Show toast when network status changes
  useEffect(() => {
    if (isOnline && !isConnected) {
      // We're online but not connected to Firebase, attempt a connection check
      onCheckConnection();
    }
    
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Your internet connection appears to be offline.",
        variant: "destructive",
      });
    }
  }, [isOnline, isConnected, onCheckConnection, toast]);

  const handleCheckConnection = async () => {
    try {
      console.log("Manual connection check initiated");
      if (!isOnline) {
        toast({
          title: "Network Unavailable",
          description: "Your device appears to be offline. Please check your internet connection.",
          variant: "destructive",
        });
        return;
      }
      
      await onCheckConnection();
    } catch (error) {
      console.error("Connection check failed:", error);
      toast({
        title: "Connection Check Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`px-4 py-2 flex items-center justify-between ${
      !isOnline ? 'bg-gray-700/50' : 
      isConnected ? 'bg-green-900/30' : 'bg-red-900/30'
    }`}>
      <div className="flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff size={16} className="text-gray-400" />
            <span className="text-gray-400 text-sm">No internet connection</span>
          </>
        ) : isChecking ? (
          <>
            <div className="animate-pulse">
              <RefreshCw size={16} className="text-yellow-400 animate-spin" />
            </div>
            <span className="text-yellow-400 text-sm">Checking Firebase connection...</span>
          </>
        ) : isConnected ? (
          <>
            <Wifi size={16} className="text-green-400" />
            <span className="text-green-400 text-sm">Connected to Firebase</span>
          </>
        ) : (
          <>
            <WifiOff size={16} className="text-red-400" />
            <span className="text-red-400 text-sm">Firebase connection failed</span>
            <span className="text-xs text-amber-400 flex items-center gap-1 ml-2">
              <AlertCircle size={12} />
              Orders may not process correctly
            </span>
          </>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleCheckConnection}
        disabled={isChecking || !isOnline}
        className="h-7 text-xs"
      >
        {isChecking ? "Checking..." : "Check Connection"}
      </Button>
    </div>
  );
};
