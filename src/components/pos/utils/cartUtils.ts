
import { CartItem } from "../types";

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const formatCurrency = (amount: number): string => {
  return `TZS ${amount.toLocaleString()}`;
};
