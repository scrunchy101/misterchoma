
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TransactionItem {
  name: string;
  quantity: number;
  price: number;
}

export const useTransactionItems = (transactionId: string | null) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["transaction-items", transactionId],
    queryFn: async (): Promise<TransactionItem[]> => {
      if (!transactionId) return [];
      
      // Handle offline transaction IDs (they start with "OFFLINE-")
      if (transactionId.startsWith("OFFLINE-")) {
        console.log("Using offline transaction data, skipping database fetch");
        return [];
      }

      try {
        // Only query the database for valid UUIDs
        const { data, error } = await supabase
          .from("order_items")
          .select(`
            quantity,
            unit_price,
            menu_items (
              name
            )
          `)
          .eq("order_id", transactionId);

        if (error) throw error;

        return data.map((item) => ({
          name: item.menu_items?.name || "Unknown Item",
          quantity: item.quantity,
          price: item.unit_price
        }));
      } catch (error) {
        console.error("Error fetching transaction items:", error);
        // Don't show toast for offline transactions
        if (!transactionId.startsWith("OFFLINE-")) {
          toast({
            title: "Error fetching receipt details",
            description: "Please try again later.",
            variant: "destructive"
          });
        }
        return [];
      }
    },
    enabled: !!transactionId
  });
};
