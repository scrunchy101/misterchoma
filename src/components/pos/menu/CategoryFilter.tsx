
import React from "react";
import { Button } from "@/components/ui/button";
import { useMenuItems } from "@/hooks/useMenuItems";

interface CategoryFilterProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const { data: menuItems = [] } = useMenuItems();
  
  // Extract unique categories
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set<string>();
    menuItems.forEach(item => {
      if (item.category) uniqueCategories.add(item.category);
    });
    return Array.from(uniqueCategories);
  }, [menuItems]);

  return (
    <div className="flex overflow-x-auto p-2 bg-gray-700 border-b border-gray-600">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        className="mx-1 shrink-0 bg-gray-600"
        onClick={() => onSelectCategory(null)}
      >
        All Items
      </Button>
      
      {categories.map(category => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className="mx-1 shrink-0 bg-gray-600"
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};
