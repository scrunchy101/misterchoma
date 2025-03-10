
import React, { useState, useEffect } from "react";
import { POSLayout } from "@/components/pos/layout/POSLayout";
import { POSWrapper } from "@/components/pos/POSWrapper";
import { POSTopBar } from "@/components/pos/POSTopBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MenuItemCard } from "@/components/pos/menu/MenuItemCard";
import { MenuItem } from "@/components/pos/types";
import { ShoppingCart, Search, Plus, Minus, Trash, CheckCircle, User } from "lucide-react";
import { usePOSContext } from "@/components/pos/POSContext";

export const POSPage = () => {
  const [activeTab, setActiveTab] = useState('pos');
  const [categories, setCategories] = useState<string[]>([
    "Nyama Choma", "Kuku", "Chips", "Ugali", "Rice", "Beverages"
  ]);
  const [activeCategory, setActiveCategory] = useState<string>("Nyama Choma");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const { toast } = useToast();
  const { cartItems, cartTotal, formatCurrency, removeItemFromCart, updateItemQuantity, clearCart } = usePOSContext();

  // Sample products for the demo
  const sampleProducts = [
    {
      id: "prod1",
      name: "Beef Ribs",
      price: 15000,
      description: "Slow-cooked tender beef ribs",
      image: "/lovable-uploads/6d4c469f-6bac-4583-9cc5-654712a55973.png",
      category: "Nyama Choma"
    },
    {
      id: "prod2",
      name: "Goat Meat",
      price: 12000,
      description: "Grilled goat meat with spices",
      image: "/lovable-uploads/6d4c469f-6bac-4583-9cc5-654712a55973.png",
      category: "Nyama Choma"
    },
    {
      id: "prod3",
      name: "Grilled Chicken",
      price: 10000,
      description: "Whole grilled chicken with spices",
      image: "/lovable-uploads/6d4c469f-6bac-4583-9cc5-654712a55973.png",
      category: "Kuku"
    },
    {
      id: "prod4",
      name: "Chicken Wings",
      price: 8000,
      description: "Spicy grilled chicken wings",
      image: "",
      category: "Kuku"
    },
    {
      id: "prod5",
      name: "Chips Masala",
      price: 5000,
      description: "Fries with special masala seasoning",
      image: "",
      category: "Chips"
    },
    {
      id: "prod6",
      name: "Ugali",
      price: 2000,
      description: "Traditional corn meal dish",
      image: "",
      category: "Ugali"
    },
    {
      id: "prod7",
      name: "Pilau Rice",
      price: 4000,
      description: "Spiced rice with aromatic spices",
      image: "",
      category: "Rice"
    },
    {
      id: "prod8",
      name: "Soda",
      price: 1500,
      description: "Assorted soft drinks",
      image: "",
      category: "Beverages"
    }
  ];

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
        
        setMenuItems(filteredItems as MenuItem[]);
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
  }, [activeCategory, searchQuery, toast]);

  return (
    <POSWrapper>
      <POSLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        <POSTopBar />
        <div className="grid grid-cols-3 gap-6 h-full p-4">
          {/* Menu Section */}
          <div className="col-span-2 flex flex-col bg-white rounded-lg shadow p-4">
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
          
          {/* Cart Section */}
          <div className="col-span-1">
            <Card className="h-full flex flex-col bg-white p-4 border-gray-200 shadow">
              {/* Customer Information */}
              <div className="mb-4 flex items-center">
                <div className="p-2 rounded-full bg-green-100 text-green-600 mr-2">
                  <User size={16} />
                </div>
                <Input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="flex-1 bg-gray-50 border-gray-200"
                />
              </div>
              
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto mb-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <div className="mb-4 p-4 rounded-full bg-gray-100">
                      <ShoppingCart size={48} className="opacity-50" />
                    </div>
                    <p className="mb-2 text-gray-500">Your cart is empty</p>
                    <p className="text-sm text-center text-gray-400">Add items from the menu to create an order</p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={`${item.id}-${item.quantity}`} className="border-b border-gray-200 py-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.name}</h3>
                          <p className="text-gray-500 text-sm">{formatCurrency(item.price)}</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={16} className="text-gray-500" />
                          </button>
                          <span className="mx-2 text-gray-800">{item.quantity}</span>
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} className="text-gray-500" />
                          </button>
                        </div>
                        <button 
                          className="ml-2 p-1 rounded-full hover:bg-gray-100 text-red-400"
                          onClick={() => removeItemFromCart(item.id)}
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                      <div className="flex justify-end mt-1">
                        <span className="font-medium text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Cart Summary */}
              <div className="border-t border-gray-200 pt-4 mt-auto">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl mb-4">
                  <span>Total:</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button 
                    variant="outline" 
                    className="border-gray-200 hover:bg-gray-100 text-gray-800"
                    onClick={clearCart}
                  >
                    Clear
                  </Button>
                  <Button 
                    className="bg-green-500 hover:bg-green-600"
                    disabled={cartItems.length === 0}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Checkout
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </POSLayout>
    </POSWrapper>
  );
};
