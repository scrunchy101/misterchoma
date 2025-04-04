
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PaymentProcessor } from "./payment/PaymentProcessor";
import { usePayment } from "./payment/PaymentContext";
import { CartItem } from "./cart/CartContext";
import { TransactionData } from "../billing/receiptUtils";
import { convertCartItemToMenuItemWithQuantity } from "./types";

export const POSPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  
  const { 
    cart, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotal,
    itemCount,
    connectionStatus,
    checkConnection,
  } = usePOSSystem();
  
  const {
    processPayment,
    isProcessing: loading,
    currentTransaction,
    setCurrentTransaction,
    connectionStatus: paymentConnectionStatus
  } = usePayment();
  
  const { toast } = useToast();
  const { error, handleError, clearError } = useErrorHandler();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkConnection(false);
      toast({ title: "Online", description: "Your internet connection has been restored." });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({ 
        title: "You're offline", 
        description: "Your internet connection appears to be offline.", 
        variant: "destructive" 
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast, checkConnection]);
  
  useEffect(() => {
    console.log("POS Page Debug:", { 
      connectionStatus: paymentConnectionStatus,
      cartItems: cart.length,
      hasTransaction: !!currentTransaction,
      showingReceipt: showReceipt,
      showingCheckout: showCheckout,
      networkOnline: isOnline
    });
  }, [paymentConnectionStatus, cart.length, currentTransaction, showReceipt, showCheckout, isOnline]);

  const handleCheckout = () => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Cannot proceed to checkout while offline.",
        variant: "destructive"
      });
      return;
    }
    
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
      clearError();
      console.log("Starting order process with:", { customerName, employeeId, cartItems: cart.length });
      
      if (!isOnline) {
        throw new Error("Cannot process payments while offline");
      }
      
      // Process payment with raw cart items - the processPayment function now handles the conversion
      const transaction = await processPayment(cart, customerName, "Cash", employeeId);
      
      if (transaction) {
        console.log("Transaction successful:", transaction.id);
        setShowReceipt(true);
        clearCart();
        setShowCheckout(false);
        return true;
      }
      
      console.log("Transaction failed - processPayment returned null");
      return false;
    } catch (error) {
      console.error("Error in handleProcessPayment:", error);
      handleError(error, { showToast: true, context: "Payment Processing" });
      return false;
    }
  };

  const renderContent = () => (
    <>
      <ConnectionStatus 
        isConnected={paymentConnectionStatus.connected}
        isChecking={paymentConnectionStatus.checking}
        onCheckConnection={() => paymentConnectionStatus.connected ? null : checkConnection()}
      />
      
      {error && (
        <Alert variant="destructive" className="mx-4 mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "An unknown error occurred"}
          </AlertDescription>
        </Alert>
      )}
      
      {!isOnline && (
        <Alert variant="default" className="mx-4 mt-2 bg-gray-700 border-gray-600">
          <WifiOff className="h-4 w-4 text-gray-400" />
          <AlertTitle className="text-gray-300">Offline Mode</AlertTitle>
          <AlertDescription className="text-gray-400">
            You are currently offline. Some features may be limited.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex-1 flex overflow-hidden">
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
      
      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onConfirm={handleProcessPayment}
        total={getTotal()}
        isConnected={paymentConnectionStatus.connected && isOnline}
        onCheckConnection={checkConnection}
        isProcessing={loading}
      />
      
      {currentTransaction && (
        <ReceiptModal
          open={showReceipt}
          onClose={() => {
            setShowReceipt(false);
            setCurrentTransaction(null);
          }}
          transaction={currentTransaction as any}
        />
      )}
    </>
  );

  return (
    <PaymentProcessor>
      <div className="flex h-screen bg-gray-800 text-white">
        <Sidebar activeTab="pos" setActiveTab={() => {}} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Point of Sale" />
          
          <ErrorBoundary fallback={
            <div className="p-8 text-center">
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
              <p className="text-gray-400 mb-6">There was an error loading the POS system.</p>
              <Button onClick={() => window.location.reload()}>
                Refresh Application
              </Button>
            </div>
          }>
            {renderContent()}
          </ErrorBoundary>
        </div>
      </div>
    </PaymentProcessor>
  );
};
