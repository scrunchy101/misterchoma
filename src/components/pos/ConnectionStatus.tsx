
import React from "react";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, Loader2 } from "lucide-react";

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
  return (
    <div className={`px-4 py-2 flex items-center justify-between ${isConnected ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
      <div className="flex items-center">
        {isConnected ? (
          <Wifi className="h-4 w-4 text-green-500 mr-2" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500 mr-2" />
        )}
        <span className="text-sm">
          {isConnected ? 'Connected to POS system' : 'Disconnected from POS system'}
        </span>
      </div>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onCheckConnection()}
        disabled={isChecking}
        className={`text-xs h-7 ${isConnected ? 'border-green-600' : 'border-red-600'}`}
      >
        {isChecking ? (
          <>
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            Checking...
          </>
        ) : (
          'Check Connection'
        )}
      </Button>
    </div>
  );
};
