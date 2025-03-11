
import React, { useState } from "react";
import { CartItem } from "@/components/pos/CartItem";
import { CheckoutDialog } from "@/components/pos/CheckoutDialog";
import { EmptyCart } from "@/components/pos/EmptyCart";
import { CartSummary } from "@/components/pos/CartSummary";
import { usePOSContext } from "@/components/pos/POSContext";

export const POSCart = () => {
  const { cartItems } = usePOSContext();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Add console log to debug cart items
  console.log("Cart Items:", cartItems);
  
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Current Order</h2>
      
      {cartItems && cartItems.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto mb-4">
            {cartItems.map((item) => (
              <CartItem 
                key={`${item.id}-${item.quantity}`}
                id={item.id}
                name={item.name}
                price={item.price}
                quantity={item.quantity}
              />
            ))}
          </div>
          
          <CartSummary onCheckout={() => setIsCheckoutOpen(true)} />
          
          <CheckoutDialog 
            isOpen={isCheckoutOpen} 
            onOpenChange={setIsCheckoutOpen} 
          />
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};
