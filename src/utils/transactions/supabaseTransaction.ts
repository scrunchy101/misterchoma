
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/components/pos/SimplePOSPage";
import { TransactionResult } from "./types";

// Process transaction with Supabase
export const processSupabaseTransaction = async (
  items: CartItem[],
  customerName: string,
  total: number
): Promise<TransactionResult> => {
  // Check Supabase connection first
  try {
    // Simple test query to verify connection
    const { data: testData, error: testError } = await supabase
      .from('menu_items')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error("Supabase connection test failed:", testError);
      throw new Error(`Supabase connection error: ${testError.message}`);
    }
    
    if (!testData || testData.length === 0) {
      console.warn("Supabase connection test returned no data");
    } else {
      console.log("Supabase connection verified successfully");
    }
  } catch (connectionError) {
    console.error("Failed to connect to Supabase:", connectionError);
    throw new Error("Cannot connect to Supabase database");
  }
  
  // Create order in database
  try {
    // Create the order - removed ON CONFLICT clause that was causing the error
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerName || "Guest",
        payment_method: "Cash",
        payment_status: 'completed',
        total_amount: total,
        status: 'completed'
      })
      .select('id');
    
    if (orderError) {
      console.error("Supabase order creation error:", orderError);
      throw orderError;
    }
    
    if (!orderData || orderData.length === 0) {
      throw new Error("Failed to create order - no order ID returned");
    }
    
    const orderId = orderData[0].id;
    console.log("Supabase order created with ID:", orderId);
    
    // Create order items
    const orderItems = items.map(item => ({
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
      console.error("Supabase order items error:", itemsError);
      throw itemsError;
    }
    
    return {
      success: true,
      transactionId: orderId,
      data: {
        id: orderId,
        date: new Date(),
        customer: customerName || "Guest",
        items: [...items],
        total,
        paymentMethod: "Cash"
      }
    };
  } catch (error) {
    console.error("Supabase transaction error:", error);
    throw error;
  }
};
