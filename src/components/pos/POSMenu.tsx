
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePOSContext } from "@/components/pos/POSContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  category: string;
  image_url?: string;
}

interface POSMenuProps {
  categories: string[];
  isLoading: boolean;
}

export const POSMenu = ({ categories, isLoading }: POSMenuProps) => {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { addItemToCart, formatCurrency } = usePOSContext();
  const { toast } = useToast();

  // Set active category when categories are loaded
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Fetch menu items when active category changes
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!activeCategory) return;
      
      try {
        setIsMenuLoading(true);
        
        let query = supabase
          .from('menu_items')
          .select('*')
          .eq('available', true);
        
        if (activeCategory !== "All") {
          query = query.eq('category', activeCategory);
        }
        
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
        
        const { data, error } = await query;
          
        if (error) throw error;
        
        setMenuItems(data || []);
      } catch (error) {
        console.error('Error fetching menu items:', error);
        toast({
          title: "Error",
          description: "Failed to load menu items",
          variant: "destructive"
        });
      } finally {
        setIsMenuLoading(false);
      }
    };

    fetchMenuItems();
  }, [activeCategory, searchQuery, toast]);

  const handleAddToCart = (item: MenuItem) => {
    console.log("Adding to cart:", item);
    addItemToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
    
    toast({
      title: "Added to order",
      description: `${item.name} added to your order`
    });
  };

  const filteredCategories = ["All", ...categories];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
      
      <Tabs 
        value={activeCategory} 
        onValueChange={setActiveCategory} 
        className="flex-1 flex flex-col"
      >
        <TabsList className="bg-gray-700 mb-4 h-auto flex flex-wrap">
          {filteredCategories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="flex-grow"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {filteredCategories.map((category) => (
          <TabsContent 
            key={category} 
            value={category} 
            className="flex-1 overflow-y-auto mt-0"
          >
            {isLoading || isMenuLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="ml-2 text-gray-400">Loading menu items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p>No menu items available in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <Card 
                    key={item.id}
                    className="bg-gray-700 hover:bg-gray-600 transition-colors p-4 cursor-pointer"
                    onClick={() => handleAddToCart(item)}
                  >
                    <div>
                      <h3 className="font-medium text-white">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{item.description}</p>
                      )}
                      <p className="mt-2 font-bold text-blue-400">{formatCurrency(item.price)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
