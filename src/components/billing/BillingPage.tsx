
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BillingStats } from "@/components/billing/BillingStats";
import { RecentTransactions } from "@/components/billing/RecentTransactions";
import { InvoicesList } from "@/components/billing/InvoicesList";

export const BillingPage = () => {
  const [activeTab, setActiveTab] = useState('billing');

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header title="Billing & Invoices" />
        
        {/* Billing Content */}
        <main className="p-6">
          {/* Billing Stats */}
          <BillingStats />
          
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <RecentTransactions />
            </div>
            
            {/* Invoices */}
            <div>
              <InvoicesList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
