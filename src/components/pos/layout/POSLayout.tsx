
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
    <div className="flex h-screen bg-white text-gray-800">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <Header title="Point of Sale" />
        
        {/* POS Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Menu Section (Left) */}
          <div className="w-2/3 flex flex-col">
            {/* Top Bar with action buttons */}
            <POSTopBar />
            
            {/* Menu content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
