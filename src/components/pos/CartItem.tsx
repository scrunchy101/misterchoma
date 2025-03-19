
import React from "react";
import { Trash, Minus, Plus } from "lucide-react";
import { usePOSContext } from "@/components/pos/POSContext";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const CartItem = ({ id, name, price, quantity }: CartItemProps) => {
  const { updateItemQuantity, removeItemFromCart, formatCurrency } = usePOSContext();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateItemQuantity(id, newQuantity);
    }
  };

  return (
    <div className="border-b border-gray-200 py-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium text-gray-800">{name}</h3>
          <p className="text-gray-500 text-sm">{formatCurrency(price)}</p>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => handleQuantityChange(quantity - 1)}
          >
            <Minus size={16} className="text-gray-500" />
          </button>
          <span className="mx-2 text-gray-800">{quantity}</span>
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus size={16} className="text-gray-500" />
          </button>
        </div>
        <button 
          className="ml-2 p-1 rounded-full hover:bg-gray-100 text-red-400"
          onClick={() => removeItemFromCart(id)}
        >
          <Trash size={16} />
        </button>
      </div>
      <div className="flex justify-end mt-1">
        <span className="font-medium text-gray-800">{formatCurrency(price * quantity)}</span>
      </div>
    </div>
  );
};
