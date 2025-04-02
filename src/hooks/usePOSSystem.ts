
import { useEffect } from "react";
import { useCart } from "./pos/useCart";
import { useFirebaseStatus } from "@/hooks/useFirebaseStatus";
import { useOrderProcessing } from "./pos/useOrderProcessing";
import { CartItem, MenuItem, OrderTransaction } from "./pos/types";

export type { MenuItem, CartItem, OrderTransaction };

export const usePOSSystem = () => {
  const { 
    cart, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotal,
    itemCount 
  } = useCart();
  
  const { 
    connectionStatus, 
    checkConnection 
  } = useFirebaseStatus();
  
  const { 
    loading, 
    currentTransaction, 
    setCurrentTransaction, 
    processOrder: processOrderInternal 
  } = useOrderProcessing();

  // Process order with connection check
  const processOrder = async (customerName: string, employeeId?: string, paymentMethod: string = "Cash") => {
    // Check connection
    const isConnected = await checkConnection();
    if (!isConnected) {
      throw new Error("Cannot process order without Firebase connection");
    }
    
    return processOrderInternal(cart, customerName, employeeId, paymentMethod);
  };

  // Initialize - check connection on first load
  useEffect(() => {
    const initConnection = async () => {
      try {
        console.log("Running initial Firebase connection check");
        await checkConnection();
      } catch (error) {
        console.error("Initial Firebase connection check failed:", error);
      }
    };
    
    initConnection();
  }, []);

  return {
    cart,
    loading,
    connectionStatus,
    currentTransaction,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    processOrder,
    checkConnection,
    itemCount,
    setCurrentTransaction
  };
};
