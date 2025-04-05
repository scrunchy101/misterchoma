
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  total_spent?: number;
  order_count?: number;
}

export const useCustomers = (searchTerm: string = "") => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["customers", searchTerm],
    queryFn: async (): Promise<Customer[]> => {
      try {
        // Basic query to get customers
        let query = supabase
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false });

        // Apply search filter if present
        if (searchTerm) {
          query = query.or(
            `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
          );
        }

        const { data, error } = await query;

        if (error) throw error;

        // Now fetch aggregated stats for each customer (order count and total spent)
        const customers = data || [];
        
        // Get order data for these customers
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("customer_name, total_amount");
          
        if (orderError) {
          console.error("Error fetching order data:", orderError);
        }
        
        // Calculate order counts and total spent for each customer
        if (orderData) {
          const customerStats = orderData.reduce((acc: Record<string, { count: number, spent: number }>, order) => {
            const customerName = order.customer_name;
            if (customerName) {
              if (!acc[customerName]) {
                acc[customerName] = { count: 0, spent: 0 };
              }
              acc[customerName].count += 1;
              acc[customerName].spent += order.total_amount || 0;
            }
            return acc;
          }, {});
          
          // Add stats to customer objects
          return customers.map(customer => ({
            ...customer,
            order_count: customerStats[customer.name]?.count || 0,
            total_spent: customerStats[customer.name]?.spent || 0
          }));
        }
        
        return customers;
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast({
          title: "Error fetching customers",
          description: "Please try again later",
          variant: "destructive"
        });
        return [];
      }
    },
    staleTime: 1000 * 60 // 1 minute
  });
};

// Hook to fetch customer statistics
export const useCustomerStats = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ["customer-stats"],
    queryFn: async () => {
      try {
        // Get total customers count
        const { count: totalCustomers, error: countError } = await supabase
          .from("customers")
          .select("*", { count: 'exact', head: true });

        if (countError) throw countError;
        
        // Get customers from this month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        
        const { count: newCustomers, error: newError } = await supabase
          .from("customers")
          .select("*", { count: 'exact', head: true })
          .gte("created_at", firstDayOfMonth);
          
        if (newError) throw newError;
        
        // Get order data to calculate return rate
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("customer_name");
          
        if (orderError) throw orderError;
        
        // Calculate customers with multiple orders (returning customers)
        const customerOrderCounts: Record<string, number> = {};
        orderData.forEach(order => {
          if (order.customer_name) {
            customerOrderCounts[order.customer_name] = (customerOrderCounts[order.customer_name] || 0) + 1;
          }
        });
        
        const returningCustomers = Object.values(customerOrderCounts).filter(count => count > 1).length;
        const returnRate = totalCustomers ? Math.round((returningCustomers / totalCustomers) * 100) : 0;
        
        // For demo purposes, mocking the rating data since we don't have a reviews table
        const avgRating = 4.7;  // Mock data
        const reviewCount = 24; // Mock data

        return {
          totalCustomers: totalCustomers || 0,
          newCustomers: newCustomers || 0,
          returnRate,
          avgRating,
          reviewCount
        };
      } catch (error) {
        console.error("Error fetching customer stats:", error);
        toast({
          title: "Error fetching customer statistics",
          description: "Please try again later",
          variant: "destructive"
        });
        
        return {
          totalCustomers: 0,
          newCustomers: 0,
          returnRate: 0,
          avgRating: 0,
          reviewCount: 0
        };
      }
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};
