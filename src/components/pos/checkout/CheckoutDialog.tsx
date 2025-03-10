
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
  
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [orderNotes, setOrderNotes] = useState<string>("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);

  const handleCheckout = async () => {
    const success = await processOrder({
      customerName: receiptData?.customer || "Guest",
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
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showReceipt ? "Order Receipt" : "Complete Order"}
          </DialogTitle>
        </DialogHeader>

        {showReceipt ? (
          <>
            <ReceiptPreview
              orderId={orderId || ""}
              customerName={receiptData?.customer || "Guest"}
              items={cartItems}
              total={cartTotal}
              paymentMethod={paymentMethod}
              date={receiptData?.date || new Date()}
            />
            <div className="flex justify-end mt-4">
              <Button onClick={handleClose}>
                Close
              </Button>
            </div>
          </>
        ) : (
          <>
            <CustomerInfoSection 
              tableNumber={tableNumber} 
              setTableNumber={setTableNumber} 
            />
            
            <div className="space-y-4 mt-4">
              <PaymentMethodSelector 
                value={paymentMethod} 
                onChange={setPaymentMethod} 
              />
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes
                </label>
                <Textarea 
                  id="notes"
                  placeholder="Any special instructions or notes for this order"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full"
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
