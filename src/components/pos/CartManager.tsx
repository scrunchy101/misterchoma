
import React from "react";
import { MenuItemWithQuantity } from "./types";
import { useToast } from "@/hooks/use-toast";

interface CartManagerProps {
  children: React.ReactNode;
}

interface CartContextType {
  cart: MenuItemWithQuantity[];
  addToCart: (item: MenuItemWithQuantity) => void;
  updateCartItemQuantity: (itemId: string, newQuantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  calculateTotal: () => number;
}

export const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const CartManager: React.FC<CartManagerProps> = ({ children }) => {
  const [cart, setCart] = React.useState<MenuItemWithQuantity[]>([]);
  const { toast } = useToast();

  const addToCart = (item: MenuItemWithQuantity) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item exists in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // Add new item to cart with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
    
    toast({
      title: "Item added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const updateCartItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cart,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    calculateTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartManager");
  }
  return context;
};
