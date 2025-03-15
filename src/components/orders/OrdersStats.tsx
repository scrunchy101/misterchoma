
import React from "react";
import { useOrders } from "@/hooks/useOrders";
import { 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  TrendingUp
} from "lucide-react";

export const OrdersStats = () => {
  const { orders } = useOrders();
  
  // Calculate statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(order => order.status.toLowerCase() === "completed").length;
  const pendingOrders = orders.filter(order => order.status.toLowerCase() === "pending").length;
  const inProgressOrders = orders.filter(order => 
    order.status.toLowerCase() === "in progress" || 
    order.status.toLowerCase() === "inprogress"
  ).length;
  
  const totalRevenue = orders
    .filter(order => order.paymentStatus.toLowerCase() === "completed")
    .reduce((sum, order) => sum + order.total, 0);
  
  const stats = [
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Completed",
      value: completedOrders,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "In Progress",
      value: inProgressOrders,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Pending",
      value: pendingOrders,
      icon: AlertCircle,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
    {
      title: "Revenue",
      value: `TZS ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-gray-900 border border-gray-800 rounded-lg p-4 flex items-center justify-between"
        >
          <div>
            <p className="text-gray-400 text-sm">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
          <div className={`p-3 rounded-full ${stat.bgColor}`}>
            <stat.icon className={`h-6 w-6 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
};
