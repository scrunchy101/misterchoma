
import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "../cart/CartContext";
import { MenuItemWithQuantity } from "../types";
import { TransactionData } from "../../billing/receiptUtils";

export interface ConnectionStatus {
  connected: boolean;
  error?: any;
}

export interface PaymentContextType {
  currentTransaction: TransactionData | null;
  isProcessing: boolean;
  connectionStatus: ConnectionStatus;
  checkConnection: () => Promise<ConnectionStatus>;
  processPayment: (
    items: MenuItemWithQuantity[], 
    customerName: string, 
    paymentMethod: string,
    employeeId?: string
  ) => Promise<TransactionData | null>;
  setCurrentTransaction: React.Dispatch<React.SetStateAction<TransactionData | null>>;
  clearTransaction: () => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTransaction, setCurrentTransaction] = useState<TransactionData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false });
  const { toast } = useToast();

  const checkConnection = async (): Promise<ConnectionStatus> => {
    try {
      // Simple check to verify Supabase connection
      const { data, error: supabaseError } = await supabase.from('menu_items').select('id').limit(1);
      
      if (supabaseError) throw supabaseError;
      
      const status = { connected: true };
      setConnectionStatus(status);
      return status;
    } catch (error) {
      console.error("Database connection check failed:", error);
      const status = { connected: false, error };
      setConnectionStatus(status);
      
      toast({
        title: "Connection Error",
        description: "Could not connect to the database. Orders cannot be processed.",
        variant: "destructive"
      });
      
      return status;
    }
  };

  const processPayment = async (
    items: MenuItemWithQuantity[], 
    customerName: string, 
    paymentMethod: string = "Cash", // Default to Cash
    employeeId?: string
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
      
      // Create order in database - Removed the ON CONFLICT statement which was causing the issue
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName || "Guest",
          payment_method: paymentMethod,
          payment_status: 'completed',
          total_amount: total,
          status: 'completed',
          employee_id: employeeId || null
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
      
      // Get employee name if employee ID is provided
      let employeeName = "";
      if (employeeId) {
        const { data: empData, error: empError } = await supabase
          .from('employees')
          .select('name')
          .eq('id', employeeId)
          .maybeSingle();
          
        if (!empError && empData) {
          employeeName = empData.name;
        }
      }
      
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
        paymentMethod: paymentMethod,
        total,
        employeeId,
        employeeName
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
  };

  const clearTransaction = () => {
    setCurrentTransaction(null);
  };

  return (
    <PaymentContext.Provider value={{ 
      currentTransaction, 
      isProcessing, 
      connectionStatus,
      checkConnection,
      processPayment, 
      setCurrentTransaction,
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
