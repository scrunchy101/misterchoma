
import React from "react";
import { Utensils } from "lucide-react";
import { MenuAddButton } from "./MenuAddButton";

interface MenuEmptyStateProps {
  isEmpty: boolean;
}

export const MenuEmptyState = ({ isEmpty }: MenuEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Utensils size={48} className="text-gray-500 mb-4" />
      {isEmpty ? (
        <>
          <h3 className="text-xl font-semibold mb-2">No Menu Items Found</h3>
          <p className="text-gray-400 mb-4">Start by adding your first menu item.</p>
          <MenuAddButton />
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2">No Matching Items</h3>
          <p className="text-gray-400">Try adjusting your search criteria.</p>
        </>
      )}
    </div>
  );
};
