
import React from "react";
import { useMenu } from "./MenuContext";
import { UtensilsCrossed } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const { categories, isLoading } = useMenu();
  
  if (isLoading) {
    return (
      <div className="flex overflow-x-auto p-4 bg-gray-700 border-b border-gray-600 space-x-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div 
            key={index} 
            className="h-8 w-20 bg-gray-600 rounded animate-pulse shrink-0"
          />
        ))}
      </div>
    );
  }
  
  if (categories.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-700 border-b border-gray-600">
        <UtensilsCrossed className="text-gray-400 mr-2 h-4 w-4" />
        <span className="text-gray-400">No categories available</span>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto p-4 bg-gray-700 border-b border-gray-600">
      <button
        className={`px-4 py-2 rounded-full whitespace-nowrap mr-2 ${
          selectedCategory === null 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
        }`}
        onClick={() => onSelectCategory(null)}
      >
        All Items
      </button>
      
      {categories.map(category => (
        <button
          key={category}
          className={`px-4 py-2 rounded-full whitespace-nowrap mr-2 ${
            selectedCategory === category 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
          }`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
