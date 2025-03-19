
import React from "react";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { usePOS } from "../POSContext";

export const ConnectionBanner: React.FC = () => {
  const { isConnected, isLoading, checkConnection } = usePOS();
  
  return (
    <div className={`px-4 py-2 flex items-center justify-between ${
      isConnected ? 'bg-green-900/20' : 'bg-red-900/20'
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
        onClick={() => checkConnection()}
        disabled={isLoading}
        className="h-7 text-xs"
      >
        {isLoading ? (
          <>
            <RefreshCw size={14} className="mr-1 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <RefreshCw size={14} className="mr-1" />
            Check Connection
          </>
        )}
      </Button>
    </div>
  );
};
