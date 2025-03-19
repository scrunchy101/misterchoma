
import React from "react";

interface InventoryStatusBadgeProps {
  status: string;
}

export const InventoryStatusBadge = ({ status }: InventoryStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case "In Stock":
        return "bg-green-900 text-green-300";
      case "Low Stock":
        return "bg-amber-900 text-amber-300";
      case "Out of Stock":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(status)}`}>
      {status}
    </span>
  );
};
