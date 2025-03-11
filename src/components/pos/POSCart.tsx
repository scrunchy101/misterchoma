
import React, { useState } from "react";
import { CartItem } from "@/components/pos/CartItem";
import { CheckoutDialog } from "@/components/pos/checkout/CheckoutDialog";
import { EmptyCart } from "@/components/pos/EmptyCart";
import { CartSummary } from "@/components/pos/CartSummary";
import { usePOSContext } from "@/components/pos/POSContext";

interface POSCartProps {
  orderType: 'delivery' | 'dine-in' | 'pickup';
  customerName: string;
}

export const POSCart = ({ orderType, customerName }: POSCartProps) => {
  const { cartItems } = usePOSContext();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  // Add console log to debug cart items
  console.log("Cart Items:", cartItems);
  
  return (
    <div className="flex-1 flex flex-col">
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
