
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/components/dashboard/CustomersCard";

export interface DashboardData {
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
      
      // Fetch orders data for customer visit counts
      const { data: orders, error: ordersError } = await supabase
        .from("orders")
        .select("customer_name, created_at")
        .order("created_at", { ascending: false });
        
      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        throw new Error(ordersError.message);
      }
      
      // Create a map of customer visits
      const customerVisitsMap = new Map();
      orders?.forEach(order => {
        if (order.customer_name) {
          const currentVisits = customerVisitsMap.get(order.customer_name.toLowerCase()) || 0;
          customerVisitsMap.set(order.customer_name.toLowerCase(), currentVisits + 1);
        }
      });
      
      // Get the customer's average spend from orders
      const customerSpendMap = new Map();
      const customerLastVisitMap = new Map();
      
      if (orders && orders.length > 0) {
        // Group orders by customer name
        const ordersByCustomer = orders.reduce((acc, order) => {
          if (!order.customer_name) return acc;
          
          const name = order.customer_name.toLowerCase();
          if (!acc[name]) {
            acc[name] = [];
          }
          acc[name].push(order);
          return acc;
        }, {});
        
        // Calculate average spend and get last visit date
        for (const [name, customerOrders] of Object.entries(ordersByCustomer)) {
          // Calculate average spend
          const totalAmount = customerOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
          const avgSpend = totalAmount / customerOrders.length;
          customerSpendMap.set(name, avgSpend);
          
          // Get the last visit date
          const sortedOrders = [...customerOrders].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          if (sortedOrders.length > 0) {
            customerLastVisitMap.set(name, new Date(sortedOrders[0].created_at).toLocaleDateString());
          }
        }
      }
      
      // Process customer data using the collected metrics
      const formattedCustomers: Customer[] = (customers || []).map(customer => {
        const customerNameLower = customer.name.toLowerCase();
        return {
          id: customer.id,
          name: customer.name,
          visits: customerVisitsMap.get(customerNameLower) || 0,
          lastVisit: customerLastVisitMap.get(customerNameLower) || "N/A",
          spendAvg: `TZS ${Math.round((customerSpendMap.get(customerNameLower) || 0))}`,
          preference: customer.notes || "N/A" // Use notes field for preferences or set to N/A
        };
      });
      
      // Calculate total number of customers
      const totalCustomers = await supabase
        .from("customers")
        .select("id", { count: 'exact', head: true });
      
      // Generate metrics based on real data
      // For these metrics we still use some randomization but improve them in future iterations
      const avgTableTime = `${Math.floor(Math.random() * 30) + 30} min`;
      const revenueToday = `TZS ${(Math.floor(Math.random() * 500) + 100) * 1000}`;
      const feedbackScores = ['4.2/5', '4.5/5', '4.7/5', '4.8/5'];
      const customerFeedback = feedbackScores[Math.floor(Math.random() * feedbackScores.length)];

      return {
        metrics: {
          totalReservations: Math.floor(Math.random() * 10) + 5, // Still mocked, would replace with real data
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
