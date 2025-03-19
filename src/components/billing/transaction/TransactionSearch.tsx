
import React from "react";
import { Search } from "lucide-react";

interface TransactionSearchProps {
  onSearch: (query: string) => void;
}

export const TransactionSearch: React.FC<TransactionSearchProps> = ({ onSearch }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search transactions..."
        className="pl-9 pr-4 py-2 text-sm border rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
    </div>
  );
};
