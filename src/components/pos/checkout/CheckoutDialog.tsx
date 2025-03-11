
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePOSContext } from "@/components/pos/POSContext";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { CheckoutForm } from "./CheckoutForm";
import { CheckoutReceipt } from "./CheckoutReceipt";

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const CheckoutDialog = ({ isOpen, onOpenChange }: CheckoutDialogProps) => {
  const { cartItems, cartTotal, processOrder, isProcessingOrder, getLastOrderId, getOrderReceipt } = usePOSContext();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  
  const [customerName, setCustomerName] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [orderNotes, setOrderNotes] = useState<string>("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const validateOrder = () => {
    if (!cartItems.length) {
      toast({
        title: "Error",
        description: "Cannot process an empty order",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleCheckout = async () => {
    setProcessingError(null);
    
    if (!validateOrder()) {
      return;
    }

    try {
      console.log("Checkout initiated with details:", {
        customerName,
        tableNumber,
        paymentMethod,
        cartItems,
        cartTotal
      });

      const tableNum = tableNumber && tableNumber.trim() !== "" ? parseInt(tableNumber) : null;

      const success = await processOrder({
        customerName: customerName || "Guest",
        tableNumber: tableNum,
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
            
            toast({
              title: "Success",
              description: "Order processed successfully!",
            });
          } catch (error) {
            handleError(error, {
              context: "Receipt Generation",
              showToast: true,
              severity: "warning"
            });
          }
        }
      } else {
        setProcessingError("Order processing failed. Please check the console for more details.");
        throw new Error("Order processing failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setProcessingError(error instanceof Error ? error.message : "Unknown error occurred");
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
      setProcessingError(null);
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
          <CheckoutForm
            customerName={customerName}
            setCustomerName={setCustomerName}
            tableNumber={tableNumber}
            setTableNumber={setTableNumber}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            orderNotes={orderNotes}
            setOrderNotes={setOrderNotes}
            onCheckout={handleCheckout}
            onCancel={handleClose}
            isProcessingOrder={isProcessingOrder}
            cartTotal={cartTotal}
            processingError={processingError}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
