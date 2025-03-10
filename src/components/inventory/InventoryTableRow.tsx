
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { InventoryStatusBadge } from "./InventoryStatusBadge";

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

interface InventoryTableRowProps {
  item: InventoryItem;
}

export const InventoryTableRow = ({ item }: InventoryTableRowProps) => {
  return (
    <tr key={item.id} className="border-b border-gray-600">
      <td className="py-4 font-medium">{item.name}</td>
      <td className="py-4">{item.category}</td>
      <td className="py-4">
        <div className="flex items-center">
          <div className="w-24 bg-gray-600 rounded-full h-2.5 mr-2">
            <div 
              className={`h-2.5 rounded-full ${
                item.stock > item.threshold * 1.5 ? 'bg-green-600' : 
                item.stock > item.threshold ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${Math.min((item.stock / (item.threshold * 2)) * 100, 100)}%` }}
            />
          </div>
          <span>{item.stock}</span>
        </div>
      </td>
      <td className="py-4">{item.unit}</td>
      <td className="py-4">
        <InventoryStatusBadge status={item.status} />
      </td>
      <td className="py-4">${item.cost.toFixed(2)}</td>
      <td className="py-4 text-gray-400">{item.last_updated}</td>
      <td className="py-4">
        <div className="flex space-x-2">
          <button className="text-blue-400 hover:text-blue-300">
            <Edit size={18} />
          </button>
          <button className="text-red-400 hover:text-red-300">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};
