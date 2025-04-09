import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { checkDatabaseConnections } from "@/utils/transactions/connectionUtils";

interface SimpleCheckoutProps {
  total: number;
  onClose: () => void;
  onConfirm: (customerName: string) => Promise<boolean>;
  isConnected: boolean;
}

export const SimpleCheckout: React.FC<SimpleCheckoutProps> = ({
  total,
  onClose,
  onConfirm,
  isConnected
}) => {
  const [customerName, setCustomerName] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [localConnectionStatus, setLocalConnectionStatus] = useState<boolean>(isConnected);
  
  useEffect(() => {
    setLocalConnectionStatus(isConnected);
  }, [isConnected]);
  
  useEffect(() => {
    if (!isConnected) {
      checkConnection();
    }
  }, [isConnected]);
  
  const checkConnection = async () => {
    setIsCheckingConnection(true);
    setError(null);
    
    try {
      console.log("Checking database connections from checkout modal...");
      const connections = await checkDatabaseConnections();
      console.log("Connection check results:", connections);
      
      const isAvailable = !!connections.supabase;
      setLocalConnectionStatus(isAvailable);
      
      if (!isAvailable) {
        setError("Cannot connect to Supabase database. Orders may not appear in the Orders page.");
      }
      
      return isAvailable;
    } catch (err) {
      console.error("Connection check error:", err);
      setError("Error checking database connection");
      setLocalConnectionStatus(false);
      return false;
    } finally {
      setIsCheckingConnection(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    
    if (!navigator.onLine) {
      setError("Cannot process order while offline. Please check your internet connection.");
      return;
    }
    
    if (!localConnectionStatus && !isCheckingConnection) {
      try {
        const connected = await checkConnection();
        if (!connected) {
          setError("Cannot process order without database connection. Please check your connection.");
          return;
        }
      } catch (error) {
        setError("Connection error. Please try again later.");
        return;
      }
    }
    
    setIsProcessing(true);
    
    try {
      console.log("Starting order processing with customer:", customerName);
      const success = await onConfirm(customerName);
      
      if (!success) {
        setError("Transaction failed. Please try again.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Complete Order</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          {isCheckingConnection ? (
            <div className="flex items-center gap-2 py-2 px-3 bg-yellow-900/30 text-yellow-400 rounded">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Checking database connection...</span>
            </div>
          ) : localConnectionStatus ? (
            <div className="flex items-center gap-2 py-2 px-3 bg-green-900/30 text-green-400 rounded">
              <Wifi className="h-4 w-4" />
              <span>Connected to database</span>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 py-2 px-3 bg-red-900/30 text-red-400 rounded">
              <div className="flex items-center gap-2">
                <WifiOff className="h-4 w-4" />
                <span>Not connected to database</span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 py-0 px-2 bg-gray-700"
                onClick={checkConnection}
                disabled={isCheckingConnection || isProcessing}
              >
                {isCheckingConnection ? "Checking..." : "Retry"}
              </Button>
            </div>
          )}
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Guest"
                className="bg-gray-700 border-gray-600 text-white"
                disabled={isProcessing}
              />
            </div>
            
            <div className="py-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span>TZS {total.toLocaleString()}</span>
              </div>
              <div className="mt-2 text-sm text-gray-400">
                Payment Method: Cash
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing || (!localConnectionStatus && !isCheckingConnection)}
              className={`bg-green-600 hover:bg-green-700 ${isProcessing ? 'opacity-70' : ''}`}
            >
              {isProcessing ? (
                <span className="flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </span>
              ) : "Complete Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
