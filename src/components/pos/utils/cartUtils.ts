
import { CartItem } from "../types";

export const calculateCartTotal = (items: CartItem[]): number => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return 0;
  }
  
  return items.reduce((total, item) => {
    const itemPrice = typeof item.price === 'number' ? item.price : 0;
    const itemQuantity = typeof item.quantity === 'number' ? item.quantity : 0;
    
    return total + (itemPrice * itemQuantity);
  }, 0);
};

export const formatCurrency = (amount: number): string => {
  if (typeof amount !== 'number') {
    amount = 0;
  }
  
  return `TZS ${amount.toLocaleString()}`;
};
