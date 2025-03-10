
import React from "react";
import { ShoppingCart } from "lucide-react";

export const EmptyCart = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
      <div className="mb-4 p-4 rounded-full bg-gray-800">
        <ShoppingCart size={48} className="opacity-50" />
      </div>
      <p className="mb-2">Your cart is empty</p>
      <p className="text-sm text-center">Add items from the menu to create an order</p>
    </div>
  );
};
