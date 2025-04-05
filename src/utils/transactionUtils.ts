
import { db } from "@/integrations/firebase/config";
import { supabase } from "@/integrations/supabase/client";
import { 
  collection, 
  addDoc,
  getDoc,
  doc,
  serverTimestamp,
  getDocs,
  query,
  limit
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
  
  try {
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
  } catch (error) {
    console.error("Firebase transaction error:", error);
    throw error;
  }
};

// Process transaction with Supabase
const processSupabaseTransaction = async (
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
    // Simpler insert without ON CONFLICT
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
    console.log("Checking Firebase connection...");
    if (db) {
      try {
        // Create a simple query test
        const testRef = collection(db, "test_connection");
        const testQuery = query(testRef, limit(1));
        await getDocs(testQuery);
        firebaseConnected = true;
        console.log("Firebase connection successful");
      } catch (queryError) {
        console.error("Firebase query failed:", queryError);
        // Even if the test collection doesn't exist, if we didn't get a connection error
        // we can still consider Firebase connected
        firebaseConnected = !queryError.toString().includes("failed to connect");
      }
    } else {
      console.error("Firebase db object is not initialized");
    }
  } catch (error) {
    console.error("Firebase connection check failed:", error);
  }
  
  // Check Supabase connection
  try {
    console.log("Checking Supabase connection...");
    const { data, error } = await supabase
      .from('menu_items')
      .select('id')
      .limit(1);
    
    supabaseConnected = !error;
    console.log("Supabase connection:", supabaseConnected ? "successful" : "failed");
    
    if (error) {
      console.error("Supabase connection error:", error);
    }
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
