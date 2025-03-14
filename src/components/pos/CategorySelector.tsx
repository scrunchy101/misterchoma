
import React from "react";

interface CategorySelectorProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex overflow-x-auto p-2 bg-gray-700">
      <button
        className={`px-4 py-2 mx-1 rounded whitespace-nowrap ${selectedCategory === null ? 'bg-blue-600' : 'bg-gray-600'}`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category}
          className={`px-4 py-2 mx-1 rounded whitespace-nowrap ${selectedCategory === category ? 'bg-blue-600' : 'bg-gray-600'}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
