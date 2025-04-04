
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Banknote, WifiOff, Wifi, RefreshCw, AlertTriangle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from "@/hooks/useEmployees";
import { useToast } from "@/hooks/use-toast";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (customerName: string, employeeId?: string) => Promise<boolean>;
  total: number;
  isConnected: boolean;
  onCheckConnection: () => Promise<boolean | void>;
  isProcessing: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  open,
  onClose,
  onConfirm,
  total,
  isConnected,
  onCheckConnection,
  isProcessing
}) => {
  const [customerName, setCustomerName] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const { employees, loading: loadingEmployees, error: employeeError } = useEmployees();
  const { toast } = useToast();
  
  // Reset error when modal opens
  useEffect(() => {
    if (open) {
      setLocalError(null);
    }
  }, [open]);
  
  // Verify connection when modal opens
  useEffect(() => {
    if (open) {
      const verifyConnection = async () => {
        try {
          await onCheckConnection();
        } catch (error) {
          console.error("Connection check in checkout failed:", error);
        }
      };
      
      verifyConnection();
    }
  }, [open, onCheckConnection]);

  // Clear local error when connection status changes
  useEffect(() => {
    if (isConnected && localError?.includes("connection")) {
      setLocalError(null);
    }
  }, [isConnected, localError]);
  
  const handleCheckConnection = async () => {
    try {
      setIsRetrying(true);
      await onCheckConnection();
      if (!isConnected) {
        setLocalError("Still unable to connect. Please try again later.");
      }
    } catch (error) {
      console.error("Manual connection retry failed:", error);
      setLocalError("Connection check failed. Please try again.");
    } finally {
      setIsRetrying(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!isConnected) {
      setLocalError("Cannot process order without Firebase connection. Please check your connection and try again.");
      return;
    }
    
    if (employeeError) {
      toast({
        title: "Warning",
        description: "Employee data couldn't be loaded. You can continue without selecting an employee.",
        variant: "default"
      });
    }
    
    try {
      // Process payment with employee ID
      const success = await onConfirm(customerName, selectedEmployeeId || undefined);
      
      if (!success) {
        setLocalError("Failed to process payment. Please try again.");
      }
    } catch (error) {
      console.error("Error in transaction processing:", error);
      setLocalError(error instanceof Error ? error.message : "Transaction processing failed");
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Checkout</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              disabled={isProcessing}
            >
              <X size={16} />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete your order by providing customer and employee information.
          </DialogDescription>
        </DialogHeader>
        
        {/* Connection Status */}
        <div className={`flex items-center gap-2 py-2 px-3 rounded text-sm mb-4 ${
          isRetrying ? 'bg-yellow-900/30 text-yellow-400' :
          isConnected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
        }`}>
          {isRetrying ? (
            <>
              <RefreshCw size={16} className="text-yellow-400 animate-spin" />
              <span>Checking connection...</span>
            </>
          ) : isConnected ? (
            <>
              <Wifi size={16} className="text-green-400" />
              <span>Connected to Firebase</span>
            </>
          ) : (
            <>
              <WifiOff size={16} className="text-red-400" />
              <span>Not connected to Firebase</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCheckConnection} 
                className="ml-auto text-xs h-7 bg-gray-700 border-gray-600 hover:bg-gray-600"
                disabled={isRetrying}
              >
                {isRetrying ? "Checking..." : "Retry"}
              </Button>
            </>
          )}
        </div>
        
        {/* Error message */}
        {localError && (
          <div className="bg-red-900/20 border border-red-900/50 rounded p-3 mb-4 text-sm text-red-400 flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <span>{localError}</span>
          </div>
        )}
        
        {/* Employee loading/error states */}
        {employeeError && (
          <div className="bg-yellow-900/20 border border-yellow-900/50 rounded p-3 mb-4 text-sm text-yellow-400 flex items-start gap-2">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <span>Could not load employee data. You can proceed without selecting an employee.</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex justify-between mb-6 pb-2 border-b border-gray-700">
              <span className="text-lg">Total Amount:</span>
              <span className="text-lg font-bold text-green-400">
                TZS {total.toLocaleString()}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Customer Name (Optional)
                </label>
                <Input 
                  placeholder="Enter customer name"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={isProcessing}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  Employee Serving
                </label>
                <Select 
                  value={selectedEmployeeId} 
                  onValueChange={setSelectedEmployeeId}
                  disabled={isProcessing || loadingEmployees}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {loadingEmployees ? (
                      <SelectItem value="loading" disabled>Loading employees...</SelectItem>
                    ) : employees.length === 0 ? (
                      <SelectItem value="none" disabled>No employees found</SelectItem>
                    ) : (
                      employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name} ({employee.position})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Method
                </label>
                <div className="bg-gray-700 border border-gray-600 rounded-md p-3 flex items-center gap-2">
                  <Banknote size={18} className="text-green-400" />
                  <span>Cash</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isProcessing || !isConnected}
            >
              {isProcessing ? "Processing..." : "Complete Order"}
            </Button>
            {!isConnected && (
              <p className="text-xs text-center mt-2 text-red-400">
                Cannot process orders without Firebase connection
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
