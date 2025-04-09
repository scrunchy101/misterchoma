
import { CartItem } from "@/components/pos/SimplePOSPage";

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  data?: any;
}

export interface DatabaseConnectionStatus {
  firebase: boolean;
  supabase: boolean;
  primaryAvailable: 'firebase' | 'supabase' | null;
}
