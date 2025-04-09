
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff, AlertCircle } from "lucide-react";

interface POSAlertsProps {
  isOnline: boolean;
  connected: boolean;
  isCheckingConnection: boolean;
  connectionError: string | null;
}

export const POSAlerts: React.FC<POSAlertsProps> = ({
  isOnline,
  connected,
  isCheckingConnection,
  connectionError
}) => {
  return (
    <>
      {!isOnline && (
        <Alert variant="destructive" className="mx-4 mt-2">
          <WifiOff className="h-4 w-4" />
          <AlertTitle>You're offline</AlertTitle>
          <AlertDescription>
            Your internet connection appears to be offline. Orders cannot be processed.
          </AlertDescription>
        </Alert>
      )}
      
      {isOnline && !connected && !isCheckingConnection && connectionError && (
        <Alert variant="destructive" className="mx-4 mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription>
            {connectionError}. Please check your database configuration.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
