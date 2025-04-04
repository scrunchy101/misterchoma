
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { OrdersList } from "./OrdersList";
import { OrderFilters } from "./OrderFilters";
import { OrdersStats } from "./OrdersStats";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const OrdersPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      <Sidebar activeTab="orders" setActiveTab={() => {}} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Orders Management" />
        
        <ErrorBoundary fallback={
          <div className="p-8 text-center">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6">There was an error loading the orders data.</p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </div>
        }>
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="mb-6">
              <OrdersStats />
            </div>
            
            <div className="mb-6">
              <OrderFilters 
                statusFilter={statusFilter}
                searchQuery={searchQuery}
                onStatusChange={setStatusFilter}
                onSearchChange={setSearchQuery}
              />
            </div>
            
            <OrdersList 
              statusFilter={statusFilter}
              searchQuery={searchQuery}
            />
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};
