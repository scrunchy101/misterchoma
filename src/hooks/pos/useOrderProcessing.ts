
import { useState } from "react";
import { db } from "@/integrations/firebase/config";
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  serverTimestamp,
  runTransaction
} from "firebase/firestore";
import { CartItem, OrderTransaction } from "./types";

export const useOrderProcessing = () => {
  const [loading, setLoading] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<OrderTransaction | null>(null);

  // Process order in Firebase
  const processOrder = async (
    cart: CartItem[], 
    customerName: string, 
    employeeId?: string, 
    paymentMethod: string = "Cash"
  ): Promise<OrderTransaction | null> => {
    try {
      setLoading(true);
      
      // Validate cart
      if (!cart.length) {
        throw new Error("Cannot process an empty order");
      }
      
      if (!db) {
        throw new Error("Firebase database is not initialized");
      }
      
      // Calculate total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      console.log("Processing order with Firebase:", { 
        customerName, 
        employeeId, 
        paymentMethod, 
        total, 
        items: cart.length 
      });
      
      // Create order document
      const ordersRef = collection(db, "orders");
      const newOrder = {
        customer_name: customerName || "Guest",
        payment_method: paymentMethod,
        payment_status: 'completed',
        total_amount: total,
        status: 'completed',
        employee_id: employeeId || null,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp()
      };
      
      let orderId;
      let employeeName = "";
      
      // Use a transaction for better atomicity
      try {
        // First create the order
        const orderDocRef = await addDoc(ordersRef, newOrder);
        orderId = orderDocRef.id;
        
        console.log("Order created with ID:", orderId);
        
        // Create order items in batch
        const orderItemsPromises = cart.map(async (item) => {
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
        
        // Get employee name if ID is provided
        if (employeeId) {
          try {
            const employeeRef = doc(db, "employees", employeeId);
            const employeeDoc = await getDoc(employeeRef);
            
            if (employeeDoc.exists()) {
              employeeName = employeeDoc.data().name || "";
            }
          } catch (error) {
            console.error("Error fetching employee name:", error);
            // Non-critical: continue despite this error
          }
        }
      } catch (error) {
        console.error("Transaction failed:", error);
        throw new Error("Failed to save order. Please try again.");
      }
      
      if (!orderId) {
        throw new Error("Failed to create order");
      }
      
      // Create transaction object to return
      const transaction: OrderTransaction = {
        id: orderId,
        date: new Date(),
        customer: customerName || "Guest",
        items: [...cart],
        total,
        paymentMethod,
        employeeId,
        employeeName
      };
      
      // Set the current transaction
      setCurrentTransaction(transaction);
      
      console.log("Transaction completed successfully:", transaction);
      return transaction;
    } catch (error) {
      console.error("Order processing error:", error);
      throw error; // Re-throw for the caller to handle
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    currentTransaction,
    setCurrentTransaction,
    processOrder
  };
};
