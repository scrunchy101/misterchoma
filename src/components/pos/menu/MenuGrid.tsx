
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useMenuItems } from "@/hooks/useMenuItems";
import { MenuItem } from "@/hooks/useMenuItems";

interface MenuGridProps {
  selectedCategory: string | null;
  onAddItem: (item: MenuItem) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  selectedCategory,
  onAddItem
}) => {
  const { data: menuItems = [], isLoading, error } = useMenuItems();
  
  // Filter by category if selected
  const filteredItems = React.useMemo(() => {
    if (!selectedCategory) return menuItems;
    return menuItems.filter(item => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="h-40 bg-gray-800 animate-pulse"></Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400">Failed to load menu items</p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">No items found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {filteredItems.map(item => (
        <Card 
          key={item.id} 
          className="overflow-hidden cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => onAddItem(item)}
        >
          <CardContent className="p-0">
            <div className="aspect-square bg-gray-600 flex items-center justify-center">
              {item.image_url ? (
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl">{item.emoji || '🍽️'}</span>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-white">{item.name}</h3>
              <div className="flex justify-between items-center mt-1">
                <span className="text-green-400">${item.price.toFixed(2)}</span>
                <span className="text-xs text-gray-400">{item.category}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
