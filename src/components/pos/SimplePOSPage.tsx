
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SimpleMenu } from "./SimpleMenu";
import { SimpleCart } from "./SimpleCart";
import { SimpleCheckout } from "./SimpleCheckout";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SimpleReceipt } from "./SimpleReceipt";

// Define the menu item type
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

// Define cart item type (menu item with quantity)
export interface CartItem extends MenuItem {
  quantity: number;
}

// Define transaction type
export interface Transaction {
  id: string;
  date: Date;
  customer: string;
  items: CartItem[];
  total: number;
}

export const SimplePOSPage: React.FC = () => {
  // State management
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [connected, setConnected] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();
  
  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check database connection
    checkConnection();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check database connection
  const checkConnection = async () => {
    try {
      const { data, error } = await supabase.from('menu_items').select('count').limit(1);
      if (error) throw error;
      setConnected(true);
      return true;
    } catch (error) {
      console.error("Database connection error:", error);
      setConnected(false);
      toast({ 
        title: "Connection Error", 
        description: "Could not connect to database", 
        variant: "destructive" 
      });
      return false;
    }
  };
  
  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Item Added",
      description: `${item.name} added to cart`
    });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };
  
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Item removed from cart"
    });
  };
  
  const clearCart = () => setCart([]);
  
  const calculateTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Process transaction
  const processTransaction = async (customerName: string) => {
    if (!connected || !isOnline) {
      toast({
        title: "Cannot Process Transaction",
        description: "No database connection available",
        variant: "destructive"
      });
      return false;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Cannot process an empty order",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Insert order into database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName || 'Guest',
          total_amount: calculateTotal(),
          payment_method: 'Cash',
          payment_status: 'completed',
          status: 'completed'
        })
        .select('id')
        .single();
      
      if (orderError) throw orderError;
      if (!orderData) throw new Error("Failed to create order");
      
      const orderId = orderData.id;
      
      // Insert order items
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
      
      // Create transaction record
      const newTransaction = {
        id: orderId,
        date: new Date(),
        customer: customerName || 'Guest',
        items: [...cart],
        total: calculateTotal()
      };
      
      setTransaction(newTransaction);
      setShowCheckout(false);
      setShowReceipt(true);
      clearCart();
      
      toast({
        title: "Order Complete",
        description: `Order #${orderId.substring(0, 8)} has been processed`
      });
      
      return true;
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description: "Could not save transaction to database",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar activeTab="pos" setActiveTab={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Point of Sale" />
        
        {/* Connection Status */}
        <div className={`px-4 py-2 flex items-center ${
          connected ? 'bg-green-900/20' : 'bg-red-900/20'
        }`}>
          <div className="flex items-center">
            <span className={`h-3 w-3 rounded-full mr-2 ${
              connected ? 'bg-green-500' : 'bg-red-500'
            }`}></span>
            <span>
              {connected ? 'Connected to database' : 'Not connected to database'}
            </span>
          </div>
        </div>
        
        {/* Offline Warning */}
        {!isOnline && (
          <Alert variant="destructive" className="mx-4 mt-2">
            <WifiOff className="h-4 w-4" />
            <AlertTitle>You're offline</AlertTitle>
            <AlertDescription>
              Your internet connection appears to be offline. Orders cannot be processed.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Menu Section */}
          <div className="w-2/3 flex flex-col overflow-hidden">
            <SimpleMenu 
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onAddToCart={addToCart}
            />
          </div>
          
          {/* Cart Section */}
          <div className="w-1/3 border-l border-gray-700 flex flex-col">
            <SimpleCart 
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={() => setShowCheckout(true)}
              total={calculateTotal()}
            />
          </div>
        </div>
        
        {/* Checkout Modal */}
        {showCheckout && (
          <SimpleCheckout
            total={calculateTotal()}
            onClose={() => setShowCheckout(false)}
            onConfirm={processTransaction}
            isConnected={connected && isOnline}
          />
        )}
        
        {/* Receipt Modal */}
        {showReceipt && transaction && (
          <SimpleReceipt
            transaction={transaction}
            onClose={() => setShowReceipt(false)}
          />
        )}
      </div>
    </div>
  );
};
