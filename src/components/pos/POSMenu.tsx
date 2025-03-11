
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { MenuSearch } from "./menu/MenuSearch";
import { CategoryTabs } from "./menu/CategoryTabs";
import { MenuItemsGrid } from "./menu/MenuItemsGrid";
import { useMenuData } from "./hooks/useMenuData";

interface POSMenuProps {
  categories: string[];
  isLoading: boolean;
}

export const POSMenu = ({ categories, isLoading }: POSMenuProps) => {
  const {
    menuItems,
    isMenuLoading,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    filteredCategories
  } = useMenuData(categories);
  
  return (
    <div className="h-full flex flex-col">
      <MenuSearch 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <Tabs 
        value={activeCategory} 
        onValueChange={setActiveCategory} 
        className="flex-1 flex flex-col"
      >
        <CategoryTabs 
          categories={filteredCategories}
          activeCategory={activeCategory}
        />
        
        {filteredCategories.map((category) => (
          <TabsContent 
            key={category} 
            value={category} 
            className="flex-1 overflow-y-auto mt-0"
          >
            <MenuItemsGrid 
              menuItems={menuItems}
              isLoading={isLoading || isMenuLoading}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
