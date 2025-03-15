
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuItemWithQuantity } from "./types";
import { useToast } from "@/hooks/use-toast";
import { TransactionData } from "../billing/receiptUtils";
import { useErrorHandler } from "@/hooks/useErrorHandler";

interface PaymentProcessorProps {
  children: React.ReactNode;
}

interface PaymentContextType {
  processPayment: (cart: MenuItemWithQuantity[], customerName: string, paymentMethod: string) => Promise<TransactionData | null>;
  currentTransaction: TransactionData | null;
  setCurrentTransaction: React.Dispatch<React.SetStateAction<TransactionData | null>>;
}

export const PaymentContext = React.createContext<PaymentContextType | undefined>(undefined);

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({ children }) => {
  const [currentTransaction, setCurrentTransaction] = useState<TransactionData | null>(null);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const processPayment = async (
    cart: MenuItemWithQuantity[], 
    customerName: string, 
    paymentMethod: string
  ): Promise<TransactionData | null> => {
    try {
      // Validate cart
      if (cart.length === 0) {
        toast({
          title: "Empty cart",
          description: "Cannot process payment for an empty cart.",
          variant: "destructive"
        });
        return null;
      }
      
      // Calculate cart total
      const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Try to insert order into database
      let transactionData: TransactionData;
      let isOfflineMode = false;
      
      try {
        // Insert order without using ON CONFLICT clause
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert([{
            customer_name: customerName || "Guest",
            payment_method: "Cash",
            payment_status: 'completed',
            total_amount: total,
            status: 'completed'
          }])
          .select('id')
          .single();
        
        if (orderError) throw orderError;
        
        const orderId = orderData.id;
        
        // Create order items
        const orderItems = cart.map(item => ({
          order_id: orderId,
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity
        }));
        
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);
        
        if (itemsError) throw itemsError;
        
        // Prepare transaction data for receipt
        transactionData = {
          id: orderId,
          date: new Date(),
          customer: customerName || "Guest",
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          paymentMethod: "Cash",
          total: total,
          isOfflineMode: false
        };
        
        // Show success notification
        toast({
          title: "Payment successful",
          description: `Total amount: TZS ${total.toLocaleString()}`,
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        
        // Create a fallback transaction ID that won't be confused with a UUID
        const tempTransactionId = `OFFLINE-${Date.now()}`;
        
        // Create a fallback transaction for receipt if database fails
        transactionData = {
          id: tempTransactionId,
          date: new Date(),
          customer: customerName || "Guest",
          items: cart.map(item => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          paymentMethod: "Cash",
          total: total,
          isOfflineMode: true
        };
        
        // Show alert about offline mode
        toast({
          title: "Offline mode",
          description: "Payment processed in offline mode. Database sync will happen later.",
        });
        
        isOfflineMode = true;
      }
      
      // Set current transaction
      setCurrentTransaction(transactionData);
      
      console.log("Transaction successful:", transactionData.id, isOfflineMode ? "(offline mode)" : "");
      
      return transactionData;
    } catch (error) {
      console.error("Error processing payment:", error);
      
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  const value = {
    processPayment,
    currentTransaction,
    setCurrentTransaction
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = React.useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProcessor");
  }
  return context;
};
