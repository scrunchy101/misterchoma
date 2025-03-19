
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
      
      // Format data for the dashboard with better metrics
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

      // Process customer data
      const formattedCustomers: Customer[] = (customers || []).map(customer => ({
        id: customer.id,
        name: customer.name,
        visits: Math.floor(Math.random() * 5) + 1, // Mocked data
        lastVisit: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(), // Random recent date
        spendAvg: `TZS ${(Math.floor(Math.random() * 50) + 10) * 1000}`, // Random amount
        preference: ["Coffee", "Breakfast", "Lunch", "Dinner"][Math.floor(Math.random() * 4)] // Random preference
      }));

      // Calculate meaningful metrics
      const totalReservations = formattedReservations.length;
      const activeReservations = formattedReservations.filter(r => r.status !== 'cancelled').length;
      
      // Generate random but realistic metrics
      const avgTableTime = `${Math.floor(Math.random() * 30) + 30} min`;
      const revenueToday = `TZS ${(Math.floor(Math.random() * 500) + 100) * 1000}`;
      const feedbackScores = ['4.2/5', '4.5/5', '4.7/5', '4.8/5'];
      const customerFeedback = feedbackScores[Math.floor(Math.random() * feedbackScores.length)];

      return {
        reservations: formattedReservations,
        metrics: {
          totalReservations: activeReservations,
          avgTableTime,
          revenueToday,
          customerFeedback
        },
        customers: formattedCustomers
      };
    },
    refetchInterval: 30000, // Auto refresh every 30 seconds
  });
};
