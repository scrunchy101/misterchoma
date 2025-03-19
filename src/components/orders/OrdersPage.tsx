
import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { OrdersList } from "./OrdersList";
import { OrdersStats } from "./OrdersStats";
import { OrderFilters } from "./OrderFilters";

export const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Orders Management" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-800 p-6 space-y-6">
          <OrdersStats />
          
          <OrderFilters 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <OrdersList 
            statusFilter={statusFilter}
            searchQuery={searchQuery}
          />
        </main>
      </div>
    </div>
  );
};
