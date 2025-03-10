
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/components/dashboard/CustomersCard";
import { Reservation } from "@/components/dashboard/ReservationsTable";

export interface DashboardData {
  reservations: Reservation[];
  metrics: {
    totalReservations: number;
    avgTableTime: string;
    revenueToday: string;
    customerFeedback: string;
  };
  customers: Customer[];
}

export const useDashboardData = (refreshTrigger = 0) => {
  return useQuery({
    queryKey: ["dashboardData", refreshTrigger],
    queryFn: async (): Promise<DashboardData> => {
      // Fetch recent orders to calculate metrics
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw new Error(ordersError.message);
      }

      // Fetch customer data
      const { data: customers, error: customersError } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (customersError) {
        console.error("Error fetching customers:", customersError);
        throw new Error(customersError.message);
      }
      
      // Format data for the dashboard with reset metrics
      const formattedReservations = orders.map(order => ({
        id: order.id,
        name: order.customer_name || "Guest",
        people: order.table_number || 2,
        time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(order.created_at).toLocaleDateString() === new Date().toLocaleDateString() 
          ? "Today" 
          : new Date(order.created_at).toLocaleDateString(),
        status: order.status || "pending",
        phone: "(No phone on record)"
      }));

      // Reset customers data structure but keep actual customer data
      const formattedCustomers: Customer[] = (customers || []).map(customer => ({
        id: customer.id,
        name: customer.name,
        visits: 0,
        lastVisit: "No visits",
        spendAvg: "TZS 0.00",
        preference: "No data available"
      }));

      return {
        reservations: formattedReservations,
        metrics: {
          totalReservations: 0,
          avgTableTime: "0 min",
          revenueToday: "TZS 0.00",
          customerFeedback: "N/A"
        },
        customers: formattedCustomers
      };
    }
  });
};
