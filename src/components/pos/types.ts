
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderDetails {
  customerName: string;
  tableNumber: number | null;
  paymentMethod: string;
}

export interface POSContextType {
  cartItems: CartItem[];
  addItemToCart: (item: CartItem) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  removeItemFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  isProcessingOrder: boolean;
  processOrder: (orderDetails: OrderDetails) => Promise<boolean>;
  formatCurrency: (amount: number) => string;
  getLastOrderId: () => string | null;
  getOrderReceipt: (orderId: string) => Promise<any>;
}
