
import React from "react";
import { Trash, Minus, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
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
    <Card className="bg-gray-800 p-3 mb-3 border-gray-700">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-medium">{name}</h3>
          <p className="text-gray-400 text-sm">{formatCurrency(price)}</p>
        </div>
        <div className="flex items-center space-x-1">
          <button 
            className="p-1 rounded-full hover:bg-gray-700"
            onClick={() => handleQuantityChange(quantity - 1)}
          >
            <Minus size={16} />
          </button>
          <span className="mx-2">{quantity}</span>
          <button 
            className="p-1 rounded-full hover:bg-gray-700"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus size={16} />
          </button>
        </div>
        <button 
          className="ml-2 p-1 rounded-full hover:bg-gray-700 text-red-400"
          onClick={() => removeItemFromCart(id)}
        >
          <Trash size={16} />
        </button>
      </div>
      <div className="flex justify-end mt-2">
        <span className="font-medium">{formatCurrency(price * quantity)}</span>
      </div>
    </Card>
  );
};
