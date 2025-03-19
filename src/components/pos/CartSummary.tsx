
import React from "react";
import { Button } from "@/components/ui/button";
import { usePOSContext } from "@/components/pos/POSContext";

interface CartSummaryProps {
  onCheckout: () => void;
}

export const CartSummary = ({ onCheckout }: CartSummaryProps) => {
  const { cartTotal, clearCart, formatCurrency } = usePOSContext();

  return (
    <div className="border-t border-gray-200 pt-4 mt-auto">
      <div className="flex justify-between text-gray-600 mb-2">
        <span>Subtotal:</span>
        <span>{formatCurrency(cartTotal)}</span>
      </div>
      <div className="flex justify-between font-bold text-xl mb-4">
        <span>Total:</span>
        <span>{formatCurrency(cartTotal)}</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Button 
          variant="outline" 
          className="border-gray-200 hover:bg-gray-100 text-gray-800"
          onClick={clearCart}
        >
          Clear
        </Button>
        <Button 
          className="bg-green-500 hover:bg-green-600"
          onClick={onCheckout}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};
