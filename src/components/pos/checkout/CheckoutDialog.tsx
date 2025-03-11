
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePOSContext } from "@/components/pos/POSContext";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutReceipt } from "./CheckoutReceipt";
import { CheckoutProvider, useCheckout } from "./CheckoutContext";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const CheckoutDialogContent = ({ onOpenChange }: { onOpenChange: (isOpen: boolean) => void }) => {
  const { isProcessingOrder } = usePOSContext();
  const { showReceipt, orderId, receiptData, customerName, paymentMethod, resetCheckout } = useCheckout();
  const { cartItems, cartTotal } = usePOSContext();
  
  const handleClose = () => {
    if (!isProcessingOrder) {
      resetCheckout();
      onOpenChange(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700 text-white">
      <DialogHeader>
        <DialogTitle className="text-white">
          {showReceipt ? "Order Receipt" : "Complete Order"}
        </DialogTitle>
      </DialogHeader>

      {showReceipt ? (
        <CheckoutReceipt
          orderId={orderId}
          customerName={customerName}
          cartItems={cartItems}
          cartTotal={cartTotal}
          paymentMethod={paymentMethod}
          receiptData={receiptData}
          onClose={handleClose}
        />
      ) : (
        <CheckoutForm onCancel={handleClose} />
      )}
    </DialogContent>
  );
};

export const CheckoutDialog = ({ isOpen, onOpenChange }: CheckoutDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <CheckoutProvider>
        <CheckoutDialogContent onOpenChange={onOpenChange} />
      </CheckoutProvider>
    </Dialog>
  );
};
