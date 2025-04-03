
import React from "react";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";

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
  const handleCheckConnection = async () => {
    try {
      console.log("Manual connection check initiated");
      await onCheckConnection();
    } catch (error) {
      console.error("Connection check failed:", error);
    }
  };

  return (
    <div className={`px-4 py-2 flex items-center justify-between ${
      isConnected ? 'bg-green-900/30' : 'bg-red-900/30'
    }`}>
      <div className="flex items-center gap-2">
        {isChecking ? (
          <>
            <div className="animate-pulse">
              <Wifi size={16} className="text-yellow-400" />
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
              Check console for details
            </span>
          </>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleCheckConnection}
        disabled={isChecking}
        className="h-7 text-xs"
      >
        {isChecking ? "Checking..." : "Check Connection"}
      </Button>
    </div>
  );
};
