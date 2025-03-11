
import React, { createContext, useContext, ReactNode } from "react";
import { POSContextType } from "./types";
import { useCart } from "./hooks/useCart";
import { useOrders } from "./hooks/useOrders";
import { calculateCartTotal, formatCurrency } from "./utils/cartUtils";

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider = ({ children }: { children: ReactNode }) => {
  const { cartItems, addItemToCart, updateItemQuantity, removeItemFromCart, clearCart } = useCart();
  const { isProcessingOrder, processOrder, getLastOrderId, getOrderReceipt } = useOrders(cartItems, clearCart);
  
  const cartTotal = calculateCartTotal(cartItems);

  const contextValue: POSContextType = {
    cartItems,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    cartTotal,
    isProcessingOrder,
    processOrder,
    formatCurrency,
    getLastOrderId,
    getOrderReceipt
  };

  return (
    <POSContext.Provider value={contextValue}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOSContext = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOSContext must be used within a POSProvider');
  }
  return context;
};
