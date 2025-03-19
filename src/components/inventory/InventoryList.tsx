
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventorySearchBar } from "./InventorySearchBar";
import { InventoryTable } from "./InventoryTable";
import { InventoryLoadingState } from "./InventoryLoadingState";
import { InventoryErrorState } from "./InventoryErrorState";
import { InventoryEmptyState } from "./InventoryEmptyState";
import { InventoryProvider, useInventory } from "./InventoryContext";
import { InventoryAddButton } from "./InventoryAddButton";

const InventoryListContent = () => {
  const { loading, error, filteredItems, inventoryItems } = useInventory();

  const renderContent = () => {
    if (loading) {
      return <InventoryLoadingState />;
    }

    if (error) {
      return <InventoryErrorState error={error} onRetry={() => window.location.reload()} />;
    }

    if (filteredItems.length === 0) {
      return <InventoryEmptyState isEmpty={inventoryItems.length === 0} />;
    }

    return <InventoryTable items={filteredItems} />;
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Inventory Items</h2>
        <InventoryAddButton />
      </div>

      <InventorySearchBar />

      {renderContent()}
    </div>
  );
};

export const InventoryList = () => {
  return (
    <InventoryProvider>
      <InventoryListContent />
    </InventoryProvider>
  );
};
