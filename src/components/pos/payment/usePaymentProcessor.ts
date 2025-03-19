
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MenuItemWithQuantity } from "../types";
import { TransactionData } from "../../billing/receiptUtils";
import { ConnectionStatus } from "./types";

export const usePaymentProcessor = () => {
  const [currentTransaction, setCurrentTransaction] = useState<TransactionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false });
  const { toast } = useToast();

  const checkConnection = useCallback(async (): Promise<ConnectionStatus> => {
    try {
      // Simple check to verify Supabase connection
      const { data, error: supabaseError } = await supabase.from('menu_items').select('id').limit(1);
      
      if (supabaseError) throw supabaseError;
      
      console.log("Connected to Supabase successfully");
      const status = { connected: true };
      setConnectionStatus(status);
      return status;
    } catch (error) {
      console.error("Failed to connect to Supabase:", error);
      const status = { connected: false, error };
      setConnectionStatus(status);
      
      toast({
        title: "Connection Error",
        description: "Could not connect to the database. Orders cannot be processed.",
        variant: "destructive"
      });
      
      return status;
    }
  }, [toast]);

  const processPayment = useCallback(async (
    items: MenuItemWithQuantity[], 
    customerName: string, 
    paymentMethod: string = "Cash" // Default to Cash
  ): Promise<TransactionData | null> => {
    try {
      if (items.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Cannot process order for an empty cart.",
          variant: "destructive"
        });
        return null;
      }
      
      setIsProcessing(true);
      
      // Check connection first
      const connection = await checkConnection();
      if (!connection.connected) {
        throw new Error("Cannot process order: No database connection");
      }
      
      // Calculate total
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
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
      
      if (orderError) throw orderError;
      
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
      
      if (itemsError) throw itemsError;
      
      // Create transaction object
      const transaction: TransactionData = {
        id: orderId,
        date: new Date(),
        customer: customerName || "Guest",
        items: items.map(item => ({
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
        title: "Order Saved",
        description: `Order #${orderId.substring(0, 8)} has been saved.`
      });
      
      return transaction;
    } catch (err) {
      const error = err as Error;
      console.error("Payment processing error:", error);
      
      toast({
        title: "Order Failed",
        description: error.message || "An error occurred while saving your order.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [toast, checkConnection]);

  return {
    processPayment,
    currentTransaction,
    setCurrentTransaction,
    connectionStatus,
    checkConnection,
    isProcessing,
    clearTransaction: () => setCurrentTransaction(null)
  };
};
