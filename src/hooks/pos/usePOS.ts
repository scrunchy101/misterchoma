
import { useState, useEffect } from "react";
import { useCart } from "./useCart";
import { useFirebaseStatus } from "@/hooks/useFirebaseStatus";
import { useOrderProcessing } from "./useOrderProcessing";
import { CartItem, MenuItem, OrderTransaction } from "./types";
import { useToast } from "@/hooks/use-toast";

export interface POSState {
  cart: CartItem[];
  isProcessingOrder: boolean;
  currentTransaction: OrderTransaction | null;
  connectionStatus: {
    connected: boolean;
    checking: boolean;
    error: Error | null;
  };
  error: Error | null;
}

export const usePOS = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<OrderTransaction | null>(null);
  
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getTotal, itemCount } = useCart();
  const { connectionStatus, checkConnection } = useFirebaseStatus();
  const { processOrder } = useOrderProcessing();
  const { toast } = useToast();

  // Handle order submission
  const submitOrder = async (customerName: string, employeeId?: string): Promise<OrderTransaction | null> => {
    try {
      // Reset error state
      setError(null);
      setIsProcessingOrder(true);
      
      // Check connection first
      const isConnected = await checkConnection(true);
      if (!isConnected) {
        throw new Error("Cannot process order without a database connection");
      }
      
      // Validate cart
      if (cart.length === 0) {
        throw new Error("Cannot submit an empty order");
      }
      
      // Process order
      console.log(`Processing order for ${customerName || "Guest"}`);
      const transaction = await processOrder(cart, customerName, employeeId);
      
      if (transaction) {
        setCurrentTransaction(transaction);
        clearCart();
        toast({
          title: "Order Complete",
          description: `Order #${transaction.id.substring(0, 8)} has been processed successfully.`
        });
      }
      
      return transaction;
    } catch (error) {
      console.error("Error submitting order:", error);
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      
      toast({
        title: "Order Failed",
        description: errorObj.message || "An error occurred while processing your order.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsProcessingOrder(false);
    }
  };

  // Initialize - check connection on mount
  useEffect(() => {
    checkConnection(false);
  }, []);

  return {
    // Cart operations
    cart,
    addToCart,
    updateQuantity, 
    removeFromCart,
    clearCart,
    getTotal,
    itemCount,
    
    // Order processing
    isProcessingOrder,
    submitOrder,
    currentTransaction,
    setCurrentTransaction,
    
    // Connection status
    connectionStatus,
    checkConnection,
    
    // Error handling
    error,
    setError
  };
};
