
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MenuSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const MenuSearch = ({ searchQuery, setSearchQuery }: MenuSearchProps) => {
  return (
    <div className="mb-4 relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        type="text"
        placeholder="Search menu items..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 border-gray-300"
      />
    </div>
  );
};
