
import React from "react";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff } from "lucide-react";

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
        {isConnected ? (
          <>
            <Wifi size={16} className="text-green-400" />
            <span className="text-green-400 text-sm">Connected to database</span>
          </>
        ) : (
          <>
            <WifiOff size={16} className="text-red-400" />
            <span className="text-red-400 text-sm">Not connected to database</span>
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
