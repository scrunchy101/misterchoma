
import React from "react";
import { useMenuItems } from "@/hooks/useMenuItems";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface OrderMenuItemsProps {
  onSelectItem: (itemId: string, itemName: string, itemPrice: number) => void;
}

export const OrderMenuItems = ({ onSelectItem }: OrderMenuItemsProps) => {
  const { data: menuItems, isLoading, error } = useMenuItems();
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-red-500 py-4 text-center">
        Error loading menu items. Please try again.
      </div>
    );
  }

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="text-gray-400 py-4 text-center">
        No menu items available. Please add some items to the menu first.
      </div>
    );
  }

  // Group items by category
  const categories = [...new Set(menuItems.map(item => item.category))];
  
  return (
    <div className="max-h-[400px] overflow-y-auto">
      <Tabs defaultValue={categories[0]}>
        <TabsList className="bg-gray-700 mb-4 overflow-x-auto flex w-full justify-start">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="text-sm">
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {menuItems
                .filter(item => item.category === category)
                .map(item => (
                  <Card 
                    key={item.id} 
                    className="bg-gray-700 border-gray-600 p-3 flex justify-between items-center hover:border-green-500 transition cursor-pointer"
                    onClick={() => onSelectItem(item.id, item.name, item.price)}
                  >
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-green-400">${item.price.toFixed(2)}</p>
                    </div>
                    <button className="p-1 bg-green-600 rounded-full hover:bg-green-700 transition">
                      <Plus size={18} />
                    </button>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
