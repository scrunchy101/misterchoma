
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { InventoryList } from "@/components/inventory/InventoryList";
import { InventoryStats } from "@/components/inventory/InventoryStats";

export const InventoryPage = () => {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header title="Inventory Management" />
        
        {/* Inventory Content */}
        <main className="p-6">
          {/* Inventory Stats */}
          <InventoryStats />
          
          {/* Inventory List */}
          <div className="mt-6">
            <InventoryList />
          </div>
        </main>
      </div>
    </div>
  );
};
