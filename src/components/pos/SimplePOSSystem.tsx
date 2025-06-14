
import React, { createContext, useContext, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

interface OrderContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  isProcessing: boolean;
  processOrder: (customerName: string, employeeId?: string) => Promise<string | null>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const SimplePOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    
    toast({
      title: "Item Added",
      description: `${item.name} added to cart`
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Item removed from cart"
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const processOrder = async (customerName: string, employeeId?: string): Promise<string | null> => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Cannot process an empty order",
        variant: "destructive"
      });
      return null;
    }

    setIsProcessing(true);
    
    try {
      console.log("Processing order:", { customerName, employeeId, items: cart.length, total });
      
      // Create order - simplified without ON CONFLICT
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName || "Guest",
          payment_method: "Cash",
          payment_status: 'completed',
          total_amount: total,
          status: 'completed',
          employee_id: employeeId || null
        })
        .select('id')
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      const orderId = orderData.id;
      console.log("Order created with ID:", orderId);

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
        console.error("Order items error:", itemsError);
        throw new Error(`Failed to save order items: ${itemsError.message}`);
      }

      console.log("Order completed successfully");
      
      toast({
        title: "Order Complete",
        description: `Order #${orderId.substring(0, 8)} has been processed successfully.`
      });

      clearCart();
      return orderId;

    } catch (error) {
      console.error("Order processing error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      
      toast({
        title: "Order Failed",
        description: errorMessage,
        variant: "destructive"
      });
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <OrderContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      isProcessing,
      processOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useSimplePOS = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useSimplePOS must be used within SimplePOSProvider");
  }
  return context;
};
