
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderSearchBar } from "@/components/orders/OrderSearchBar";
import { NewOrderDialog } from "@/components/orders/NewOrderDialog";

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

  const handleOpenNewOrderDialog = () => {
    setNewOrder({
      customerName: "",
      tableNumber: "",
      status: "pending",
      paymentStatus: "pending"
    });
    setSelectedItems([]);
    setShowNewOrderDialog(true);
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

      <OrderSearchBar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      <OrderTable 
        orders={filteredOrders} 
        loading={loading} 
      />

      <NewOrderDialog 
        open={showNewOrderDialog} 
        onOpenChange={setShowNewOrderDialog}
        onAddOrder={handleAddOrder}
      />
    </div>
  );
};
