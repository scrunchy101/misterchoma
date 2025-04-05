
import { db } from "@/integrations/firebase/config";
import { supabase } from "@/integrations/supabase/client";
import { 
  collection, 
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { CartItem } from "@/components/pos/SimplePOSPage";

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  data?: any;
}

// Process transaction with support for Firebase and Supabase
export const processTransaction = async (
  items: CartItem[],
  customerName: string,
  total: number,
  usePrimaryDb: 'firebase' | 'supabase' = 'firebase'
): Promise<TransactionResult> => {
  try {
    console.log(`Processing transaction with ${usePrimaryDb} as primary database`);
    
    // Validate cart
    if (!items.length) {
      return { 
        success: false, 
        error: "Cannot process an empty order" 
      };
    }
    
    // Try primary database first
    try {
      if (usePrimaryDb === 'firebase') {
        return await processFirebaseTransaction(items, customerName, total);
      } else {
        return await processSupabaseTransaction(items, customerName, total);
      }
    } catch (primaryError) {
      console.error(`Error with ${usePrimaryDb}:`, primaryError);
      
      // Try fallback database
      try {
        console.log(`Attempting fallback to ${usePrimaryDb === 'firebase' ? 'supabase' : 'firebase'}`);
        if (usePrimaryDb === 'firebase') {
          return await processSupabaseTransaction(items, customerName, total);
        } else {
          return await processFirebaseTransaction(items, customerName, total);
        }
      } catch (fallbackError) {
        console.error("Fallback database also failed:", fallbackError);
        throw new Error(`Both databases failed. Primary error: ${primaryError}. Fallback error: ${fallbackError}`);
      }
    }
  } catch (error) {
    console.error("Transaction processing error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};

// Process transaction with Firebase
const processFirebaseTransaction = async (
  items: CartItem[],
  customerName: string,
  total: number
): Promise<TransactionResult> => {
  if (!db) {
    throw new Error("Firebase database is not initialized");
  }
  
  // Create order document
  const ordersRef = collection(db, "orders");
  const newOrder = {
    customer_name: customerName || "Guest",
    payment_method: "Cash",
    payment_status: 'completed',
    total_amount: total,
    status: 'completed',
    created_at: serverTimestamp(),
    updated_at: serverTimestamp()
  };
  
  // Create the order
  const orderDocRef = await addDoc(ordersRef, newOrder);
  const orderId = orderDocRef.id;
  
  console.log("Firebase order created with ID:", orderId);
  
  // Create order items
  const orderItemsPromises = items.map(async (item) => {
    const orderItemRef = collection(db, "order_items");
    const orderItem = {
      order_id: orderId,
      menu_item_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity,
      created_at: serverTimestamp()
    };
    
    return addDoc(orderItemRef, orderItem);
  });
  
  await Promise.all(orderItemsPromises);
  
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
};

// Process transaction with Supabase
const processSupabaseTransaction = async (
  items: CartItem[],
  customerName: string,
  total: number
): Promise<TransactionResult> => {
  // Create order in database (with simpler insert)
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: customerName || "Guest",
      payment_method: "Cash",
      payment_status: 'completed',
      total_amount: total,
      status: 'completed'
    })
    .select('id')
    .single();
  
  if (orderError) {
    console.error("Supabase order creation error:", orderError);
    
    // Try alternative approach if constraint error
    if (orderError.message.includes("constraint")) {
      const { data: altOrderData, error: altOrderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customerName || "Guest",
          payment_method: "Cash",
          payment_status: 'completed',
          total_amount: total,
          status: 'completed'
        })
        .select('id');
      
      if (altOrderError || !altOrderData || altOrderData.length === 0) {
        throw new Error(altOrderError?.message || "Failed to create order");
      }
      
      orderData.id = altOrderData[0].id;
    } else {
      throw orderError;
    }
  }
  
  if (!orderData) {
    throw new Error("No order ID returned from database");
  }
  
  const orderId = orderData.id;
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
};

// Check connection status for both databases
export const checkDatabaseConnections = async (): Promise<{
  firebase: boolean;
  supabase: boolean;
  primaryAvailable: 'firebase' | 'supabase' | null;
}> => {
  let firebaseConnected = false;
  let supabaseConnected = false;
  
  // Check Firebase connection
  try {
    if (db) {
      const testRef = collection(db, "test_connection");
      await addDoc(testRef, { 
        timestamp: serverTimestamp(),
        test: true
      });
      firebaseConnected = true;
      console.log("Firebase connection successful");
    }
  } catch (error) {
    console.error("Firebase connection failed:", error);
  }
  
  // Check Supabase connection
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('count')
      .limit(1);
    
    supabaseConnected = !error;
    console.log("Supabase connection:", supabaseConnected ? "successful" : "failed");
  } catch (error) {
    console.error("Supabase connection check failed:", error);
  }
  
  // Determine which database to use as primary
  let primaryAvailable: 'firebase' | 'supabase' | null = null;
  if (firebaseConnected) {
    primaryAvailable = 'firebase';
  } else if (supabaseConnected) {
    primaryAvailable = 'supabase';
  }
  
  return {
    firebase: firebaseConnected,
    supabase: supabaseConnected,
    primaryAvailable
  };
};
