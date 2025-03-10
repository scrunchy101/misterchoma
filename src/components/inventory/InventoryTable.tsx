
import React from "react";
import { InventoryTableRow } from "./InventoryTableRow";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  threshold: number;
  status: string;
  cost: number;
  supplier?: string;
  last_updated: string;
}

interface InventoryTableProps {
  items: InventoryItem[];
}

export const InventoryTable = ({ items }: InventoryTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-600">
            <th className="pb-3 font-medium">Item Name</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium">Stock</th>
            <th className="pb-3 font-medium">Unit</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Cost</th>
            <th className="pb-3 font-medium">Last Updated</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <InventoryTableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
