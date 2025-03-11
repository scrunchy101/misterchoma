
import React, { createContext, useContext, useState, ReactNode } from "react";
import { usePOSContext } from "@/components/pos/POSContext";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useCheckoutValidation } from "./hooks/useCheckoutValidation";

interface CheckoutContextType {
  customerName: string;
  setCustomerName: (name: string) => void;
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
  showReceipt: boolean;
  setShowReceipt: (show: boolean) => void;
  orderId: string | null;
  receiptData: any;
  processingError: string | null;
  errors: {
    customerName?: string;
    tableNumber?: string;
    paymentMethod?: string;
  };
  validateCheckoutForm: () => boolean;
  handleCheckout: () => Promise<void>;
  resetCheckout: () => void;
  isProcessingOrder: boolean;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { cartItems, cartTotal, processOrder, isProcessingOrder, getLastOrderId, getOrderReceipt, clearCart } = usePOSContext();
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const { errors, validateCheckoutForm, clearErrors } = useCheckoutValidation();
  
  // Checkout form state
  const [customerName, setCustomerName] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [orderNotes, setOrderNotes] = useState<string>("");
  
  // Receipt state
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

  const validate = () => {
    const isValid = validateCheckoutForm({
      customerName,
      tableNumber,
      paymentMethod,
    });
    return isValid;
  };

  const handleCheckout = async () => {
    setProcessingError(null);
    
    if (!validateOrder() || !validate()) {
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

  const resetCheckout = () => {
    setShowReceipt(false);
    setOrderId(null);
    setReceiptData(null);
    setTableNumber(null);
    setPaymentMethod("cash");
    setOrderNotes("");
    setCustomerName("");
    setProcessingError(null);
    clearErrors();
  };

  const value: CheckoutContextType = {
    customerName,
    setCustomerName,
    tableNumber,
    setTableNumber,
    paymentMethod,
    setPaymentMethod,
    orderNotes,
    setOrderNotes,
    showReceipt,
    setShowReceipt,
    orderId,
    receiptData,
    processingError,
    errors,
    validateCheckoutForm: validate,
    handleCheckout,
    resetCheckout,
    isProcessingOrder
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
