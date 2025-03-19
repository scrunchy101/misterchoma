
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
import { useToast } from "@/hooks/use-toast";

export const POSPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  
  const { 
    cart, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getTotal, 
    processOrder,
    loading,
    connectionStatus,
    checkConnection,
    currentTransaction,
    setCurrentTransaction
  } = usePOSSystem();
  
  const { toast } = useToast();
  
  // Initialize
  useEffect(() => {
    // Explicitly ignoring the boolean return since we only care about the side effect
    checkConnection().then(() => {
      // Connection status is already updated in the hook
    });
  }, []);
  
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout",
        variant: "destructive"
      });
      return;
    }
    
    setShowCheckout(true);
  };
  
  const handleOrderConfirm = async (customerName: string, employeeId: string) => {
    const transaction = await processOrder(customerName, employeeId);
    
    if (transaction) {
      setShowCheckout(false);
      clearCart();
      setShowReceipt(true);
    }
  };
  
  const handleCloseReceipt = () => {
    setShowReceipt(false);
    setCurrentTransaction(null);
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
          onConfirm={handleOrderConfirm}
          total={getTotal()}
          isConnected={connectionStatus.connected}
          onCheckConnection={checkConnection}
          isProcessing={loading}
        />
        
        <ReceiptModal
          open={showReceipt}
          onClose={handleCloseReceipt}
          transaction={currentTransaction}
        />
      </div>
    </div>
  );
};
