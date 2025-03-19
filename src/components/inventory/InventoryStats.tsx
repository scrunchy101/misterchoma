
import React from "react";
import { Package, AlertTriangle, Truck, PieChart } from "lucide-react";

export const InventoryStats = () => {
  const stats = [
    {
      title: "Total Items",
      value: "126",
      subtitle: "in inventory",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Low Stock",
      value: "12",
      subtitle: "items below threshold",
      icon: AlertTriangle,
      color: "bg-amber-500",
    },
    {
      title: "Incoming Orders",
      value: "8",
      subtitle: "due this week",
      icon: Truck,
      color: "bg-green-500",
    },
    {
      title: "Inventory Value",
      value: "$24,830",
      subtitle: "current value",
      icon: PieChart,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-gray-700 rounded-lg shadow-lg p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.color} text-white mr-3`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-300">{stat.title}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-xs text-gray-400">{stat.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
