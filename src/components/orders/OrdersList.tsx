
import React, { useState, useEffect } from "react";
import { Search, Plus, Filter, Eye, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { OrderMenuItems } from "@/components/orders/OrderMenuItems";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Order {
  id: string;
  customer: string;
  table: number | null;
  items: number;
  total: number;
  status: string;
  time: string;
  paymentStatus: string;
  created_at: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const OrdersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerName: "",
    tableNumber: "",
    status: "pending",
    paymentStatus: "pending"
  });
  const [selectedTab, setSelectedTab] = useState<"details" | "menu">("details");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Fetch order items to get the counts
      const { data: orderItemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('order_id, quantity');

      if (itemsError) throw itemsError;

      // Process the data to match the component's expected format
      const processedOrders = ordersData.map(order => {
        // Count items for this order
        const orderItems = orderItemsData.filter(item => item.order_id === order.id);
        const itemCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
        
        // Calculate time ago
        const orderTime = new Date(order.created_at);
        const now = new Date();
        const diffMinutes = Math.floor((now.getTime() - orderTime.getTime()) / (1000 * 60));
        
        let timeAgo;
        if (diffMinutes < 60) {
          timeAgo = `${diffMinutes} min ago`;
        } else if (diffMinutes < 1440) {
          timeAgo = `${Math.floor(diffMinutes / 60)} hr ago`;
        } else {
          timeAgo = `${Math.floor(diffMinutes / 1440)} days ago`;
        }

        return {
          id: order.id.substring(0, 8).toUpperCase(),
          customer: order.customer_name || `Table ${order.table_number}`,
          table: order.table_number,
          items: itemCount,
          total: Number(order.total_amount || 0),
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          time: timeAgo,
          paymentStatus: order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1),
          created_at: order.created_at
        };
      });

      setOrders(processedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed":
        return "bg-green-900 text-green-300";
      case "In-progress":
      case "In Progress":
        return "bg-blue-900 text-blue-300";
      case "Ready for Pickup":
      case "Ready":
        return "bg-yellow-900 text-yellow-300";
      case "Pending":
        return "bg-amber-900 text-amber-300";
      case "Cancelled":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case "Paid":
        return "bg-green-900 text-green-300";
      case "Pending":
        return "bg-amber-900 text-amber-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const handleOpenNewOrderDialog = () => {
    setNewOrder({
      customerName: "",
      tableNumber: "",
      status: "pending",
      paymentStatus: "pending"
    });
    setSelectedItems([]);
    setSelectedTab("details");
    setShowNewOrderDialog(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder({
      ...newOrder,
      [name]: value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewOrder({
      ...newOrder,
      [name]: value
    });
  };

  const handleAddMenuItem = (itemId: string, itemName: string, itemPrice: number) => {
    // Check if the item already exists in the selected items
    const existingItemIndex = selectedItems.findIndex(item => item.id === itemId);
    
    if (existingItemIndex >= 0) {
      // Increase quantity if item already exists
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      setSelectedItems(updatedItems);
    } else {
      // Add new item if it doesn't exist
      setSelectedItems([...selectedItems, { id: itemId, name: itemName, price: itemPrice, quantity: 1 }]);
    }

    toast({
      title: "Item added",
      description: `Added ${itemName} to the order`,
    });
  };

  const handleRemoveMenuItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const handleUpdateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveMenuItem(itemId);
      return;
    }
    
    const updatedItems = selectedItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    
    setSelectedItems(updatedItems);
  };

  const calculateOrderTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleAddOrder = async () => {
    try {
      if (selectedItems.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one item to the order",
          variant: "destructive"
        });
        return;
      }

      // Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          { 
            customer_name: newOrder.customerName || null,
            table_number: newOrder.tableNumber ? parseInt(newOrder.tableNumber) : null,
            status: newOrder.status,
            payment_status: newOrder.paymentStatus,
            total_amount: calculateOrderTotal()
          }
        ])
        .select();

      if (orderError) throw orderError;
      
      if (!orderData || orderData.length === 0) {
        throw new Error("Failed to create order");
      }
      
      const orderId = orderData[0].id;
      
      // Insert order items
      const orderItems = selectedItems.map(item => ({
        order_id: orderId,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;
      
      toast({
        title: "Success",
        description: "New order created successfully",
      });
      
      setShowNewOrderDialog(false);
      fetchOrders();
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Error",
        description: "Failed to create new order",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleOpenNewOrderDialog}>
          <Plus size={16} className="mr-2" />
          New Order
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="text-white border-gray-600 bg-gray-800 hover:bg-gray-700">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-600">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Items</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-600">
                    <td className="py-4 font-medium">{order.id}</td>
                    <td className="py-4">
                      <div>
                        <span>{order.customer}</span>
                        {order.table && (
                          <span className="block text-xs text-gray-400">Table #{order.table}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4">{order.items} items</td>
                    <td className="py-4">${order.total.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400">{order.time}</td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-400 hover:text-blue-300">
                          <Eye size={18} />
                        </button>
                        {order.paymentStatus === "Pending" && (
                          <button className="text-green-400 hover:text-green-300">
                            <CreditCard size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400">
                    {loading ? "Loading orders..." : "No orders found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription className="text-gray-400">
              Add order details and menu items.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "details" | "menu")}>
            <TabsList className="bg-gray-700 mb-4">
              <TabsTrigger value="details">Order Details</TabsTrigger>
              <TabsTrigger value="menu">Menu Items</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name (optional)</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={newOrder.customerName}
                  onChange={handleInputChange}
                  placeholder="Customer Name"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number (optional)</Label>
                <Input
                  id="tableNumber"
                  name="tableNumber"
                  type="number"
                  value={newOrder.tableNumber}
                  onChange={handleInputChange}
                  placeholder="Table Number"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select
                  value={newOrder.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="ready">Ready</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select
                  value={newOrder.paymentStatus}
                  onValueChange={(value) => handleSelectChange("paymentStatus", value)}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            <TabsContent value="menu" className="py-2">
              <OrderMenuItems onSelectItem={handleAddMenuItem} />
            </TabsContent>
          </Tabs>

          {/* Selected Items Section */}
          <div className="mt-4 border-t border-gray-700 pt-4">
            <h3 className="text-lg font-medium mb-2">Selected Items</h3>
            {selectedItems.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {selectedItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-gray-400">${item.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center">
                      <button
                        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded"
                        onClick={() => handleUpdateItemQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded" 
                        onClick={() => handleUpdateItemQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <div className="ml-4 font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-4">
                No items selected. Go to the Menu Items tab to add items.
              </div>
            )}
            
            <div className="flex justify-end mt-4 text-lg font-bold">
              Total: ${calculateOrderTotal().toFixed(2)}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewOrderDialog(false)}
              className="border-gray-600 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddOrder}
              className="bg-green-600 hover:bg-green-700"
              disabled={selectedItems.length === 0}
            >
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
