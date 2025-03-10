
import React from "react";
import { Loader2 } from "lucide-react";
import { MenuItem } from "../types";
import { MenuItemCard } from "./MenuItemCard";

interface MenuItemsGridProps {
  menuItems: MenuItem[];
  isLoading: boolean;
}

export const MenuItemsGrid = ({ menuItems, isLoading }: MenuItemsGridProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-gray-600">Loading menu items...</p>
      </div>
    );
  }

  if (menuItems.length === 0) {
    return (
      <div className="text-center py-10 text-gray-600">
        <p>No menu items available in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {menuItems.map((item) => (
        <MenuItemCard key={item.id} item={item} />
      ))}
    </div>
  );
};
