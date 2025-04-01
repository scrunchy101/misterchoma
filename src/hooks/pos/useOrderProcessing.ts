
import { useState } from "react";
import { db } from "@/integrations/firebase/config";
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { CartItem, POSTransaction } from "./types";
import { useToast } from "@/hooks/use-toast";

export const useOrderProcessing = () => {
  const [loading, setLoading] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<POSTransaction | null>(null);
  const { toast } = useToast();

  // Process payment and create order in Firebase
  const processOrder = async (
    cart: CartItem[], 
    customerName: string, 
    employeeId?: string, 
    paymentMethod: string = "Cash"
  ): Promise<POSTransaction | null> => {
    try {
      setLoading(true);
      
      // Validate cart
      if (cart.length === 0) {
        throw new Error("Cannot process an empty order");
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
      
      // Create order in Firebase
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
      
      const orderDocRef = await addDoc(ordersRef, newOrder);
      const orderId = orderDocRef.id;
      
      console.log("Order created with ID:", orderId);
      
      // Create order items
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
      console.log("All order items created successfully");
      
      // Get employee name if employee ID is provided
      let employeeName = "";
      if (employeeId) {
        try {
          const employeeRef = doc(db, "employees", employeeId);
          const employeeDoc = await getDoc(employeeRef);
          
          if (employeeDoc.exists()) {
            employeeName = employeeDoc.data().name || "";
          }
        } catch (error) {
          console.error("Error fetching employee name:", error);
          // Continue processing even if employee name can't be fetched
        }
      }
      
      // Create transaction object
      const transaction: POSTransaction = {
        id: orderId,
        date: new Date(),
        customer: customerName || "Guest",
        items: [...cart],
        total,
        paymentMethod,
        employeeId,
        employeeName
      };
      
      setCurrentTransaction(transaction);
      console.log("Transaction completed successfully:", transaction);
      
      toast({
        title: "Order Complete",
        description: "Your order has been processed successfully."
      });
      
      return transaction;
    } catch (error: any) {
      console.error("Order processing error:", error);
      
      toast({
        title: "Order Failed",
        description: error.message || "An error occurred while processing your order.",
        variant: "destructive"
      });
      
      return null;
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
