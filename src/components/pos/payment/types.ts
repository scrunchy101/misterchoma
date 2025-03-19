
import { MenuItemWithQuantity } from "../types";
import { TransactionData } from "../../billing/receiptUtils";

export interface ConnectionStatus {
  connected: boolean;
  error?: any;
}

export interface PaymentContextType {
  processPayment: (cart: MenuItemWithQuantity[], customerName: string, paymentMethod: string) => Promise<TransactionData | null>;
  currentTransaction: TransactionData | null;
  setCurrentTransaction: React.Dispatch<React.SetStateAction<TransactionData | null>>;
  connectionStatus: ConnectionStatus;
  checkConnection: () => Promise<ConnectionStatus>;
  isProcessing: boolean;
  clearTransaction: () => void;
}

export interface PaymentProcessorProps {
  children: React.ReactNode;
}
