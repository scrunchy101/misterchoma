
import React from "react";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { ConnectionIndicator } from "@/components/ui/connection-indicator";

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
    await onCheckConnection();
  };

  return (
    <div className={`px-4 py-2 flex items-center justify-between ${
      isConnected ? 'bg-green-900/30' : 'bg-red-900/30'
    }`}>
      <div className="flex items-center gap-2">
        <ConnectionIndicator 
          status={isChecking ? "checking" : isConnected ? "connected" : "disconnected"}
          label={isChecking 
            ? "Checking Firebase connection..." 
            : isConnected 
              ? "Connected to Firebase" 
              : "Firebase connection failed"
          }
        />
        
        {!isConnected && !isChecking && (
          <span className="text-xs text-amber-400 flex items-center gap-1 ml-2">
            <AlertCircle size={12} />
            Check console for detailed error information
          </span>
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
