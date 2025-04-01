
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/integrations/firebase/config";
import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  limit, 
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string | null;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface POSTransaction {
  id: string;
  date: Date;
  customer: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  employeeId?: string;
  employeeName?: string;
}

export const usePOSSystem = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({ connected: false, checking: false });
  const [currentTransaction, setCurrentTransaction] = useState<POSTransaction | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Check Firebase connection
  const checkConnection = async () => {
    try {
      setConnectionStatus(prev => ({ ...prev, checking: true }));
      console.log("Checking Firebase connection...");
      
      // Simple query to check if Firebase is accessible
      const menuRef = collection(db, "menu_items");
      const q = query(menuRef, limit(1));
      const querySnapshot = await getDocs(q);
      
      console.log("Firebase connection successful:", querySnapshot.size >= 0);
      setConnectionStatus({ connected: true, checking: false });
      return true;
    } catch (error) {
      console.error("Firebase connection check failed:", error);
      setConnectionStatus({ connected: false, checking: false });
      
      toast({
        title: "Connection Error",
        description: "Could not connect to Firebase. Please check your internet connection.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(i => i.id === item.id);
      
      if (existingItem) {
        return prevCart.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Item Added",
      description: `${item.name} has been added to your cart.`
    });
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    
    toast({
      title: "Item Removed",
      description: "Item has been removed from your cart."
    });
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
  };

  // Calculate total
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Process payment and create order in Firebase
  const processOrder = async (customerName: string, employeeId?: string, paymentMethod: string = "Cash") => {
    try {
      setLoading(true);
      
      // Check connection
      const isConnected = await checkConnection();
      if (!isConnected) {
        throw new Error("Cannot process order without Firebase connection");
      }
      
      // Validate cart
      if (cart.length === 0) {
        throw new Error("Cannot process an empty order");
      }
      
      // Calculate total
      const total = getTotal();
      
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

  // Initialize - check connection on first load
  useEffect(() => {
    const initConnection = async () => {
      try {
        console.log("Running initial Firebase connection check");
        await checkConnection();
      } catch (error) {
        console.error("Initial Firebase connection check failed:", error);
      }
    };
    
    initConnection();
  }, []);

  return {
    cart,
    loading,
    connectionStatus,
    currentTransaction,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotal,
    processOrder,
    checkConnection,
    itemCount: cart.reduce((count, item) => count + item.quantity, 0),
    setCurrentTransaction
  };
};
