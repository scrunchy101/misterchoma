
import { db } from "@/integrations/firebase/config";
import { 
  collection, 
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { CartItem } from "@/components/pos/SimplePOSPage";
import { TransactionResult } from "./types";

// Process transaction with Firebase
export const processFirebaseTransaction = async (
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
