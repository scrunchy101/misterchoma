
import React, { createContext, useContext, useState, ReactNode } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface POSContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItemFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItemToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
      // Check if the item already exists in the cart
      const existingItem = prevItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // Update quantity of existing item
        return prevItems.map(item => 
          item.id === newItem.id 
            ? { ...item, quantity: item.quantity + newItem.quantity } 
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, newItem];
      }
    });
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItemFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate cart total
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const contextValue: POSContextType = {
    cartItems,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    cartTotal
  };

  return (
    <POSContext.Provider value={contextValue}>
      {children}
    </POSContext.Provider>
  );
};

export const usePOSContext = () => {
  const context = useContext(POSContext);
  if (context === undefined) {
    throw new Error('usePOSContext must be used within a POSProvider');
  }
  return context;
};

// Update POSPage to wrap with POSProvider
export const withPOSProvider = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <POSProvider>
      <Component {...props} />
    </POSProvider>
  );
};
