
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
}

export const CategoryTabs = ({ categories, activeCategory }: CategoryTabsProps) => {
  return (
    <TabsList className="bg-gray-100 mb-4 h-auto flex flex-wrap justify-start">
      {categories.map((category) => (
        <TabsTrigger 
          key={category} 
          value={category}
          className={`mr-2 ${activeCategory === category ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          {category}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};
