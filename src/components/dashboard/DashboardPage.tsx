
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { ReservationsTable } from "@/components/dashboard/ReservationsTable";
import { CustomersCard } from "@/components/dashboard/CustomersCard";

export const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data
  const recentReservations = [
    { id: 1, name: 'James Wilson', people: 4, time: '7:30 PM', date: 'Today', status: 'confirmed', phone: '(555) 123-4567' },
    { id: 2, name: 'Sarah Johnson', people: 2, time: '8:00 PM', date: 'Today', status: 'confirmed', phone: '(555) 234-5678' },
    { id: 3, name: 'Michael Chen', people: 6, time: '6:45 PM', date: 'Tomorrow', status: 'pending', phone: '(555) 345-6789' },
  ];

  const regularCustomers = [
    { id: 1, name: 'Lisa Rodriguez', visits: 28, lastVisit: '3 days ago', spendAvg: '$85', preference: 'Outdoor seating, Pescatarian' },
    { id: 2, name: 'Robert Kim', visits: 22, lastVisit: '1 week ago', spendAvg: '$110', preference: 'Wine enthusiast, Booth seating' },
    { id: 3, name: 'Emma Davis', visits: 17, lastVisit: '2 days ago', spendAvg: '$65', preference: 'Vegetarian, Allergic to nuts' },
  ];

  // Key metrics
  const metrics = [
    { name: 'Total Reservations', value: '42', change: '+8%', color: 'bg-blue-500' },
    { name: 'Avg. Table Time', value: '96 min', change: '+3%', color: 'bg-green-500' },
    { name: 'Revenue Today', value: '$3,850', change: '+12%', color: 'bg-purple-500' },
    { name: 'Customer Feedback', value: '4.8/5', change: '+0.2', color: 'bg-yellow-500' },
  ];

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
                {metrics.map((metric, index) => (
                  <MetricsCard
                    key={index}
                    name={metric.name}
                    value={metric.value}
                    change={metric.change}
                    color={metric.color}
                  />
                ))}
              </div>
              
              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Reservations */}
                <ReservationsTable reservations={recentReservations} />
                
                {/* Regular Customers */}
                <CustomersCard customers={regularCustomers} />
              </div>
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
