
import React from "react";
import { ChevronDown, Search } from "lucide-react";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const currentDate = new Date();
  
  return (
    <header className="bg-gray-900 shadow-md">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="text-sm text-gray-400">
            {currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-700 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          
          <div className="flex items-center cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold">A</div>
            <ChevronDown size={16} className="ml-2 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
};
