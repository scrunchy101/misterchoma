
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { POSCheckout } from "./POSCheckout";
import { POSItemGrid } from "./POSItemGrid";
import { POSCart } from "./POSCart";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MenuItemWithQuantity } from "./types";
import { ReceiptViewer } from "../billing/ReceiptViewer";
import { TransactionData } from "../billing/receiptUtils";

export const POSPage = () => {
  const [activeTab, setActiveTab] = useState("pos");
  const [cart, setCart] = useState<MenuItemWithQuantity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<TransactionData | null>(null);
  const { data: menuItems, isLoading, error } = useMenuItems();
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

  const addToCart = (item: MenuItemWithQuantity) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item exists in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // Add new item to cart with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Item added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

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

  const processPayment = async (customerName: string, paymentMethod: string) => {
    try {
      // Calculate cart total
      const total = calculateTotal();
      
      // Create new order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{
          customer_name: customerName,
          payment_method: paymentMethod,
          payment_status: 'completed',
          total_amount: total,
          status: 'completed'
        }])
        .select();
      
      if (orderError) throw orderError;
      
      if (!orderData || orderData.length === 0) {
        throw new Error("Failed to create order");
      }
      
      const orderId = orderData[0].id;
      
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
      
      // Prepare transaction data for receipt
      const transactionData: TransactionData = {
        id: orderId,
        date: new Date(),
        customer: customerName || "Guest",
        items: cart.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        paymentMethod: paymentMethod,
        total: total
      };
      
      // Show success notification
      toast({
        title: "Payment successful",
        description: `Total amount: TZS ${total.toLocaleString()}`,
      });
      
      // Set current transaction and show receipt
      setCurrentTransaction(transactionData);
      setShowReceipt(true);
      
      // Clear cart and close checkout
      clearCart();
      setShowCheckout(false);
      
      return true;
    } catch (error) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment.",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Point of Sale" />
        <main className="flex-1 overflow-hidden bg-gray-800 flex">
          {/* Left side - Menu Items */}
          <div className="w-2/3 flex flex-col overflow-hidden">
            <div className="flex overflow-x-auto p-2 bg-gray-700">
              <button
                className={`px-4 py-2 mx-1 rounded whitespace-nowrap ${selectedCategory === null ? 'bg-blue-600' : 'bg-gray-600'}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 mx-1 rounded whitespace-nowrap ${selectedCategory === category ? 'bg-blue-600' : 'bg-gray-600'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
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
        </main>
      </div>
      
      {/* Checkout Modal */}
      {showCheckout && (
        <POSCheckout 
          total={calculateTotal()} 
          onClose={() => setShowCheckout(false)}
          onProcessPayment={processPayment}
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
    </div>
  );
};
