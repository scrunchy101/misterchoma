
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

      // Get today's date in YYYY-MM-DD format for filtering today's orders
      const today = new Date().toISOString().split('T')[0];
      
      // Filter today's orders
      const todaysOrders = orders.filter(order => 
        order.created_at.split('T')[0] === today
      );
      
      // Calculate total revenue from today's orders
      const revenueToday = todaysOrders.reduce(
        (sum, order) => sum + (order.total_amount || 0), 
        0
      );
      
      // Calculate metrics from orders
      const totalReservations = orders.length;
      const avgTableTimeMinutes = totalReservations > 0 ? 
        Math.floor(Math.random() * 30) + 30 : 0; // Simulated for now
      
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
      
      // Format data for the dashboard
      const formattedReservations = orders.map(order => ({
        id: order.id,
        name: order.customer_name || "Guest",
        people: order.table_number || 2,
        time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(order.created_at).toLocaleDateString() === new Date().toLocaleDateString() 
          ? "Today" 
          : new Date(order.created_at).toLocaleDateString(),
        status: order.status || "pending",
        phone: "(No phone on record)" // Add the missing phone property
      }));

      // For customers, use real customer data if available, otherwise derive from orders
      const formattedCustomers: Customer[] = [];
      
      if (customers && customers.length > 0) {
        // Use real customer data
        customers.forEach((customer, index) => {
          // Get customer's orders
          const customerOrders = orders.filter(
            order => order.customer_name?.toLowerCase() === customer.name.toLowerCase()
          );
          
          formattedCustomers.push({
            id: customer.id,
            name: customer.name,
            visits: customerOrders.length,
            lastVisit: customerOrders.length > 0 
              ? new Date(Math.max(...customerOrders.map(o => new Date(o.created_at).getTime()))).toLocaleDateString()
              : "No visits",
            spendAvg: customerOrders.length > 0
              ? `TZS ${(customerOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / customerOrders.length).toFixed(2)}`
              : "TZS 0.00",
            preference: customer.notes || "No data available"
          });
        });
      } else {
        // Derive from orders if no customer data
        const uniqueCustomers = [...new Set(orders.map(order => order.customer_name).filter(Boolean))];
        
        uniqueCustomers.forEach((name, index) => {
          if (name) {
            const customerOrders = orders.filter(order => order.customer_name === name);
            formattedCustomers.push({
              id: index.toString(),
              name: name,
              visits: customerOrders.length,
              lastVisit: new Date(Math.max(...customerOrders.map(o => new Date(o.created_at).getTime()))).toLocaleDateString(),
              spendAvg: `TZS ${(customerOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / customerOrders.length).toFixed(2)}`,
              preference: "No data available"
            });
          }
        });
      }

      return {
        reservations: formattedReservations,
        metrics: {
          totalReservations,
          avgTableTime: `${avgTableTimeMinutes} min`,
          revenueToday: `TZS ${revenueToday.toFixed(2)}`,
          customerFeedback: "N/A" // No real data for this yet
        },
        customers: formattedCustomers
      };
    }
  });
};
