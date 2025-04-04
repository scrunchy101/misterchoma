import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SimpleMenu } from "./SimpleMenu";
import { SimpleCart } from "./SimpleCart";
import { SimpleCheckout } from "./SimpleCheckout";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WifiOff, AlertCircle, RefreshCw } from "lucide-react";
import { SimpleReceipt } from "./SimpleReceipt";
import { processTransaction, checkDatabaseConnections } from "@/utils/transactionUtils";
import { Button } from "@/components/ui/button";

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
  const [primaryDb, setPrimaryDb] = useState<'firebase' | 'supabase' | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState<boolean>(false);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Online",
        description: "Internet connection restored."
      });
      // Automatically check database connection when coming back online
      checkConnection();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Internet connection lost. Orders cannot be processed.",
        variant: "destructive"
      });
      setConnected(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check database connection on initial load
    checkConnection();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Check database connection
  const checkConnection = async () => {
    if (!isOnline) {
      setConnected(false);
      setPrimaryDb(null);
      setConnectionError("No internet connection");
      return false;
    }
    
    try {
      setIsCheckingConnection(true);
      setConnectionError(null);
      
      const connections = await checkDatabaseConnections();
      console.log("Database connections:", connections);
      
      // Use the available connection, prioritize Firebase
      if (connections.primaryAvailable) {
        setPrimaryDb(connections.primaryAvailable);
        setConnected(true);
        
        toast({
          title: "Connected",
          description: `Using ${connections.primaryAvailable} as primary database`,
        });
      } else {
        setConnected(false);
        setPrimaryDb(null);
        setConnectionError("Could not connect to any database");
        
        toast({ 
          title: "Connection Error", 
          description: "Could not connect to any database", 
          variant: "destructive" 
        });
      }
      
      return connections.primaryAvailable !== null;
    } catch (error) {
      console.error("Database connection check failed:", error);
      setConnected(false);
      setPrimaryDb(null);
      setConnectionError(error instanceof Error ? error.message : "Unknown connection error");
      
      toast({ 
        title: "Connection Error", 
        description: "Error checking database connections", 
        variant: "destructive" 
      });
      
      return false;
    } finally {
      setIsCheckingConnection(false);
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
  const processOrder = async (customerName: string) => {
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
      // Double check connection before processing
      const isConnected = await checkConnection();
      if (!isConnected) {
        toast({
          title: "Connection Lost",
          description: "Database connection was lost. Please try again.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Processing transaction with:", { 
        items: cart.length,
        customerName,
        total: calculateTotal(),
        primaryDb
      });
      
      // Use the transaction utility with the current primary database
      const result = await processTransaction(
        cart, 
        customerName, 
        calculateTotal(),
        primaryDb || 'firebase'
      );
      
      if (!result.success) {
        throw new Error(result.error || "Transaction failed");
      }
      
      const transactionData = result.data;
      
      // Create transaction record
      const newTransaction = {
        id: transactionData.id,
        date: new Date(),
        customer: customerName || 'Guest',
        items: [...cart],
        total: calculateTotal()
      };
      
      console.log("Transaction completed successfully:", newTransaction);
      
      setTransaction(newTransaction);
      setShowCheckout(false);
      setShowReceipt(true);
      clearCart();
      
      toast({
        title: "Order Complete",
        description: `Order #${transactionData.id.substring(0, 8)} has been processed`
      });
      
      return true;
    } catch (error) {
      console.error("Transaction error:", error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Could not save transaction to database",
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
        <div className="px-4 py-2 flex items-center justify-between">
          <div className={`flex items-center px-3 py-1 rounded-md ${
            isCheckingConnection ? 'bg-yellow-900/20 text-yellow-400' :
            connected ? 'bg-green-900/20 text-green-500' : 'bg-red-900/20 text-red-500'
          }`}>
            {isCheckingConnection ? (
              <>
                <RefreshCw size={16} className="animate-spin mr-2" />
                <span>Checking connection...</span>
              </>
            ) : (
              <>
                <span className={`h-3 w-3 rounded-full mr-2 ${
                  connected ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span>
                  {connected 
                    ? `Connected (using ${primaryDb})` 
                    : connectionError || 'Not connected to database'}
                </span>
              </>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={checkConnection}
            disabled={isCheckingConnection}
            className="h-8 bg-gray-800 border-gray-700"
          >
            {isCheckingConnection ? "Checking..." : "Check Connection"}
          </Button>
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
        
        {/* Connection Error */}
        {isOnline && !connected && !isCheckingConnection && connectionError && (
          <Alert variant="destructive" className="mx-4 mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {connectionError}. Please check your database configuration.
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
            onConfirm={processOrder}
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
