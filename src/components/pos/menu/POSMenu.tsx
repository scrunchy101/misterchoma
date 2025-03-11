
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { MenuItem } from "@/components/pos/types";
import { MenuItemCard } from "@/components/pos/menu/MenuItemCard";
import { useToast } from "@/hooks/use-toast";

interface POSMenuProps {
  categories: string[];
  sampleProducts: MenuItem[];
}

export const POSMenu = ({ categories, sampleProducts }: POSMenuProps) => {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || "");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Fetch menu items when active category changes or search query updates
  useEffect(() => {
    const fetchMenuItems = async () => {
      setIsLoading(true);
      
      try {
        // For demo purposes, using sample products
        await new Promise(resolve => setTimeout(resolve, 300));
        
        let filteredItems = sampleProducts;
        
        if (searchQuery) {
          filteredItems = sampleProducts.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        } else if (activeCategory) {
          filteredItems = sampleProducts.filter(item => 
            item.category === activeCategory
          );
        }
        
        setMenuItems(filteredItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeCategory, searchQuery, sampleProducts, toast]);

  return (
    <div className="flex flex-col bg-white rounded-lg shadow p-4 h-full">
      {/* Search Bar */}
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-gray-200"
        />
      </div>
      
      {/* Category Tabs */}
      <Tabs 
        value={activeCategory} 
        onValueChange={setActiveCategory} 
        className="flex-1 flex flex-col"
      >
        <TabsList className="bg-gray-100 mb-4 h-auto flex flex-wrap justify-start overflow-x-auto">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="mr-2 mb-1 whitespace-nowrap"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeCategory} className="flex-1 overflow-y-auto mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
              <p className="ml-2 text-gray-600">Loading menu items...</p>
            </div>
          ) : menuItems.length === 0 ? (
            <div className="text-center py-10 text-gray-600">
              <p>No menu items available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
