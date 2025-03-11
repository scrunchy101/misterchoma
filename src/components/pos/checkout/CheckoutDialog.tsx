import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CustomerInfoSection } from "@/components/pos/checkout/CustomerInfoSection";
import { PaymentMethodSelector } from "@/components/pos/checkout/PaymentMethodSelector";
import { CheckoutActions } from "@/components/pos/checkout/CheckoutActions";
import { usePOSContext } from "@/components/pos/POSContext";
import { ReceiptPreview } from "@/components/pos/receipt/ReceiptPreview";
import { useToast } from "@/hooks/use-toast";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const CheckoutDialog = ({ isOpen, onOpenChange }: CheckoutDialogProps) => {
  const { cartItems, cartTotal, processOrder, isProcessingOrder, getLastOrderId, getOrderReceipt } = usePOSContext();
  const { toast } = useToast();
  
  const [customerName, setCustomerName] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [orderNotes, setOrderNotes] = useState<string>("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleCheckout = async () => {
    if (!cartItems.length) {
      toast({
        title: "Error",
        description: "Cannot process an empty order",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log("Processing order with details:", {
        customerName,
        tableNumber,
        paymentMethod,
        cartItems,
        cartTotal
      });

      const success = await processOrder({
        customerName: customerName || "Guest",
        tableNumber: tableNumber ? parseInt(tableNumber) : null,
        paymentMethod: paymentMethod
      });

      console.log("Order processing result:", success);

      if (success) {
        const newOrderId = getLastOrderId();
        console.log("New order ID:", newOrderId);
        
        setOrderId(newOrderId);
        
        if (newOrderId) {
          try {
            const receipt = await getOrderReceipt(newOrderId);
            console.log("Receipt data:", receipt);
            setReceiptData(receipt);
            setShowReceipt(true);
            
            toast({
              title: "Success",
              description: "Order processed successfully!",
            });
          } catch (error) {
            console.error("Error getting receipt:", error);
            toast({
              title: "Warning",
              description: "Order processed but couldn't get receipt",
              variant: "destructive"
            });
          }
        }
      } else {
        throw new Error("Order processing failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Error",
        description: "Failed to process order. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleClose = () => {
    if (!isProcessingOrder) {
      setShowReceipt(false);
      setOrderId(null);
      setReceiptData(null);
      setTableNumber(null);
      setPaymentMethod("cash");
      setOrderNotes("");
      setCustomerName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white">
            {showReceipt ? "Order Receipt" : "Complete Order"}
          </DialogTitle>
        </DialogHeader>

        {showReceipt ? (
          <>
            <ReceiptPreview
              orderId={orderId || ""}
              customerName={receiptData?.customer || customerName || "Guest"}
              items={cartItems}
              total={cartTotal}
              paymentMethod={paymentMethod}
              date={receiptData?.date || new Date()}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose} className="bg-green-600 hover:bg-green-700 text-white">
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <CustomerInfoSection 
              customerName={customerName}
              setCustomerName={setCustomerName}
              tableNumber={tableNumber} 
              setTableNumber={setTableNumber} 
            />
            
            <div className="space-y-4 mt-4">
              <PaymentMethodSelector 
                value={paymentMethod} 
                onChange={setPaymentMethod} 
              />
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-white mb-1">
                  Order Notes
                </label>
                <Textarea 
                  id="notes"
                  placeholder="Any special instructions or notes for this order"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                />
              </div>
            </div>
            
            <CheckoutActions 
              onCheckout={handleCheckout} 
              onCancel={handleClose}
              total={cartTotal}
              isProcessing={isProcessingOrder}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
