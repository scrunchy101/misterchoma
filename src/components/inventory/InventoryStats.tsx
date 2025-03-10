
import React, { useEffect, useState } from "react";
import { Package, AlertTriangle, Truck, PieChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const InventoryStats = () => {
  const [inventoryStats, setInventoryStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    incomingOrders: 0,
    inventoryValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        setLoading(true);
        
        // Fetch all inventory items
        const { data: inventoryItems, error } = await supabase
          .from('inventory')
          .select('*');
        
        if (error) throw error;
        
        if (inventoryItems) {
          // Calculate total items
          const totalItems = inventoryItems.length;
          
          // Calculate low stock items (below threshold)
          const lowStockItems = inventoryItems.filter(
            item => Number(item.stock) <= Number(item.threshold)
          ).length;
          
          // Calculate total inventory value
          const inventoryValue = inventoryItems.reduce(
            (total, item) => total + (Number(item.stock) * Number(item.cost)), 0
          );
          
          // Fetch incoming orders (future implementation - currently displays 0)
          const incomingOrders = 0;
          
          setInventoryStats({
            totalItems,
            lowStockItems,
            incomingOrders,
            inventoryValue,
          });
        }
      } catch (error) {
        console.error("Error fetching inventory stats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventoryStats();
    
    // Set up a subscription for real-time updates
    const subscription = supabase
      .channel('inventory_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'inventory' 
      }, () => {
        fetchInventoryStats();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const stats = [
    {
      title: "Total Items",
      value: loading ? "..." : String(inventoryStats.totalItems),
      subtitle: "in inventory",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Low Stock",
      value: loading ? "..." : String(inventoryStats.lowStockItems),
      subtitle: "items below threshold",
      icon: AlertTriangle,
      color: "bg-amber-500",
    },
    {
      title: "Incoming Orders",
      value: loading ? "..." : String(inventoryStats.incomingOrders),
      subtitle: "due this week",
      icon: Truck,
      color: "bg-green-500",
    },
    {
      title: "Inventory Value",
      value: loading ? "..." : `TSH ${inventoryStats.inventoryValue.toLocaleString()}`,
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
