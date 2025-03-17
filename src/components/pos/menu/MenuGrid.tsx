
import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenu } from "./MenuContext";
import { useCart, MenuItem } from "../cart/CartContext";
import { CircleDollarSign } from "lucide-react";

interface MenuGridProps {
  selectedCategory: string | null;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ selectedCategory }) => {
  const { items, isLoading, error } = useMenu();
  const { addItem } = useCart();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="bg-gray-700 p-4 h-40 flex flex-col border-gray-600">
            <Skeleton className="h-5 w-3/4 mb-2 bg-gray-600" />
            <Skeleton className="h-4 w-1/2 mb-2 bg-gray-600" />
            <Skeleton className="h-4 w-1/3 mb-4 bg-gray-600" />
            <div className="mt-auto">
              <Skeleton className="h-8 w-full bg-gray-600" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error loading menu items</div>
          <div className="text-gray-400">{error.message}</div>
        </div>
      </div>
    );
  }
  
  // Filter items by selected category if needed
  const filteredItems = selectedCategory 
    ? items.filter(item => item.category === selectedCategory)
    : items;
  
  if (filteredItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="text-center text-gray-400">
          {selectedCategory 
            ? "No items available in this category" 
            : "No menu items available"}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {filteredItems.map(item => (
        <Card 
          key={item.id} 
          className="bg-gray-700 hover:bg-gray-600 transition cursor-pointer p-4 h-40 flex flex-col text-white border-gray-600"
          onClick={() => addItem(item)}
        >
          <h3 className="font-bold truncate">{item.name}</h3>
          <p className="text-sm text-gray-300 truncate">{item.category}</p>
          <div className="mt-1 font-semibold text-green-400 flex items-center">
            <CircleDollarSign className="h-4 w-4 mr-1" />
            <span>TZS {item.price.toLocaleString()}</span>
          </div>
          
          <div className="mt-auto">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center">
              <span>Add to Order</span>
            </button>
          </div>
        </Card>
      ))}
    </div>
  );
};
