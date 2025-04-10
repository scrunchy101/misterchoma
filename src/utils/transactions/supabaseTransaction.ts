
import { CartItem } from "@/components/pos/SimplePOSPage";
import { TransactionResult } from "./types";
import { supabase } from "@/integrations/supabase/client";

// Process transaction with Supabase
export const processSupabaseTransaction = async (
  items: CartItem[],
  customerName: string,
  total: number
): Promise<TransactionResult> => {
  try {
    console.log("[Supabase Transaction] Starting transaction processing...");
    console.log("[Supabase Transaction] Cart items:", items.length, "Total:", total);

    // Validate connection first
    console.log("[Supabase Transaction] Validating Supabase connection...");
    const { data: connectionTest, error: connectionError } = await supabase
      .from('menu_items')
      .select('count')
      .limit(1);
      
    if (connectionError) {
      console.error("[Supabase Transaction] Pre-check connection failed:", connectionError);
      console.error("[Supabase Transaction] Connection error details:", {
        message: connectionError.message,
        code: connectionError.code,
        details: connectionError.details,
        hint: connectionError.hint
      });
      throw new Error(`Database connection failed: ${connectionError.message}`);
    }
    
    console.log("[Supabase Transaction] Connection validated successfully");

    // Create order first
    const orderData = {
      customer_name: customerName || 'Guest',
      payment_method: 'Cash',
      payment_status: 'completed',
      total_amount: total,
      status: 'completed',
      created_at: new Date().toISOString()
    };
    
    console.log("[Supabase Transaction] Creating order with:", orderData);
    
    // Insert the order and return the ID
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select('id')
      .single();
    
    if (orderError) {
      console.error("[Supabase Transaction] Order creation error:", orderError);
      console.error("[Supabase Transaction] Order error details:", {
        message: orderError.message,
        code: orderError.code,
        details: orderError.details,
        hint: orderError.hint
      });
      console.error("[Supabase Transaction] Order data attempted:", orderData);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }
    
    if (!order || !order.id) {
      console.error("[Supabase Transaction] No order ID returned after insert");
      throw new Error("Failed to create order: No ID returned");
    }
    
    const orderId = order.id;
    console.log("[Supabase Transaction] Order created with ID:", orderId);
    
    // Create order items
    const orderItems = items.map(item => ({
      order_id: orderId,
      menu_item_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity
    }));
    
    console.log("[Supabase Transaction] Creating order items:", orderItems.length);
    console.log("[Supabase Transaction] First order item:", orderItems[0]);
    
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) {
      console.error("[Supabase Transaction] Order items creation error:", itemsError);
      console.error("[Supabase Transaction] Items error details:", {
        message: itemsError.message,
        code: itemsError.code,
        details: itemsError.details,
        hint: itemsError.hint
      });
      console.error("[Supabase Transaction] First item attempted:", orderItems[0]);
      throw new Error(`Failed to create order items: ${itemsError.message}`);
    }
    
    console.log("[Supabase Transaction] Order items created successfully");
    
    // Return success result
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
    console.error("[Supabase Transaction] Error:", error);
    console.error("[Supabase Transaction] Error details:", {
      message: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
