
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

export interface ConnectionStatus {
  connected: boolean;
  checking: boolean;
}
