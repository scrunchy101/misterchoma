import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePOSContext } from "@/components/pos/POSContext";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
  available: boolean;
}

interface POSMenuProps {
  categories: string[];
  isLoading: boolean;
}

export const POSMenu = ({ categories, isLoading }: POSMenuProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const { toast } = useToast();
  const { addItemToCart, formatCurrency } = usePOSContext();

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!activeCategory) return;
      
      try {
        setIsMenuLoading(true);
        
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('category', activeCategory)
          .eq('available', true)
          .order('name');
          
        if (error) throw error;
        
        setMenuItems(data);
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
  }, [activeCategory, toast]);

  const filteredMenuItems = searchTerm 
    ? menuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : menuItems;

  const handleAddToCart = (item: MenuItem) => {
    addItemToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
    
    toast({
      title: "Added to order",
      description: `${item.name} added to the current order`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search menu items..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="text-white border-gray-600 bg-gray-700 hover:bg-gray-600">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      {categories.length > 0 ? (
        <Tabs defaultValue={categories[0]} value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="bg-gray-700 mb-4 overflow-x-auto flex w-full justify-start">
            {categories.map(category => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-0">
              {isMenuLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
              ) : filteredMenuItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMenuItems.map(item => (
                    <Card 
                      key={item.id} 
                      className="bg-gray-700 border-gray-600 overflow-hidden hover:border-green-500 transition cursor-pointer"
                      onClick={() => handleAddToCart(item)}
                    >
                      <div className="p-4">
                        {item.image_url && (
                          <div className="aspect-video w-full overflow-hidden rounded-md mb-3 bg-gray-800 flex justify-center items-center">
                            <img 
                              src={item.image_url || '/placeholder.svg'} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        )}
                        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                        {item.description && (
                          <p className="text-gray-300 text-sm mb-2 line-clamp-2">{item.description}</p>
                        )}
                        <div className="font-bold text-green-400">{formatCurrency(item.price)}</div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 text-gray-400">
                  <p>No menu items found</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="flex justify-center items-center h-64 text-gray-400">
          <p>No menu categories available</p>
        </div>
      )}
    </div>
  );
};
