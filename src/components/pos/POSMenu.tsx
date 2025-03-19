
import React, { useState, useEffect } from "react";
import { Loader2, Search, Plus } from "lucide-react";
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

// Sample products with images for the demo
const sampleProducts = [
  {
    id: "prod1",
    name: "Hot Fudge Sundae",
    price: 40.00,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/lovable-uploads/6d4c469f-6bac-4583-9cc5-654712a55973.png"
  },
  {
    id: "prod2",
    name: "Hot Caramel Sundae",
    price: 32.00,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/lovable-uploads/6d4c469f-6bac-4583-9cc5-654712a55973.png"
  },
  {
    id: "prod3",
    name: "McFlurry w/ Oreo",
    price: 53.00,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    image: "/lovable-uploads/6d4c469f-6bac-4583-9cc5-654712a55973.png"
  },
  {
    id: "prod4",
    name: "ItemBurger",
    price: 10.00,
    description: "test",
    image: ""
  },
  {
    id: "prod5",
    name: "baklava",
    price: 7000.00,
    description: "",
    image: ""
  },
  {
    id: "prod6",
    name: "test item",
    price: 6.49,
    description: "sdfasdf",
    image: ""
  }
];

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
      setActiveCategory("Desserts & Drinks");
    }
  }, [categories, activeCategory]);

  // Fetch menu items when active category changes
  useEffect(() => {
    const fetchMenuItems = async () => {
      // For demo purposes, using sample products
      setIsMenuLoading(true);
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (searchQuery) {
          const filtered = sampleProducts.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setMenuItems(filtered as MenuItem[]);
        } else {
          setMenuItems(sampleProducts as MenuItem[]);
        }
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

  // Sample categories based on the image
  const filteredCategories = ["Desserts & Drinks", "Group Meals", "Rice Bowls", "Breakfast", "Featured"];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-gray-300"
        />
      </div>
      
      <Tabs 
        value={activeCategory} 
        onValueChange={setActiveCategory} 
        className="flex-1 flex flex-col"
      >
        <TabsList className="bg-gray-100 mb-4 h-auto flex flex-wrap justify-start">
          {filteredCategories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className={`mr-2 ${activeCategory === category ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
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
                <p className="ml-2 text-gray-600">Loading menu items...</p>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-10 text-gray-600">
                <p>No menu items available in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {menuItems.map((item) => (
                  <Card 
                    key={item.id}
                    className="overflow-hidden hover:shadow-md transition-shadow border border-gray-200"
                  >
                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                      {item.image_url || (item as any).image ? (
                        <img 
                          src={(item as any).image || item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">No Image</div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-3">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      {item.description && (
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{item.description}</p>
                      )}
                      <div className="mt-2 flex justify-between items-center">
                        <p className="font-bold text-gray-800">{formatCurrency(item.price)}</p>
                        <button 
                          className="text-gray-500 hover:text-gray-700"
                          onClick={() => handleAddToCart(item)}
                        >
                          <Plus size={20} />
                        </button>
                      </div>
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
