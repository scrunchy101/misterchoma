
import React from "react";
import { ShoppingCart } from "lucide-react";

export const EmptyCart = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
      <div className="mb-4 p-4 rounded-full bg-gray-100">
        <ShoppingCart size={48} className="opacity-50" />
      </div>
      <p className="mb-2 text-gray-500">No items added</p>
      <p className="text-sm text-center text-gray-400">Add items from the menu to create an order</p>
    </div>
  );
};
