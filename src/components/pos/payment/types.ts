
import { MenuItemWithQuantity } from "../types";
import { TransactionData } from "../../billing/receiptUtils";

export interface PaymentContextType {
  processPayment: (cart: MenuItemWithQuantity[], customerName: string, paymentMethod: string) => Promise<TransactionData | null>;
  currentTransaction: TransactionData | null;
  setCurrentTransaction: React.Dispatch<React.SetStateAction<TransactionData | null>>;
  connectionStatus: { connected: boolean; error?: any };
  checkConnection: () => Promise<{ connected: boolean; error?: any }>;
}

export interface PaymentProcessorProps {
  children: React.ReactNode;
}
