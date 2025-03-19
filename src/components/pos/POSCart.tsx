
import React, { useState } from "react";
import { CartItem } from "@/components/pos/CartItem";
import { CheckoutDialog } from "@/components/pos/CheckoutDialog";
import { EmptyCart } from "@/components/pos/EmptyCart";
import { CartSummary } from "@/components/pos/CartSummary";
import { usePOSContext } from "@/components/pos/POSContext";
import { Tag, Heart, Percent, Package } from "lucide-react";

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
          
          <div className="mt-auto">
            {/* Action Buttons Row */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <button className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded">
                <Tag className="h-5 w-5 mb-1" />
                <span className="text-xs">Promo</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded">
                <Percent className="h-5 w-5 mb-1" />
                <span className="text-xs">Discount</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded">
                <Heart className="h-5 w-5 mb-1" />
                <span className="text-xs">Tips</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 border border-gray-200 rounded">
                <Package className="h-5 w-5 mb-1" />
                <span className="text-xs">Points</span>
              </button>
            </div>
            
            {/* Skip Kitchen Checkbox */}
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded mb-4">
              <span>Skip Kitchen</span>
              <input type="checkbox" className="h-5 w-5" />
            </div>
            
            {/* Kitchen and Pay Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-yellow-200 text-yellow-800 py-3 rounded font-medium">
                Kitchen
              </button>
              <button 
                className="bg-green-400 text-white py-3 rounded font-medium"
                onClick={() => setIsCheckoutOpen(true)}
              >
                Proceed to pay
              </button>
            </div>
            
            <CheckoutDialog 
              isOpen={isCheckoutOpen} 
              onOpenChange={setIsCheckoutOpen} 
            />
          </div>
        </>
      ) : (
        <EmptyCart />
      )}
    </div>
  );
};
