
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Transaction {
  id: string;
  date: Date;
  customer: string;
  amount: number;
  items: number;
  paymentMethod: string;
  status: string;
}

export const useTransactions = (searchQuery: string = "") => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["transactions", searchQuery],
    queryFn: async (): Promise<Transaction[]> => {
      try {
        // Fetch orders with their items count
        let query = supabase
          .from("orders")
          .select(`
            id, 
            created_at, 
            customer_name, 
            total_amount, 
            payment_method, 
            payment_status,
            order_items(count)
          `)
          .order("created_at", { ascending: false });

        // Apply search filter if present
        if (searchQuery) {
          query = query.or(
            `id.ilike.%${searchQuery}%,customer_name.ilike.%${searchQuery}%`
          );
        }

        const { data, error } = await query;

        if (error) throw error;

        return data.map((order) => ({
          id: order.id,
          date: new Date(order.created_at),
          customer: order.customer_name || "Guest",
          amount: order.total_amount || 0,
          items: order.order_items?.[0]?.count || 0,
          paymentMethod: order.payment_method || "Cash",
          status: order.payment_status || "pending"
        }));
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast({
          title: "Error fetching transactions",
          description: "Please try again later.",
          variant: "destructive"
        });
        return [];
      }
    }
  });
};
