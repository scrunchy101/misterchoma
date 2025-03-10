
import React from "react";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const OrderSearchBar = ({ searchTerm, onSearchChange }: OrderSearchBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search orders..."
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Button variant="outline" className="text-white border-gray-600 bg-gray-800 hover:bg-gray-700">
        <Filter size={16} className="mr-2" />
        Filter
      </Button>
    </div>
  );
};
