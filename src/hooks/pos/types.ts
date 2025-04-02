
// Basic types for menu items
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  imageUrl?: string;
  available?: boolean;
}

// Cart item extends MenuItem with quantity
export interface CartItem extends MenuItem {
  quantity: number;
}

// Transaction record for completed orders
export interface OrderTransaction {
  id: string;
  date: Date;
  customer: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  employeeId?: string;
  employeeName?: string;
}

// Firebase connection status
export interface ConnectionStatus {
  connected: boolean;
  checking: boolean;
}
