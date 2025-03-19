
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMenu } from "@/hooks/useMenuItems";
import { CircleDollarSign, Plus } from "lucide-react";
import { MenuItem } from "@/hooks/usePOSSystem";

interface MenuGridProps {
  selectedCategory: string | null;
  onAddItem: (item: MenuItem) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  selectedCategory,
  onAddItem
}) => {
  const { data: menuItems = [], isLoading, error } = useMenu();
  
  // Filter by category if selected
  const filteredItems = React.useMemo(() => {
    if (!selectedCategory) return menuItems;
    return menuItems.filter(item => item.category === selectedCategory);
  }, [menuItems, selectedCategory]);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-2/3 mb-2 bg-gray-600" />
              <Skeleton className="h-3 w-1/2 mb-4 bg-gray-600" />
              <Skeleton className="h-8 w-full bg-gray-600" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-400">
          <p>Failed to load menu items</p>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }
  
  if (filteredItems.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-400">
          {selectedCategory 
            ? `No items found in ${selectedCategory} category` 
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
          className="bg-gray-700 border-gray-600 transition-colors hover:bg-gray-650"
        >
          <CardContent className="p-4">
            <h3 className="font-medium text-white">{item.name}</h3>
            <div className="flex items-center text-green-400 my-2">
              <CircleDollarSign size={16} className="mr-1" />
              <span>TZS {item.price.toLocaleString()}</span>
            </div>
            <Button 
              className="w-full mt-2 flex items-center justify-center"
              size="sm"
              onClick={() => onAddItem(item)}
            >
              <Plus size={16} className="mr-1" />
              Add to Order
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
