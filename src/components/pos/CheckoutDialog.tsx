
import React, { useState } from "react";
import { CheckCircle, User, Hash, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePOSContext } from "@/components/pos/POSContext";
import { ReceiptViewer } from "@/components/billing/ReceiptViewer";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheckoutDialog = ({ isOpen, onOpenChange }: CheckoutDialogProps) => {
  const { cartItems, cartTotal, processOrder, isProcessingOrder, formatCurrency } = usePOSContext();
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showReceiptViewer, setShowReceiptViewer] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handleCheckout = async () => {
    const success = await processOrder({
      customerName: customerName || "Walk-in Customer",
      tableNumber: tableNumber ? Number(tableNumber) : null,
      paymentMethod: paymentMethod
    });
    
    if (success) {
      // Prepare receipt data
      setReceiptData({
        id: `ORDER-${Math.floor(Math.random() * 10000)}`,
        date: new Date(),
        customer: customerName || "Walk-in Customer",
        items: cartItems.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price * item.quantity
        })),
        paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
        total: cartTotal
      });
      
      setShowReceiptViewer(true);
      
      // Reset form
      setCustomerName("");
      setTableNumber("");
      setPaymentMethod("cash");
    }
  };

  const handleCloseReceipt = () => {
    setShowReceiptViewer(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={isOpen && !showReceiptViewer} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Complete Order</DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill in the order details to complete checkout.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <User size={16} className="mr-2 text-gray-400" />
                <label htmlFor="customer">Customer Name (optional)</label>
              </div>
              <Input 
                id="customer"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Hash size={16} className="mr-2 text-gray-400" />
                <label htmlFor="table">Table Number (optional)</label>
              </div>
              <Input 
                id="table"
                type="number"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Table Number"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <CreditCard size={16} className="mr-2 text-gray-400" />
                <label htmlFor="payment">Payment Method</label>
              </div>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit">Credit Card</SelectItem>
                  <SelectItem value="debit">Debit Card</SelectItem>
                  <SelectItem value="mobile">Mobile Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="pt-2">
              <div className="flex justify-between font-bold">
                <span>Total Amount:</span>
                <span>{formatCurrency(cartTotal)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-gray-600 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCheckout}
              className="bg-green-600 hover:bg-green-700"
              disabled={isProcessingOrder}
            >
              {isProcessingOrder ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={16} className="mr-2" />
                  Complete Order
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {receiptData && (
        <ReceiptViewer 
          isOpen={showReceiptViewer}
          onClose={handleCloseReceipt}
          transactionData={receiptData}
        />
      )}
    </>
  );
};
