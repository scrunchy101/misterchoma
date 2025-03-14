
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, CreditCard, Banknote } from "lucide-react";

interface POSCheckoutProps {
  total: number;
  onClose: () => void;
  onProcessPayment: (customerName: string, paymentMethod: string) => Promise<boolean>;
}

export const POSCheckout: React.FC<POSCheckoutProps> = ({
  total,
  onClose,
  onProcessPayment
}) => {
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Cash");
  const [processing, setProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      const success = await onProcessPayment(customerName, paymentMethod);
      if (!success) {
        setProcessing(false);
      }
    } catch (error) {
      console.error("Error in payment processing:", error);
      setProcessing(false);
    }
  };
  
  return (
    <Dialog open onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Checkout</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              disabled={processing}
            >
              <X size={16} />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
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
                  disabled={processing}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={paymentMethod === "Cash" ? "default" : "outline"}
                    className={`flex items-center justify-center gap-2 ${
                      paymentMethod === "Cash" 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "border-gray-600 hover:bg-gray-700"
                    }`}
                    onClick={() => setPaymentMethod("Cash")}
                    disabled={processing}
                  >
                    <Banknote size={16} />
                    <span>Cash</span>
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === "Card" ? "default" : "outline"}
                    className={`flex items-center justify-center gap-2 ${
                      paymentMethod === "Card" 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "border-gray-600 hover:bg-gray-700"
                    }`}
                    onClick={() => setPaymentMethod("Card")}
                    disabled={processing}
                  >
                    <CreditCard size={16} />
                    <span>Card</span>
                  </Button>
                  <Button
                    type="button"
                    variant={paymentMethod === "Mobile Money" ? "default" : "outline"}
                    className={`flex items-center justify-center gap-2 ${
                      paymentMethod === "Mobile Money" 
                        ? "bg-blue-600 hover:bg-blue-700" 
                        : "border-gray-600 hover:bg-gray-700"
                    }`}
                    onClick={() => setPaymentMethod("Mobile Money")}
                    disabled={processing}
                    style={{ gridColumn: "span 2" }}
                  >
                    <span>Mobile Money</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={processing}
            >
              {processing ? "Processing..." : "Complete Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
