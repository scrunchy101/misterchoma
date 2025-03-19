
import React, { useState } from "react";
import { useMenuItems } from "@/hooks/useMenuItems";
import { MenuItem } from "@/hooks/usePOSSystem";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MenuGridProps {
  selectedCategory: string | null;
  onAddItem: (item: MenuItem) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  selectedCategory,
  onAddItem
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: menuItems = [], isLoading, isError } = useMenuItems();
  
  // Filter items by category and search term
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-gray-400">Loading menu items...</div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-xl text-red-400">Error loading menu items.</div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search menu items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-700 border-gray-600 text-white"
        />
      </div>
      
      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-400">
            No items found
          </div>
        ) : (
          filteredItems.map(item => (
            <div 
              key={item.id} 
              className="bg-gray-700 rounded-lg p-3 flex flex-col hover:bg-gray-600 transition-colors cursor-pointer"
              onClick={() => onAddItem(item)}
            >
              <div className="font-medium">{item.name}</div>
              <div className="text-sm text-gray-400 truncate">{item.description || 'No description'}</div>
              <div className="mt-auto pt-2 flex justify-between items-center">
                <span className="text-green-400 font-medium">TZS {item.price.toLocaleString()}</span>
                <Button size="sm" variant="outline" className="text-xs h-7">Add</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
