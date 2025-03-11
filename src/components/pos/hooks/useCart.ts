
import { useState, useCallback } from "react";
import { CartItem } from "../types";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addItemToCart = useCallback((newItem: CartItem) => {
    console.log("Adding item to cart:", newItem);
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === newItem.id);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + newItem.quantity
        };
        console.log("Updated cart items:", updatedItems);
        return updatedItems;
      } else {
        const newItems = [...prevItems, newItem];
        console.log("New cart items:", newItems);
        return newItems;
      }
    });
  }, []);

  const updateItemQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItemFromCart(id);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const removeItemFromCart = useCallback((id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return {
    cartItems,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart
  };
};
