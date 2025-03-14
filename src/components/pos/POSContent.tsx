
import React, { useState } from "react";
import { CategorySelector } from "./CategorySelector";
import { POSItemGrid } from "./POSItemGrid";
import { POSCart } from "./POSCart";
import { POSCheckout } from "./POSCheckout";
import { ReceiptViewer } from "../billing/ReceiptViewer";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useCart } from "./CartManager";
import { usePayment } from "./PaymentProcessor";
import { useToast } from "@/hooks/use-toast";
import { MenuItemWithQuantity } from "./types";
import { GlobalErrorListener } from "../layout/GlobalErrorListener";

export const POSContent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  
  const { data: menuItems, isLoading, error } = useMenuItems();
  const { cart, addToCart, updateCartItemQuantity, removeFromCart, clearCart, calculateTotal } = useCart();
  const { processPayment, currentTransaction, setCurrentTransaction } = usePayment();
  const { toast } = useToast();

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

  const handleProcessPayment = async (customerName: string, paymentMethod: string) => {
    try {
      console.log("Starting payment process with:", { customerName, paymentMethod, cartItems: cart.length });
      const transaction = await processPayment(cart, customerName, paymentMethod);
      
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
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <main className="flex-1 overflow-hidden bg-gray-800 flex">
      <GlobalErrorListener />
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
