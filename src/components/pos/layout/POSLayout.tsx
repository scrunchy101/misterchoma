
import React, { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { POSTopBar } from "@/components/pos/POSTopBar";

interface POSLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children: ReactNode;
}

export const POSLayout = ({ activeTab, setActiveTab, children }: POSLayoutProps) => {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header title="Point of Sale" />
        
        {/* POS Content */}
        <div className="flex-1 overflow-hidden p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
