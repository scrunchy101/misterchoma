
import React from "react";
import { MenuTableRow } from "./MenuTableRow";
import { MenuItem } from "@/hooks/useMenuItems";

interface MenuTableProps {
  items: MenuItem[];
}

export const MenuTable = ({ items }: MenuTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-600">
            <th className="pb-3 font-medium">Item Name</th>
            <th className="pb-3 font-medium">Category</th>
            <th className="pb-3 font-medium">Price</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Description</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <MenuTableRow key={item.id} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
