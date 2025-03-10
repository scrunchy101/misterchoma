
import React, { createContext, useContext, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  customerName: string;
  tableNumber: number | null;
  paymentMethod: string;
}

interface POSContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItemFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  isProcessingOrder: boolean;
  processOrder: (orderDetails: OrderDetails) => Promise<boolean>;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const { toast } = useToast();

  const addItemToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
      // Check if the item already exists in the cart
      const existingItem = prevItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(item => 
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + newItem.quantity } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, newItem];
      }
    });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItemFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Process the order
  const processOrder = async (orderDetails: OrderDetails): Promise<boolean> => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Cannot process an order with an empty cart",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsProcessingOrder(true);

      // 1. Create a new order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: orderDetails.customerName,
          table_number: orderDetails.tableNumber,
          payment_method: orderDetails.paymentMethod,
          payment_status: 'pending',
          status: 'in-progress',
          total_amount: cartTotal
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Add order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Success - clear cart and notify user
      clearCart();
      toast({
        title: "Order Created",
        description: `Order #${orderData.id.substring(0, 8).toUpperCase()} has been created successfully`,
      });
      
      return true;
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const contextValue: POSContextType = {
    cartItems,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    cartTotal,
    isProcessingOrder,
    processOrder
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
