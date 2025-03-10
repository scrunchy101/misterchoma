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

export const useDashboardData = () => {
  return useQuery({
    queryKey: ["dashboardData"],
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

      // Calculate metrics from orders
      const totalReservations = orders.length;
      const avgTableTimeMinutes = orders.length > 0 ? 96 : 0; // Placeholder for now
      const revenueToday = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      
      // Format data for the dashboard
      const formattedReservations = orders.map(order => ({
        id: order.id,
        name: order.customer_name || "Guest",
        people: order.table_number || 2,
        time: new Date(order.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(order.created_at || Date.now()).toLocaleDateString() === new Date().toLocaleDateString() 
          ? "Today" 
          : new Date(order.created_at || Date.now()).toLocaleDateString(),
        status: order.status || "pending",
        phone: "(555) 123-4567" // Placeholder as there's no phone in orders table
      }));

      // For customers, we'll get unique customer names from orders
      const uniqueCustomers = [...new Set(orders.map(order => order.customer_name))].filter(Boolean);
      
      const formattedCustomers = uniqueCustomers.map((name, index) => {
        const customerOrders = orders.filter(order => order.customer_name === name);
        return {
          id: index.toString(),
          name: name as string,
          visits: customerOrders.length,
          lastVisit: new Date(Math.max(...customerOrders.map(o => new Date(o.created_at || Date.now()).getTime()))).toLocaleDateString(),
          spendAvg: `$${(customerOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / customerOrders.length).toFixed(2)}`,
          preference: "No data available" // Placeholder as we don't have this info yet
        };
      });

      return {
        reservations: formattedReservations,
        metrics: {
          totalReservations,
          avgTableTime: `${avgTableTimeMinutes} min`,
          revenueToday: `$${revenueToday.toFixed(2)}`,
          customerFeedback: "N/A" // Placeholder as we don't have this data yet
        },
        customers: formattedCustomers
      };
    }
  });
};
