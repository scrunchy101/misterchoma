
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { ReservationsTable, Reservation } from "@/components/dashboard/ReservationsTable";
import { CustomersCard, Customer } from "@/components/dashboard/CustomersCard";
import { useDashboardData } from "@/hooks/useDashboardData";
import { AlertCircle } from "lucide-react";

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { data, isLoading, error } = useDashboardData();

  // Prepare metrics data for display
  const getMetrics = () => {
    if (!data) {
      return [
        { name: 'Total Reservations', value: '0', change: '0%', color: 'bg-blue-500' },
        { name: 'Avg. Table Time', value: '0 min', change: '0%', color: 'bg-green-500' },
        { name: 'Revenue Today', value: '$0', change: '0%', color: 'bg-purple-500' },
        { name: 'Customer Feedback', value: 'N/A', change: '0', color: 'bg-yellow-500' },
      ];
    }

    return [
      { name: 'Total Reservations', value: String(data.metrics.totalReservations), change: '+0%', color: 'bg-blue-500' },
      { name: 'Avg. Table Time', value: data.metrics.avgTableTime, change: '+0%', color: 'bg-green-500' },
      { name: 'Revenue Today', value: data.metrics.revenueToday, change: '+0%', color: 'bg-purple-500' },
      { name: 'Customer Feedback', value: data.metrics.customerFeedback, change: '+0', color: 'bg-yellow-500' },
    ];
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
        
        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && (
            <>
              {/* Metrics */}
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
              
              {/* Loading State */}
              {isLoading && (
                <div className="flex justify-center items-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
                </div>
              )}
              
              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 flex items-start">
                  <AlertCircle className="mr-2 h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium">Error loading dashboard data</h3>
                    <p className="text-sm">{error instanceof Error ? error.message : 'Unknown error'}</p>
                  </div>
                </div>
              )}
              
              {/* Data Display */}
              {!isLoading && !error && data && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Today's Reservations */}
                  <ReservationsTable reservations={data.reservations} />
                  
                  {/* Regular Customers */}
                  <CustomersCard customers={data.customers} />
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
