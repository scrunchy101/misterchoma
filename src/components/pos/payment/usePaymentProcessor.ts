
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MenuItemWithQuantity } from "../types";
import { TransactionData } from "../../billing/receiptUtils";

export const usePaymentProcessor = () => {
  const [currentTransaction, setCurrentTransaction] = useState<TransactionData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{ connected: boolean; error?: any }>({
    connected: false
  });
  const { toast } = useToast();

  const checkConnection = async () => {
    try {
      // Simple check to verify Supabase connection
      const { data, error: supabaseError } = await supabase.from('menu_items').select('count').limit(1);
      
      if (supabaseError) throw new Error(supabaseError.message);
      
      setConnectionStatus({ connected: true });
      console.log("Connected to Supabase successfully");
      return { connected: true };
    } catch (err) {
      const error = err as Error;
      console.error("Failed to connect to Supabase:", error);
      setConnectionStatus({ connected: false, error });
      
      toast({
        title: "Connection Error",
        description: "Could not connect to the database. Some features may be unavailable.",
        variant: "destructive"
      });
      
      return { connected: false, error };
    }
  };

  const processPayment = async (
    cartItems: MenuItemWithQuantity[],
    customerName: string,
    paymentMethod: string = "Cash" // Always use Cash as default
  ): Promise<TransactionData | null> => {
    try {
      if (cartItems.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Cannot process order with an empty cart.",
          variant: "destructive"
        });
        return null;
      }
      
      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Create order in database
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
      
      if (orderError) throw new Error(orderError.message);
      
      if (!orderData) throw new Error("Failed to create order");
      
      const orderId = orderData.id;
      
      // Create order items
      const orderItems = cartItems.map(item => ({
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
      
      // Create transaction data for receipt
      const transaction: TransactionData = {
        id: orderId,
        date: new Date(),
        customer: customerName || "Guest",
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        paymentMethod: "Cash",
        total
      };
      
      setCurrentTransaction(transaction);
      
      toast({
        title: "Order Completed",
        description: `Order #${orderId.substring(0, 8)} has been recorded.`
      });
      
      return transaction;
    } catch (err) {
      const error = err as Error;
      console.error("Order processing error:", error);
      
      toast({
        title: "Order Failed",
        description: error.message || "An error occurred while processing your order.",
        variant: "destructive"
      });
      
      return null;
    }
  };

  return {
    processPayment,
    currentTransaction,
    setCurrentTransaction,
    connectionStatus,
    checkConnection
  };
};
