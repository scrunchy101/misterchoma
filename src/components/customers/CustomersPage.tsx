
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CustomersList } from "@/components/customers/CustomersList";
import { CustomerStats } from "@/components/customers/CustomerStats";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

export const CustomersPage = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header title="Customers" />
        
        {/* Customers Content */}
        <main className="p-6">
          {/* Search and Add Customer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div className="relative w-full sm:w-auto mb-4 sm:mb-0">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full sm:w-80 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <Button className="w-full sm:w-auto">
              <Plus size={16} className="mr-1" />
              Add Customer
            </Button>
          </div>
          
          {/* Customer Stats */}
          <CustomerStats />
          
          {/* Customer List */}
          <CustomersList searchTerm={searchTerm} />
        </main>
      </div>
    </div>
  );
};
