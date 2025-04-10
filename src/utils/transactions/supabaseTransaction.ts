
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

    // Validate connection first with timeout
    console.log("[Supabase Transaction] Validating Supabase connection...");
    const connectionTest = await Promise.race([
      supabase.from('menu_items').select('count').limit(1),
      new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error("Connection validation timed out after 5s")), 5000)
      )
    ]);
    
    const { error: connectionError } = connectionTest;
      
    if (connectionError) {
      console.error("[Supabase Transaction] Pre-check connection failed:", connectionError);
      console.error("[Supabase Transaction] Connection error details:", {
        message: connectionError.message,
        code: connectionError.code,
        details: connectionError.details,
        hint: connectionError.hint,
        status: connectionError.status
      });
      throw new Error(`Database connection failed: ${connectionError.message} (Code: ${connectionError.code || 'unknown'})`);
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
    
    // Insert the order and return the ID with timeout
    const orderResult = await Promise.race([
      supabase.from('orders').insert(orderData).select('id').single(),
      new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error("Order creation timed out after 10s")), 10000)
      )
    ]);
    
    const { data: order, error: orderError } = orderResult;
    
    if (orderError) {
      console.error("[Supabase Transaction] Order creation error:", orderError);
      console.error("[Supabase Transaction] Order error details:", {
        message: orderError.message,
        code: orderError.code,
        details: orderError.details,
        hint: orderError.hint,
        status: orderError.status || 'unknown'
      });
      console.error("[Supabase Transaction] Order data attempted:", orderData);
      
      if (orderError.code === '23505') {
        throw new Error("Order creation failed: Duplicate order detected");
      } else if (orderError.code === '42P01') {
        throw new Error("Order creation failed: Table 'orders' does not exist");
      } else if (orderError.code === '42501') {
        throw new Error("Order creation failed: Insufficient database permissions");
      } else if (orderError.message.includes('JWT')) {
        throw new Error("Order creation failed: Authentication error");
      } else {
        throw new Error(`Failed to create order: ${orderError.message} (Code: ${orderError.code || 'unknown'})`);
      }
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
    
    // Insert order items with timeout
    const itemsResult = await Promise.race([
      supabase.from('order_items').insert(orderItems),
      new Promise<any>((_, reject) => 
        setTimeout(() => reject(new Error("Order items creation timed out after 10s")), 10000)
      )
    ]);
    
    const { error: itemsError } = itemsResult;
    
    if (itemsError) {
      console.error("[Supabase Transaction] Order items creation error:", itemsError);
      console.error("[Supabase Transaction] Items error details:", {
        message: itemsError.message,
        code: itemsError.code,
        details: itemsError.details,
        hint: itemsError.hint,
        status: itemsError.status || 'unknown'
      });
      console.error("[Supabase Transaction] First item attempted:", orderItems[0]);
      
      if (itemsError.code === '23503') {
        throw new Error("Failed to create order items: Foreign key violation");
      } else if (itemsError.code === '42P01') {
        throw new Error("Failed to create order items: Table 'order_items' does not exist");
      } else {
        throw new Error(`Failed to create order items: ${itemsError.message} (Code: ${itemsError.code || 'unknown'})`);
      }
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
