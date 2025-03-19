
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, ShoppingCart, Check, AlertTriangle } from "lucide-react";
import { useMenu } from "./MenuContext";

export const MenuStats = () => {
  const { menuItems, categories, loading } = useMenu();
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gray-700 border-gray-600">
            <CardContent className="p-6">
              <div className="h-16 animate-pulse bg-gray-600 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter(item => item.available).length;
  const unavailableItems = totalItems - availableItems;
  
  const stats = [
    {
      title: "Total Menu Items",
      value: totalItems,
      icon: Utensils,
      color: "text-blue-500",
      bgColor: "bg-blue-500/20"
    },
    {
      title: "Categories",
      value: categories.length,
      icon: ShoppingCart,
      color: "text-purple-500",
      bgColor: "bg-purple-500/20"
    },
    {
      title: "Available Items",
      value: availableItems,
      icon: Check,
      color: "text-green-500",
      bgColor: "bg-green-500/20"
    },
    {
      title: "Unavailable Items",
      value: unavailableItems,
      icon: AlertTriangle,
      color: "text-amber-500",
      bgColor: "bg-amber-500/20"
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gray-700 border-gray-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
