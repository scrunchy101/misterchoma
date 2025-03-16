
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuItemWithQuantity } from "./types";
import { useToast } from "@/hooks/use-toast";
import { TransactionData } from "../billing/receiptUtils";

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
          description: "Cannot store an empty cart.",
          variant: "destructive"
        });
        return null;
      }
      
      // Calculate cart total
      const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      console.log("Storing transaction data:", {
        customerName,
        paymentMethod: "Cash", // Always use Cash
        cartItems: cart.length,
        total
      });
      
      // Store order in database - No payment processing, just data storage
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName || "Guest",
          payment_method: "Cash", // Always use Cash
          payment_status: 'completed',
          total_amount: total,
          status: 'completed'
        })
        .select('id')
        .single();
      
      if (orderError) {
        console.error("Database error creating order:", orderError);
        toast({
          title: "Storage failed",
          description: "There was an error storing your transaction data. Please try again.",
          variant: "destructive"
        });
        return null;
      }
      
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
      
      if (itemsError) {
        console.error("Database error creating order items:", itemsError);
        toast({
          title: "Transaction partially stored",
          description: "Order was created but items could not be saved. Please contact support.",
          variant: "destructive"
        });
        // Continue with transaction data since the order was created
      } else {
        // Show success notification
        toast({
          title: "Transaction stored successfully",
          description: `Total amount: TZS ${total.toLocaleString()}`,
        });
      }
      
      // Prepare transaction data for receipt
      const transactionData = {
        id: orderId,
        date: new Date(),
        customer: customerName || "Guest",
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: "Cash",
        total: total
      };
      
      // Set current transaction
      setCurrentTransaction(transactionData);
      
      console.log("Transaction data stored with ID:", orderId);
      
      return transactionData;
    } catch (error) {
      console.error("Error storing transaction data:", error);
      
      toast({
        title: "Storage failed",
        description: error instanceof Error ? error.message : "There was an error storing your transaction data. Please try again.",
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
