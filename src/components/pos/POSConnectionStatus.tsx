
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface POSConnectionStatusProps {
  isCheckingConnection: boolean;
  connected: boolean;
  primaryDb: 'firebase' | 'supabase' | null;
  connectionError: string | null;
  checkConnection: () => Promise<boolean>;
}

export const POSConnectionStatus: React.FC<POSConnectionStatusProps> = ({
  isCheckingConnection,
  connected,
  primaryDb,
  connectionError,
  checkConnection
}) => {
  return (
    <div className="px-4 py-2 flex items-center justify-between">
      <div className={`flex items-center px-3 py-1 rounded-md ${
        isCheckingConnection ? 'bg-yellow-900/20 text-yellow-400' :
        connected ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'
      }`}>
        {isCheckingConnection ? (
          <>
            <RefreshCw size={16} className="animate-spin mr-2" />
            <span>Checking connection...</span>
          </>
        ) : (
          <>
            <span className={`h-3 w-3 rounded-full mr-2 ${
              connected ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            <span>
              {connected 
                ? `Connected (using ${primaryDb})` 
                : connectionError || 'Not connected to database'}
            </span>
          </>
        )}
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={checkConnection}
        disabled={isCheckingConnection}
        className="h-8 bg-gray-800 border-gray-700"
      >
        {isCheckingConnection ? "Checking..." : "Check Connection"}
      </Button>
    </div>
  );
};
