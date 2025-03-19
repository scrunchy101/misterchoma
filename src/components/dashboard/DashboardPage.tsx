
import React, { useState, useCallback } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { ReservationsTable, Reservation } from "@/components/dashboard/ReservationsTable";
import { CustomersCard, Customer } from "@/components/dashboard/CustomersCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);
  
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useDashboardData(refreshTrigger);
  
  const { data: inventoryData, isLoading: isInventoryLoading } = useQuery({
    queryKey: ["inventoryMetrics", refreshTrigger],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory')
        .select('*');
      
      if (error) throw error;
      
      const totalItems = data?.length || 0;
      const totalCost = data?.reduce((acc, item) => acc + (Number(item.cost) * Number(item.stock)), 0) || 0;
      const lowStockItems = data?.filter(item => Number(item.stock) <= Number(item.threshold)).length || 0;
      
      return {
        totalItems,
        totalCost,
        lowStockItems
      };
    }
  });

  const getMetrics = () => {
    return [
      { 
        name: 'Total Items', 
        value: String(inventoryData?.totalItems || 0), 
        change: '0%', 
        color: 'bg-blue-500' 
      },
      { 
        name: 'Total Inventory Value', 
        value: `TZS ${(inventoryData?.totalCost || 0).toLocaleString()}`, 
        change: '0%', 
        color: 'bg-green-500' 
      },
      { 
        name: 'Low Stock Items', 
        value: String(inventoryData?.lowStockItems || 0), 
        change: '0%', 
        color: 'bg-purple-500' 
      },
      { 
        name: 'Stock Health', 
        value: inventoryData?.lowStockItems === 0 ? 'Good' : 'Needs Attention', 
        change: '0', 
        color: 'bg-yellow-500' 
      },
    ];
  };

  const isLoading = isDashboardLoading || isInventoryLoading;
  const error = dashboardError;

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto">
        <Header title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
        
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {getMetrics().map((metric, index) => (
                  <MetricsCard
                    key={index}
                    name={metric.name}
                    value={metric.value}
                    change={metric.change}
                    color={metric.color}
                  />
                ))}
              </div>
              
              {isLoading && (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
                </div>
              )}
              
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="mr-2 h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Error loading dashboard data</h3>
                    <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
                  </div>
                </div>
              )}
              
              {!isLoading && !error && dashboardData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <ReservationsTable 
                    reservations={dashboardData.reservations} 
                    onCancelReservation={refreshData} 
                  />
                  <CustomersCard customers={dashboardData.customers} />
                </div>
              )}
            </>
          )}
          
          {activeTab !== 'dashboard' && (
            <div className="flex items-center justify-center h-[70vh]">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-500 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Page
                </h2>
                <p className="text-gray-400">This section is under development</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
