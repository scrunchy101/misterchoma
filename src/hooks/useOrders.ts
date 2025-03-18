
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { getSupabaseErrorMessage } from "@/utils/errorUtils";

export interface Order {
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

export interface OrderForm {
  customerName: string;
  tableNumber: string;
  status: string;
  paymentStatus: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id, 
          customer_name, 
          table_number, 
          status, 
          payment_status, 
          total_amount,
          created_at,
          order_items (count)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      const formattedOrders: Order[] = (ordersData || []).map(order => ({
        id: order.id,
        customer: order.customer_name || "Guest",
        table: order.table_number,
        items: order.order_items?.length || 0,
        total: order.total_amount || 0,
        status: order.status || "Pending",
        time: format(new Date(order.created_at), 'h:mm a'),
        paymentStatus: order.payment_status || "Pending",
        created_at: order.created_at
      }));

      setOrders(formattedOrders);
      console.log("Fetched orders:", formattedOrders);
    } catch (error) {
      handleError(error, {
        showToast: true,
        severity: "error",
        logToConsole: true
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (newOrder: OrderForm, selectedItems: OrderItem[]) => {
    try {
      if (selectedItems.length === 0) {
        toast({
          title: "Error",
          description: "Please add at least one item to the order",
          variant: "destructive"
        });
        return false;
      }

      const orderTotal = selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

      // Removed ON CONFLICT clause by using a simple insert operation
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{ 
          customer_name: newOrder.customerName || null,
          table_number: newOrder.tableNumber ? parseInt(newOrder.tableNumber) : null,
          status: newOrder.status,
          payment_status: newOrder.paymentStatus,
          total_amount: orderTotal
        }])
        .select();

      if (orderError) {
        throw orderError;
      }
      
      if (!orderData || orderData.length === 0) {
        throw new Error("Failed to create order");
      }
      
      const orderId = orderData[0].id;
      
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

      if (itemsError) {
        throw itemsError;
      }
      
      toast({
        title: "Success",
        description: "New order created successfully",
      });
      
      await fetchOrders();
      return true;
    } catch (error) {
      const errorMessage = getSupabaseErrorMessage(error);
      handleError(new Error(errorMessage), {
        showToast: true,
        severity: "error"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    fetchOrders,
    createOrder
  };
};
