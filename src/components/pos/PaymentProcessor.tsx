
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
      
      console.log("Processing payment for:", cart.length, "items");
      
      // Calculate cart total
      const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      console.log("Payment details:", { customerName, paymentMethod, total });
      
      // Create new order in database - explicitly define all required fields
      const orderData = {
        customer_name: customerName || "Guest",
        payment_method: paymentMethod,
        payment_status: 'completed',
        total_amount: total,
        status: 'completed'
      };
      
      // Fixed: removed the select() call that was causing ON CONFLICT issues
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderData);
      
      if (orderError) {
        console.error("Order creation error:", orderError);
        throw new Error(`Database error: ${orderError.message}`);
      }
      
      // Get the ID of the inserted order using a separate query
      const { data: orderData2, error: orderFetchError } = await supabase
        .from('orders')
        .select('id')
        .eq('customer_name', orderData.customer_name)
        .eq('payment_method', orderData.payment_method)
        .eq('total_amount', orderData.total_amount)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (orderFetchError) {
        console.error("Error fetching created order:", orderFetchError);
        throw new Error(`Failed to retrieve order details: ${orderFetchError.message}`);
      }
      
      if (!orderData2) {
        throw new Error("Failed to create order - no data returned");
      }
      
      console.log("Order created:", orderData2);
      const orderId = orderData2.id;
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderId,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));
      
      console.log("Creating order items:", orderItems.length);
      
      // Insert order items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) {
        console.error("Order items creation error:", itemsError);
        
        // If order items fail, attempt to delete the parent order to maintain data integrity
        await supabase.from('orders').delete().eq('id', orderId);
        
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }
      
      console.log("Order items created successfully");
      
      // Prepare transaction data for receipt
      const transactionData: TransactionData = {
        id: orderId,
        date: new Date(),
        customer: customerName || "Guest",
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: paymentMethod,
        total: total
      };
      
      // Show success notification
      toast({
        title: "Payment successful",
        description: `Total amount: TZS ${total.toLocaleString()}`,
      });
      
      // Set current transaction
      setCurrentTransaction(transactionData);
      
      return transactionData;
    } catch (error) {
      console.error("Error processing payment:", error);
      handleError(error, {
        context: "Payment processing",
        showToast: true
      });
      
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
