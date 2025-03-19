
import React from "react";
import { Search } from "lucide-react";
import { useMenu } from "./MenuContext";

export const MenuSearchBar = () => {
  const { searchTerm, setSearchTerm } = useMenu();

  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search menu items..."
        className="pl-10 py-2 pr-4 w-full bg-gray-600 border border-gray-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
