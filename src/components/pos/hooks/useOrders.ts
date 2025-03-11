
import { useState } from "react";
import { supabase, fetchOrderDetails } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CartItem, OrderDetails } from "../types";
import { calculateCartTotal } from "../utils/cartUtils";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export const useOrders = (cartItems: CartItem[], clearCart: () => void) => {
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();

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
      console.log("Processing order with details:", orderDetails);
      
      const cartTotal = calculateCartTotal(cartItems);
      console.log("Cart total calculated:", cartTotal);

      // First, create the order record
      console.log("Inserting order into database...");
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

      if (orderError) {
        console.error("Error creating order:", orderError);
        throw new Error(`Order creation failed: ${orderError.message}`);
      }

      if (!orderData || !orderData.id) {
        console.error("Order created but no ID returned");
        throw new Error("Order created but no ID returned");
      }

      console.log("Order created successfully with ID:", orderData.id);
      setLastOrderId(orderData.id);

      // Next, create order item records
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      console.log("Inserting order items:", orderItems);
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        throw new Error(`Order items creation failed: ${itemsError.message}`);
      }

      console.log("Order items created successfully");
      clearCart();
      toast({
        title: "Order Created",
        description: `Order #${orderData.id.substring(0, 8).toUpperCase()} has been created successfully`,
      });
      
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error('Error processing order:', error);
      handleError(error, {
        context: "Order Processing",
        showToast: true,
        severity: "error"
      });
      toast({
        title: "Order Failed",
        description: `There was an error processing your order: ${errorMessage}`,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const getOrderReceipt = async (orderId: string) => {
    try {
      console.log("Fetching receipt for order:", orderId);
      const orderDetails = await fetchOrderDetails(orderId);
      console.log("Receipt data fetched:", orderDetails);
      
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
