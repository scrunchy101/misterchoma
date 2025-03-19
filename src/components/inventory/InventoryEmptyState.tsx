
import React from "react";
import { Box } from "lucide-react";

interface InventoryEmptyStateProps {
  isEmpty: boolean;
}

export const InventoryEmptyState = ({ isEmpty }: InventoryEmptyStateProps) => {
  return (
    <div className="text-center py-8 text-gray-400">
      <div className="flex justify-center mb-3">
        <Box size={32} className="opacity-50" />
      </div>
      <p>{isEmpty ? "No inventory items found" : "No matching items found"}</p>
    </div>
  );
};
