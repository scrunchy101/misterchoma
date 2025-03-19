
import React from "react";
import { MenuTable } from "./MenuTable";
import { MenuSearchBar } from "./MenuSearchBar";
import { MenuLoadingState } from "./MenuLoadingState";
import { MenuErrorState } from "./MenuErrorState";
import { MenuEmptyState } from "./MenuEmptyState";
import { useMenu } from "./MenuContext";
import { MenuAddButton } from "./MenuAddButton";

export const MenuList = () => {
  const { loading, error, filteredItems, menuItems } = useMenu();

  const renderContent = () => {
    if (loading) {
      return <MenuLoadingState />;
    }

    if (error) {
      return <MenuErrorState error={error} onRetry={() => window.location.reload()} />;
    }

    if (filteredItems.length === 0) {
      return <MenuEmptyState isEmpty={menuItems.length === 0} />;
    }

    return <MenuTable items={filteredItems} />;
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Menu Items</h2>
        <MenuAddButton />
      </div>

      <MenuSearchBar />

      {renderContent()}
    </div>
  );
};
