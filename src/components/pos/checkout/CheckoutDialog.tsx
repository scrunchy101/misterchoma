
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CustomerInfoSection } from "@/components/pos/checkout/CustomerInfoSection";
import { PaymentMethodSelector } from "@/components/pos/checkout/PaymentMethodSelector";
import { CheckoutActions } from "@/components/pos/checkout/CheckoutActions";
import { usePOSContext } from "@/components/pos/POSContext";
import { ReceiptPreview } from "@/components/pos/receipt/ReceiptPreview";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const CheckoutDialog = ({ isOpen, onOpenChange }: CheckoutDialogProps) => {
  const { cartItems, cartTotal, processOrder, isProcessingOrder, getLastOrderId, getOrderReceipt } = usePOSContext();
  
  const [customerName, setCustomerName] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [orderNotes, setOrderNotes] = useState<string>("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleCheckout = async () => {
    const success = await processOrder({
      customerName: customerName || "Guest",
      tableNumber: tableNumber,
      paymentMethod: paymentMethod
    });

    if (success) {
      const newOrderId = getLastOrderId();
      setOrderId(newOrderId);
      
      if (newOrderId) {
        try {
          const receipt = await getOrderReceipt(newOrderId);
          setReceiptData(receipt);
          setShowReceipt(true);
        } catch (error) {
          console.error("Error getting receipt:", error);
        }
      }
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
