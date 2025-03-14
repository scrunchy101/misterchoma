
import React from "react";
import { MenuItemWithQuantity } from "./types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface POSItemGridProps {
  items: MenuItemWithQuantity[];
  onAddItem: (item: MenuItemWithQuantity) => void;
  isLoading: boolean;
}

export const POSItemGrid: React.FC<POSItemGridProps> = ({ 
  items, 
  onAddItem,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4 h-40 flex flex-col">
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3 mb-4" />
            <div className="mt-auto">
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">No items available in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(item => (
        <Card 
          key={item.id} 
          className="bg-gray-700 hover:bg-gray-600 transition cursor-pointer p-4 h-40 flex flex-col text-white border-gray-600"
          onClick={() => onAddItem(item)}
        >
          <h3 className="font-bold truncate">{item.name}</h3>
          <p className="text-sm text-gray-300 truncate">{item.category}</p>
          <p className="mt-1 font-semibold text-green-400">TZS {item.price.toLocaleString()}</p>
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
