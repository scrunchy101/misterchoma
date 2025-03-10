
import React from "react";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderItemsListProps {
  items: OrderItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  calculateTotal: () => number;
}

export const OrderItemsList = ({ 
  items, 
  onUpdateQuantity, 
  calculateTotal 
}: OrderItemsListProps) => {
  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <h3 className="text-lg font-medium mb-2">Selected Items</h3>
      {items.length > 0 ? (
        <div className="space-y-2 max-h-[200px] overflow-y-auto">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-gray-400">${item.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center">
                <button
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="mx-2">{item.quantity}</span>
                <button
                  className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded" 
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div className="ml-4 font-medium">${(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-400 text-center py-4">
          No items selected. Go to the Menu Items tab to add items.
        </div>
      )}
      
      <div className="flex justify-end mt-4 text-lg font-bold">
        Total: ${calculateTotal().toFixed(2)}
      </div>
    </div>
  );
};
