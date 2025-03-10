
import React from "react";
import { BadgeDollarSign, CreditCard, Receipt, Wallet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const BillingStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["billingStats"],
    queryFn: async () => {
      // Fetch today's billing stats
      const { data: billingStats, error: billingError } = await supabase
        .from('billing_stats')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0])
        .single();

      if (billingError) throw billingError;

      // Fetch last month's stats for comparison
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const { data: lastMonthStats, error: lastMonthError } = await supabase
        .from('billing_stats')
        .select('total_revenue, transaction_count')
        .eq('date', lastMonth.toISOString().split('T')[0])
        .single();

      if (lastMonthError && lastMonthError.code !== 'PGRST116') throw lastMonthError;

      // Fetch open invoices
      const { data: openInvoices, error: invoicesError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'pending');

      if (invoicesError) throw invoicesError;

      // Calculate percentages
      const revenueChange = lastMonthStats 
        ? ((billingStats?.total_revenue || 0) - lastMonthStats.total_revenue) / lastMonthStats.total_revenue * 100
        : 0;

      const avgTransactionChange = lastMonthStats && lastMonthStats.transaction_count > 0
        ? ((billingStats?.avg_transaction_amount || 0) - (lastMonthStats.total_revenue / lastMonthStats.transaction_count)) / (lastMonthStats.total_revenue / lastMonthStats.transaction_count) * 100
        : 0;

      return {
        monthlyRevenue: billingStats?.total_revenue || 0,
        revenueChange: Math.round(revenueChange),
        openInvoices: openInvoices?.length || 0,
        outstandingAmount: openInvoices?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0,
        avgTransactionAmount: billingStats?.avg_transaction_amount || 0,
        avgTransactionChange: Math.round(avgTransactionChange),
        todaySales: billingStats?.total_revenue || 0,
        todayTransactions: billingStats?.transaction_count || 0,
      };
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
            <div className="h-20 bg-gray-100"></div>
          </div>
        ))}
      </div>
    );
  }

  const billingStats = [
    { 
      icon: <Wallet size={20} className="text-blue-500" />, 
      label: "Monthly Revenue", 
      value: `TZS ${stats?.monthlyRevenue.toLocaleString()}`,
      subtitle: `${stats?.revenueChange}% from last month` 
    },
    { 
      icon: <Receipt size={20} className="text-green-500" />, 
      label: "Open Invoices", 
      value: stats?.openInvoices.toString(),
      subtitle: `TZS ${stats?.outstandingAmount.toLocaleString()} total outstanding` 
    },
    { 
      icon: <CreditCard size={20} className="text-purple-500" />, 
      label: "Avg. Check Size", 
      value: `TZS ${stats?.avgTransactionAmount.toLocaleString()}`,
      subtitle: `${stats?.avgTransactionChange}% from last month` 
    },
    { 
      icon: <BadgeDollarSign size={20} className="text-yellow-500" />, 
      label: "Today's Sales", 
      value: `TZS ${stats?.todaySales.toLocaleString()}`,
      subtitle: `${stats?.todayTransactions} transactions` 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {billingStats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-50 mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="font-bold text-xl">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
