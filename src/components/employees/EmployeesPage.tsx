
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { EmployeesList } from "@/components/employees/EmployeesList";
import { EmployeeStats } from "@/components/employees/EmployeeStats";

export const EmployeesPage = () => {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div className="flex h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <Header title="Employee Management" />
        
        {/* Employee Content */}
        <main className="p-6">
          {/* Employee Stats */}
          <EmployeeStats />
          
          {/* Employee List */}
          <div className="mt-6">
            <EmployeesList />
          </div>
        </main>
      </div>
    </div>
  );
};
