
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string | null;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface POSTransaction {
  id: string;
  date: Date;
  customer: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  employeeId?: string;
  employeeName?: string;
}

export const usePOSSystem = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, checking: false });
  const [currentTransaction, setCurrentTransaction] = useState<POSTransaction | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check database connection
  const checkConnection = async () => {
    try {
      setConnectionStatus(prev => ({ ...prev, checking: true }));
      
      // Simple query to check if Supabase is accessible
      const { data, error } = await supabase.from('menu_items').select('id').limit(1);
      
      if (error) throw error;
      
      setConnectionStatus({ connected: true, checking: false });
      return true;
    } catch (error) {
      console.error("Database connection check failed:", error);
      setConnectionStatus({ connected: false, checking: false });
      
      toast({
        title: "Connection Error",
        description: "Could not connect to the database. Please check your internet connection.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id);
      
      if (existingItem) {
        return prevCart.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Item Added",
      description: `${item.name} has been added to your cart.`
    });
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart."
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Process payment and create order
  const processOrder = async (customerName: string, employeeId?: string, paymentMethod: string = "Cash") => {
    try {
      setLoading(true);
      
      // Check connection
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error("Cannot process order without database connection");
      }
      
      // Validate cart
      if (cart.length === 0) {
        throw new Error("Cannot process an empty cart");
      }
      
      // Calculate total
      const total = getTotal();
      
      // Create order in database (simple insert, no ON CONFLICT)
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
      
      // Get employee name if employee ID is provided
      let employeeName = "";
      if (employeeId) {
        const { data: empData } = await supabase
          .from('employees')
          .select('name')
          .eq('id', employeeId)
          .maybeSingle();
          
        if (empData) {
          employeeName = empData.name;
        }
      }
      
      // Create transaction object
      const transaction: POSTransaction = {
        id: orderId,
        date: new Date(),
        customer: customerName || "Guest",
        items: [...cart],
        total,
        paymentMethod,
        employeeId,
        employeeName
      };
      
      setCurrentTransaction(transaction);
      
      toast({
        title: "Order Complete",
        description: "Your order has been processed successfully."
      });
      
      return transaction;
    } catch (error: any) {
      console.error("Order processing error:", error);
      
      toast({
        title: "Order Failed",
        description: error.message || "An error occurred while processing your order.",
        variant: "destructive"
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initialize - check connection on first load
  useEffect(() => {
    checkConnection();
  }, []);

  return {
    cart,
    loading,
    connectionStatus,
    currentTransaction,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    processOrder,
    checkConnection,
    itemCount: cart.reduce((count, item) => count + item.quantity, 0),
    setCurrentTransaction
  };
};
