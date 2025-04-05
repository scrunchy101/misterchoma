
import React, { useState, useCallback } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { CustomersList } from "@/components/customers/CustomersList";
import { CustomerStats } from "@/components/customers/CustomerStats";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Filter } from "lucide-react";
import { CustomerAddDialog } from "./CustomerAddDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export const CustomersPage = () => {
  const [activeTab, setActiveTab] = useState('customers');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();

  const refreshCustomers = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleExport = (format: string) => {
    toast({
      title: "Export initiated",
      description: `Exporting customer data as ${format}...`,
    });
    // In a real implementation, this would trigger the export process
  };

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
          {/* Page Intro */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
            <p className="text-gray-500">Track and manage your customer relationships</p>
          </div>

          {/* Search, Filter and Add Customer */}
          <Card className="p-4 mb-6 border-none shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-80 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              
              <div className="flex space-x-2 w-full sm:w-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-100">
                      <Filter size={16} className="mr-1" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem className="cursor-pointer">All Customers</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Recent Customers</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Frequent Customers</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">High Spenders</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-100">
                      <Download size={16} className="mr-1" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleExport("CSV")}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleExport("Excel")}>
                      Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleExport("PDF")}>
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus size={16} className="mr-1" />
                  Add Customer
                </Button>
              </div>
            </div>
          </Card>
          
          {/* Customer Stats */}
          <CustomerStats key={`stats-${refreshTrigger}`} />
          
          {/* Customer List */}
          <CustomersList searchTerm={searchTerm} refreshTrigger={refreshTrigger} />
          
          {/* Add Customer Dialog */}
          <CustomerAddDialog 
            isOpen={isAddDialogOpen} 
            onOpenChange={setIsAddDialogOpen} 
            onCustomerAdded={refreshCustomers}
          />
        </main>
      </div>
    </div>
  );
};
