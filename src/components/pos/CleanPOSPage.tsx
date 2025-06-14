
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useMenuItems } from "@/hooks/useMenuItems";
import { useEmployees } from "@/hooks/useEmployees";
import { useSimplePOS } from "./SimplePOSSystem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Trash2, ShoppingCart } from "lucide-react";

export const CleanPOSPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  
  const { data: menuItems, isLoading } = useMenuItems();
  const { employees } = useEmployees();
  const { cart, addToCart, removeFromCart, updateQuantity, total, isProcessing, processOrder } = useSimplePOS();

  // Get unique categories
  const categories = Array.from(new Set(menuItems?.map(item => item.category) || []));
  
  // Filter items by category
  const filteredItems = selectedCategory 
    ? menuItems?.filter(item => item.category === selectedCategory)
    : menuItems;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckout(true);
  };

  const handleProcessOrder = async () => {
    const orderId = await processOrder(customerName, selectedEmployeeId || undefined);
    if (orderId) {
      setShowCheckout(false);
      setCustomerName("");
      setSelectedEmployeeId("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <Sidebar activeTab="pos" setActiveTab={() => {}} />
      
      <div className="flex-1 flex flex-col">
        <Header title="Point of Sale" />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Menu Section */}
          <div className="w-2/3 flex flex-col p-4">
            {/* Category Filter */}
            <div className="mb-4">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  onClick={() => setSelectedCategory(null)}
                  size="sm"
                >
                  All Items
                </Button>
                {categories.map(category => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    size="sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">Loading menu items...</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredItems?.map(item => (
                    <Card key={item.id} className="bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600" onClick={() => addToCart(item)}>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-white mb-2">{item.name}</h3>
                        <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                        <p className="text-green-400 font-bold">TZS {item.price.toLocaleString()}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cart Section */}
          <div className="w-1/3 border-l border-gray-700 flex flex-col">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart size={20} />
                Current Order
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="bg-gray-700 p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus size={14} />
                          </Button>
                        </div>
                        <span className="text-green-400 font-semibold">
                          TZS {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Footer */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold text-green-400">
                  TZS {total.toLocaleString()}
                </span>
              </div>
              
              <Button
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="bg-gray-800 text-white border-gray-700">
          <DialogHeader>
            <DialogTitle>Complete Order</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-green-400">TZS {total.toLocaleString()}</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Customer Name (Optional)
              </label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="bg-gray-700 border-gray-600"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                Employee
              </label>
              <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                <SelectTrigger className="bg-gray-700 border-gray-600">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {employees.map(employee => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} ({employee.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCheckout(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleProcessOrder}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? "Processing..." : "Complete Order"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
