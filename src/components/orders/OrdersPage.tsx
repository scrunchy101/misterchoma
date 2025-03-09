
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { OrdersList } from "@/components/orders/OrdersList";

export const OrdersPage = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header title="Order Management" />
        
        {/* Orders Content */}
        <main className="p-6">
          {/* Orders List */}
          <OrdersList />
        </main>
      </div>
    </div>
  );
};
