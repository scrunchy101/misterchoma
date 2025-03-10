
import { useState } from "react";
import { supabase, fetchOrderDetails } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartItem, OrderDetails } from "../types";
import { calculateCartTotal } from "../utils/cartUtils";

export const useOrders = (cartItems: CartItem[], clearCart: () => void) => {
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  const processOrder = async (orderDetails: OrderDetails): Promise<boolean> => {
    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Cannot process an order with an empty cart",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsProcessingOrder(true);
      const cartTotal = calculateCartTotal(cartItems);

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: orderDetails.customerName,
          table_number: orderDetails.tableNumber,
          payment_method: orderDetails.paymentMethod,
          payment_status: 'pending',
          status: 'in-progress',
          total_amount: cartTotal
        })
        .select()
        .single();

      if (orderError) throw orderError;

      setLastOrderId(orderData.id);

      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      toast({
        title: "Order Created",
        description: `Order #${orderData.id.substring(0, 8).toUpperCase()} has been created successfully`,
      });
      
      return true;
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const getOrderReceipt = async (orderId: string) => {
    try {
      const orderDetails = await fetchOrderDetails(orderId);
      return {
        id: orderId.substring(0, 8).toUpperCase(),
        date: new Date(orderDetails.order.created_at),
        customer: orderDetails.order.customer_name || "Walk-in Customer",
        items: orderDetails.items,
        paymentMethod: orderDetails.order.payment_method,
        total: orderDetails.order.total_amount
      };
    } catch (error) {
      console.error("Error getting order receipt:", error);
      throw error;
    }
  };

  return {
    isProcessingOrder,
    processOrder,
    getLastOrderId: () => lastOrderId,
    getOrderReceipt
  };
};
