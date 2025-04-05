
import React, { useState } from "react";
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError("Cannot process order while offline");
      return; 
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const success = await onConfirm(customerName);
      if (success) {
        // Let the parent component handle success (showing receipt)
      } else {
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
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Complete Order</DialogTitle>
        </DialogHeader>
        
        {!isConnected && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Cannot complete order while offline. Please check your connection.
            </AlertDescription>
          </Alert>
        )}
        
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
              className="border-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing || !isConnected}
              className="bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? "Processing..." : "Complete Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
