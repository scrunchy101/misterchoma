
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenuItems } from "@/hooks/useMenuItems";
import { MenuItem } from "./SimplePOSPage";

interface SimpleMenuProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  onAddToCart: (item: MenuItem) => void;
}

export const SimpleMenu: React.FC<SimpleMenuProps> = ({
  selectedCategory,
  onSelectCategory,
  onAddToCart
}) => {
  const { data: menuItems = [], isLoading } = useMenuItems(selectedCategory || undefined);
  
  // Extract unique categories
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    if (menuItems) {
      menuItems.forEach(item => {
        if (item.category) uniqueCategories.add(item.category);
      });
    }
    return Array.from(uniqueCategories);
  }, [menuItems]);

  return (
    <div className="flex flex-col h-full">
      {/* Categories */}
      <div className="flex overflow-x-auto p-2 bg-gray-800 border-b border-gray-700">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          className="mx-1 whitespace-nowrap"
          onClick={() => onSelectCategory(null)}
        >
          All Items
        </Button>
        
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            className="mx-1 whitespace-nowrap"
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="bg-gray-800 border-gray-700 p-4 h-40">
                <Skeleton className="h-6 w-3/4 mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-1/2 mb-4 bg-gray-700" />
                <div className="mt-auto">
                  <Skeleton className="h-10 w-full bg-gray-700" />
                </div>
              </Card>
            ))}
          </div>
        ) : menuItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">No items available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {menuItems.map(item => (
              <Card 
                key={item.id} 
                className="bg-gray-800 border-gray-700 p-4 h-40 flex flex-col hover:bg-gray-700 transition cursor-pointer"
                onClick={() => onAddToCart(item)}
              >
                <h3 className="font-bold truncate">{item.name}</h3>
                <p className="text-sm text-gray-400 truncate">{item.category}</p>
                <p className="mt-1 font-semibold text-green-400">TZS {item.price.toLocaleString()}</p>
                <div className="mt-auto">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Add to Order
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
