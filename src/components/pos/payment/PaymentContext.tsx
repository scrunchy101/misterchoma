
import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "../cart/CartContext";
import { format } from "date-fns";

export interface Transaction {
  id: string;
  date: Date;
  customer: string;
  items: CartItem[];
  paymentMethod: string;
  total: number;
}

export interface PaymentContextType {
  currentTransaction: Transaction | null;
  isProcessing: boolean;
  processPayment: (items: CartItem[], customerName: string, paymentMethod: string) => Promise<Transaction | null>;
  clearTransaction: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const processPayment = async (
    items: CartItem[], 
    customerName: string, 
    paymentMethod: string
  ): Promise<Transaction | null> => {
    try {
      if (items.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Cannot process payment for an empty cart.",
          variant: "destructive"
        });
        return null;
      }
      
      setIsProcessing(true);
      
      // Calculate total
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName || "Guest",
          payment_method: paymentMethod,
          payment_status: 'completed',
          total_amount: total,
          status: 'completed'
        })
        .select('id')
        .single();
      
      if (orderError) throw new Error(orderError.message);
      
      if (!orderData) throw new Error("Failed to create order");
      
      const orderId = orderData.id;
      
      // Create order items
      const orderItems = items.map(item => ({
        order_id: orderId,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw new Error(itemsError.message);
      
      // Create transaction object
      const transaction: Transaction = {
        id: orderId,
        date: new Date(),
        customer: customerName || "Guest",
        items: [...items],
        paymentMethod,
        total
      };
      
      setCurrentTransaction(transaction);
      
      toast({
        title: "Payment Successful",
        description: `Order #${orderId.substring(0, 8)} has been processed.`
      });
      
      return transaction;
    } catch (err) {
      const error = err as Error;
      console.error("Payment processing error:", error);
      
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred while processing your payment.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearTransaction = () => {
    setCurrentTransaction(null);
  };

  return (
    <PaymentContext.Provider value={{ 
      currentTransaction, 
      isProcessing, 
      processPayment, 
      clearTransaction 
    }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = (): PaymentContextType => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
