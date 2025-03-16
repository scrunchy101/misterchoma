
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
      
      try {
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
        toast({
          title: "Error fetching receipt details",
          description: "Please try again later.",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!transactionId
  });
};
