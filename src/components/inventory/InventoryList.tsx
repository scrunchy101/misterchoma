
import React, { useState } from "react";
import { Search, Plus, Filter, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  threshold: number;
  status: string;
  cost: number;
  lastUpdated: string;
}

export const InventoryList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample data for inventory
  const inventoryItems: InventoryItem[] = [
    {
      id: "INV-1001",
      name: "Beef Sirloin",
      category: "Meat",
      stock: 45,
      unit: "kg",
      threshold: 10,
      status: "In Stock",
      cost: 12.99,
      lastUpdated: "2023-10-15"
    },
    {
      id: "INV-1002",
      name: "Tomatoes",
      category: "Vegetables",
      stock: 8,
      unit: "kg",
      threshold: 10,
      status: "Low Stock",
      cost: 3.50,
      lastUpdated: "2023-10-18"
    },
    {
      id: "INV-1003",
      name: "Olive Oil",
      category: "Oils",
      stock: 24,
      unit: "bottle",
      threshold: 5,
      status: "In Stock",
      cost: 15.75,
      lastUpdated: "2023-10-10"
    },
    {
      id: "INV-1004",
      name: "Chicken Breast",
      category: "Meat",
      stock: 3,
      unit: "kg",
      threshold: 7,
      status: "Low Stock",
      cost: 9.50,
      lastUpdated: "2023-10-17"
    },
    {
      id: "INV-1005",
      name: "Red Wine",
      category: "Beverages",
      stock: 32,
      unit: "bottle",
      threshold: 10,
      status: "In Stock",
      cost: 22.99,
      lastUpdated: "2023-10-05"
    },
    {
      id: "INV-1006",
      name: "Potatoes",
      category: "Vegetables",
      stock: 60,
      unit: "kg",
      threshold: 15,
      status: "In Stock",
      cost: 2.25,
      lastUpdated: "2023-10-16"
    },
    {
      id: "INV-1007",
      name: "Garlic",
      category: "Spices",
      stock: 4,
      unit: "kg",
      threshold: 5,
      status: "Low Stock",
      cost: 6.75,
      lastUpdated: "2023-10-14"
    },
  ];

  const filteredItems = inventoryItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="bg-gray-700 rounded-lg shadow-lg p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Inventory Items</h2>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus size={16} className="mr-2" />
          Add Item
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search inventory..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="text-white border-gray-600 bg-gray-800 hover:bg-gray-700">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>

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
            {filteredItems.map(item => (
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
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-4">${item.cost.toFixed(2)}</td>
                <td className="py-4 text-gray-400">{item.lastUpdated}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
