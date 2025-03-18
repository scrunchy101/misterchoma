
import React, { useState, useEffect } from "react";
import { CategorySelector } from "./CategorySelector";
import { POSItemGrid } from "./POSItemGrid";
import { POSCart } from "./POSCart";
import { POSCheckout } from "./POSCheckout";
import { ReceiptViewer } from "../billing/ReceiptViewer";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useCart } from "./cart/CartContext";
import { usePayment } from "./payment/PaymentContext";
import { useToast } from "@/hooks/use-toast";
import { MenuItemWithQuantity } from "./types";
import { GlobalErrorListener } from "../layout/GlobalErrorListener";
import { Button } from "@/components/ui/button";
import { Wifi, WifiOff } from "lucide-react";

export const POSContent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  
  const { data: menuItems, isLoading, error } = useMenuItems();
  const { items: cart, addItem: addToCart, updateItemQuantity: updateCartItemQuantity, removeItem: removeFromCart, clearCart, getTotal: calculateTotal } = useCart();
  const { processPayment, currentTransaction, setCurrentTransaction, connectionStatus, checkConnection } = usePayment();
  const { toast } = useToast();

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  // Filter items by category if a category is selected
  const filteredItems = selectedCategory 
    ? menuItems?.filter(item => item.category === selectedCategory) 
    : menuItems;
  
  // Get unique categories from menu items
  const categories = Array.from(new Set(menuItems?.map(item => item.category) || []));

  // Convert MenuItem to MenuItemWithQuantity by adding quantity property
  const menuItemsWithQuantity: MenuItemWithQuantity[] = (filteredItems || []).map(item => ({
    ...item,
    quantity: 0
  }));

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
      console.log("Starting order process with:", { customerName, employeeId, cartItems: cart.length });
      // Always use Cash as payment method
      const transaction = await processPayment(cart, customerName, "Cash", employeeId);
      
      if (transaction) {
        console.log("Transaction successful:", transaction.id);
        // Show receipt
        setShowReceipt(true);
        
        // Clear cart and close checkout
        clearCart();
        setShowCheckout(false);
        return true;
      }
      
      console.log("Transaction failed - processPayment returned null");
      return false;
    } catch (error) {
      console.error("Error in handleProcessPayment:", error);
      toast({
        title: "Order Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <main className="flex-1 overflow-hidden bg-gray-800 flex flex-col">
      <GlobalErrorListener />
      
      {/* Connection Status Bar */}
      <div className={`px-4 py-2 flex items-center justify-between ${
        connectionStatus.connected ? 'bg-green-900/20' : 'bg-red-900/20'
      }`}>
        <div className="flex items-center gap-2">
          {connectionStatus.connected ? (
            <>
              <Wifi size={16} className="text-green-400" />
              <span className="text-green-400 text-sm">Connected to database</span>
            </>
          ) : (
            <>
              <WifiOff size={16} className="text-red-400" />
              <span className="text-red-400 text-sm">Not connected to database</span>
            </>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => checkConnection()}
          className="h-7 text-xs"
        >
          Check Connection
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left side - Menu Items */}
        <div className="w-2/3 flex flex-col overflow-hidden">
          <CategorySelector 
            categories={categories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
          <div className="flex-1 overflow-y-auto p-4">
            <POSItemGrid 
              items={menuItemsWithQuantity} 
              onAddItem={addToCart} 
              isLoading={isLoading}
            />
          </div>
        </div>
        
        {/* Right side - Cart */}
        <div className="w-1/3 border-l border-gray-700 flex flex-col">
          <POSCart 
            items={cart}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onCheckout={handleCheckout}
            total={calculateTotal()}
          />
        </div>
      </div>
      
      {/* Checkout Modal */}
      {showCheckout && (
        <POSCheckout 
          total={calculateTotal()} 
          onClose={() => setShowCheckout(false)}
          onProcessPayment={handleProcessPayment}
        />
      )}
      
      {/* Receipt Viewer */}
      {showReceipt && currentTransaction && (
        <ReceiptViewer 
          isOpen={showReceipt}
          onClose={() => setShowReceipt(false)}
          transactionData={currentTransaction}
        />
      )}
    </main>
  );
};
