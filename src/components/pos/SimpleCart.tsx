
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus, ShoppingCart } from "lucide-react";
import { CartItem } from "./SimplePOSPage";

interface SimpleCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  total: number;
}

export const SimpleCart: React.FC<SimpleCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  total
}) => {
  if (items.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">Current Order</h2>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <ShoppingCart className="h-12 w-12 text-gray-500 mb-2" />
          <p className="text-gray-400 text-center">Your cart is empty</p>
          <p className="text-gray-500 text-sm text-center mt-1">
            Add items from the menu to create an order
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">Current Order</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearCart}
          className="text-gray-400 hover:text-white"
        >
          Clear All
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {items.map(item => (
          <div key={item.id} className="p-4 border-b border-gray-700 flex flex-col">
            <div className="flex justify-between">
              <span className="font-medium">{item.name}</span>
              <button 
                onClick={() => onRemoveItem(item.id)} 
                className="text-gray-400 hover:text-red-500"
              >
                <Trash size={16} />
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center">
                <button 
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  <Minus size={14} />
                </button>
                <span className="mx-3">{item.quantity}</span>
                <button 
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="text-green-400">TZS {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-700 mt-auto">
        <div className="flex justify-between mb-4">
          <span className="font-bold">Total</span>
          <span className="font-bold text-green-400">TZS {total.toLocaleString()}</span>
        </div>
        <Button 
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={onCheckout}
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};
