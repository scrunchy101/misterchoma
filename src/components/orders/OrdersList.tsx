
import React, { useState, useEffect } from "react";
import { Search, Plus, Filter, Eye, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

export const OrdersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
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
            total: Number(order.total_amount),
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

    fetchOrders();
  }, [toast]);

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

  // Add a new order
  const handleAddOrder = async () => {
    try {
      // Create a new order with sample data
      const { data, error } = await supabase
        .from('orders')
        .insert([
          { 
            customer_name: 'Walk-in Customer',
            table_number: Math.floor(Math.random() * 20) + 1,
            status: 'pending',
            payment_status: 'pending'
          }
        ])
        .select();

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "New order created successfully",
      });
      
      // Reload orders
      window.location.reload();
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
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddOrder}>
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
    </div>
  );
};
