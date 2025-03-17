
import React, { useState } from "react";
import { useCart } from "../cart/CartContext";
import { usePayment } from "./PaymentContext";
import { usePOS } from "../POSContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { X, Banknote, CreditCard, WifiOff, Wifi } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ open, onClose, onSuccess }) => {
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Card">("Cash");
  const { items, total, clearCart } = useCart();
  const { processPayment, isProcessing } = usePayment();
  const { isConnected, checkConnection } = usePOS();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Connection Error",
        description: "Cannot process payment while offline. Please check your connection.",
        variant: "destructive"
      });
      return;
    }
    
    const transaction = await processPayment(items, customerName, paymentMethod);
    
    if (transaction) {
      clearCart();
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
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
            Complete your order by providing customer information.
          </DialogDescription>
        </DialogHeader>
        
        {/* Connection Status */}
        <div className={`flex items-center gap-2 py-2 px-3 rounded text-sm mb-4 ${
          isConnected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
        }`}>
          {isConnected ? (
            <>
              <Wifi size={16} className="text-green-400" />
              <span>Connected to database</span>
            </>
          ) : (
            <>
              <WifiOff size={16} className="text-red-400" />
              <span>Not connected to database</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => checkConnection()} 
                className="ml-auto text-xs h-7 bg-gray-700 border-gray-600 hover:bg-gray-600"
              >
                Retry
              </Button>
            </>
          )}
        </div>
        
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
                <label className="block text-sm font-medium mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    className={`${
                      paymentMethod === 'Cash' 
                        ? 'bg-blue-900/50 border-blue-400' 
                        : 'bg-gray-700 border-gray-600'
                    } border rounded-md p-3 flex items-center gap-2 cursor-pointer`}
                    onClick={() => setPaymentMethod('Cash')}
                  >
                    <Banknote size={18} className="text-green-400" />
                    <span>Cash</span>
                  </div>
                  <div 
                    className={`${
                      paymentMethod === 'Card' 
                        ? 'bg-blue-900/50 border-blue-400' 
                        : 'bg-gray-700 border-gray-600'
                    } border rounded-md p-3 flex items-center gap-2 cursor-pointer`}
                    onClick={() => setPaymentMethod('Card')}
                  >
                    <CreditCard size={18} className="text-blue-400" />
                    <span>Card</span>
                  </div>
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
                Cannot process orders without database connection
              </p>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
