
import React from "react";
import { Search } from "lucide-react";

interface EmployeeSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const EmployeeSearch = ({ searchTerm, setSearchTerm }: EmployeeSearchProps) => {
  return (
    <div className="mb-6 relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search employees..."
        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
