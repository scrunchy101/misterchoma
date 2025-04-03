
import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CategoryFilter } from "./menu/CategoryFilter";
import { MenuGrid } from "./menu/MenuGrid";
import { Cart } from "./cart/Cart";
import { CheckoutModal } from "./checkout/CheckoutModal";
import { ReceiptModal } from "./receipt/ReceiptModal";
import { ConnectionStatus } from "./ConnectionStatus";
import { usePOSSystem } from "@/hooks/usePOSSystem";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const POSPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const { 
    // Cart operations
    cart, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotal,
    itemCount,
    
    // Order processing
    processOrder,
    loading,
    currentTransaction,
    setCurrentTransaction,
    
    // Connection status
    connectionStatus,
    checkConnection,
  } = usePOSSystem();
  
  const { toast } = useToast();
  
  // Debug logging
  useEffect(() => {
    console.log("POS Page Debug:", { 
      connectionStatus,
      cartItems: cart.length,
      hasTransaction: !!currentTransaction,
      showingReceipt: showReceipt,
      showingCheckout: showCheckout
    });
  }, [connectionStatus, cart.length, currentTransaction, showReceipt, showCheckout]);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }
    
    setShowCheckout(true);
  };

  const handleProcessPayment = async (customerName: string, employeeId?: string) => {
    try {
      setError(null);
      console.log("Starting order process with:", { customerName, employeeId, cartItems: cart.length });
      
      // Process the order
      const transaction = await processOrder(customerName, employeeId);
      
      if (transaction) {
        console.log("Transaction successful:", transaction.id);
        // Show receipt
        setShowReceipt(true);
        
        // Clear cart and close checkout
        clearCart();
        setShowCheckout(false);
        return true;
      }
      
      console.log("Transaction failed - processOrder returned null");
      return false;
    } catch (error) {
      console.error("Error in handleProcessPayment:", error);
      const errorObj = error instanceof Error ? error : new Error(String(error));
      setError(errorObj);
      
      toast({
        title: "Order Error",
        description: errorObj.message || "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <Sidebar activeTab="pos" setActiveTab={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Point of Sale" />
        
        <ConnectionStatus 
          isConnected={connectionStatus.connected}
          isChecking={connectionStatus.checking}
          onCheckConnection={checkConnection}
        />
        
        {error && (
          <Alert variant="destructive" className="mx-4 mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error.message}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex-1 flex overflow-hidden">
          {/* Menu Section */}
          <div className="w-2/3 flex flex-col overflow-hidden">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            
            <div className="flex-1 overflow-y-auto">
              <MenuGrid
                selectedCategory={selectedCategory}
                onAddItem={addToCart}
              />
            </div>
          </div>
          
          {/* Cart Section */}
          <div className="w-1/3 border-l border-gray-700 flex flex-col">
            <Cart
              items={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={handleCheckout}
              total={getTotal()}
            />
          </div>
        </div>
        
        {/* Modals */}
        <CheckoutModal
          open={showCheckout}
          onClose={() => setShowCheckout(false)}
          onConfirm={handleProcessPayment}
          total={getTotal()}
          isConnected={connectionStatus.connected}
          onCheckConnection={checkConnection}
          isProcessing={loading}
        />
        
        <ReceiptModal
          open={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setCurrentTransaction(null);
          }}
          transaction={currentTransaction}
        />
      </div>
    </div>
  );
};
