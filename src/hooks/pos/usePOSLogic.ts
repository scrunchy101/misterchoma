
import { useState, useEffect } from "react";
import { CartItem, Transaction } from "@/components/pos/SimplePOSPage";
import { useToast } from "@/hooks/use-toast";
import { checkDatabaseConnections, processTransaction } from "@/utils/transactions";

export const usePOSLogic = () => {
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
  const [isProcessingOrder, setIsProcessingOrder] = useState<boolean>(false);
  const [connectionErrorDetails, setConnectionErrorDetails] = useState<{ 
    firebase: string | null, 
    supabase: string | null 
  }>({ firebase: null, supabase: null });
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Online",
        description: "Internet connection restored."
      });
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

    checkConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

      console.log("[POS Logic] Checking database connections...");
      const connections = await checkDatabaseConnections();
      console.log("[POS Logic] Database connections result:", connections);
      
      // Save error details for better diagnostics
      setConnectionErrorDetails({
        firebase: connections.errors.firebase,
        supabase: connections.errors.supabase
      });

      if (connections.primaryAvailable) {
        setPrimaryDb(connections.primaryAvailable);
        setConnected(true);

        toast({
          title: "Connected",
          description: `Using ${connections.primaryAvailable} as primary database`,
        });
        return true;
      } else {
        setConnected(false);
        setPrimaryDb(null);
        
        // Build detailed error message
        let errorMessage = "Could not connect to any database";
        if (connections.errors.firebase) {
          errorMessage += `. Firebase: ${connections.errors.firebase}`;
        }
        if (connections.errors.supabase) {
          errorMessage += `. Supabase: ${connections.errors.supabase}`;
        }
        
        setConnectionError(errorMessage);

        toast({ 
          title: "Connection Error", 
          description: "Could not connect to any database. Check console for details.", 
          variant: "destructive" 
        });
        return false;
      }
    } catch (error) {
      console.error("[POS Logic] Database connection check failed:", error);
      console.error("[POS Logic] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      
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

  const addToCart = (item: CartItem) => {
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

  const processOrder = async (customerName: string) => {
    if (!isOnline) {
      toast({
        title: "Cannot Process Transaction",
        description: "No internet connection available",
        variant: "destructive"
      });
      return false;
    }

    if (!connected || !primaryDb) {
      // Show more specific error message based on the error details
      let errorMsg = "No database connection available.";
      if (connectionErrorDetails.firebase && connectionErrorDetails.supabase) {
        errorMsg += " Both Firebase and Supabase connections failed. Check browser console for details.";
      } else if (connectionErrorDetails.firebase) {
        errorMsg += ` Firebase error: ${connectionErrorDetails.firebase}`;
      } else if (connectionErrorDetails.supabase) {
        errorMsg += ` Supabase error: ${connectionErrorDetails.supabase}`;
      }
      
      toast({
        title: "Cannot Process Transaction",
        description: errorMsg,
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
      setIsProcessingOrder(true);

      console.log("[POS Logic] Verifying connection before processing transaction...");
      const isConnected = await checkConnection();
      if (!isConnected) {
        console.log("[POS Logic] Connection check failed before transaction");
        toast({
          title: "Connection Lost",
          description: "Database connection was lost. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      console.log("[POS Logic] Processing transaction with:", { 
        items: cart.length,
        customerName,
        total: calculateTotal(),
        primaryDb
      });

      const result = await processTransaction(
        cart, 
        customerName, 
        calculateTotal(),
        'supabase'  // Try Supabase first
      );

      if (!result.success) {
        console.error("[POS Logic] Transaction failed:", result.error);
        throw new Error(result.error || "Transaction failed");
      }

      const transactionData = result.data;

      console.log("[POS Logic] Transaction data received:", transactionData);
      
      if (!transactionData || !transactionData.id) {
        console.error("[POS Logic] Invalid transaction data received");
        throw new Error("Invalid transaction data received");
      }

      const newTransaction = {
        id: transactionData.id,
        date: new Date(),
        customer: customerName || 'Guest',
        items: [...cart],
        total: calculateTotal()
      };

      console.log("[POS Logic] Transaction completed successfully:", newTransaction);

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
      console.error("[POS Logic] Transaction error:", error);
      console.error("[POS Logic] Error details:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : 'Unknown'
      });
      
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Could not save transaction to database",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return {
    cart,
    selectedCategory,
    setSelectedCategory,
    isOnline,
    connected,
    primaryDb,
    isCheckingConnection,
    showCheckout,
    setShowCheckout,
    showReceipt,
    setShowReceipt,
    transaction,
    connectionError,
    connectionErrorDetails,
    isProcessingOrder,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calculateTotal,
    checkConnection,
    processOrder
  };
};
