
import React from "react";
import { Users, UserPlus, Repeat, Star } from "lucide-react";
import { useCustomerStats } from "@/hooks/useCustomers";

export const CustomerStats = () => {
  const { data: stats, isLoading } = useCustomerStats();
  
  const statsItems = [
    { 
      icon: <Users size={20} className="text-blue-500" />, 
      label: "Total Customers", 
      value: isLoading ? "-" : stats?.totalCustomers.toLocaleString() || "0",
      subtitle: isLoading ? "" : `${stats?.newCustomers || 0} new this month` 
    },
    { 
      icon: <Repeat size={20} className="text-green-500" />, 
      label: "Return Rate", 
      value: isLoading ? "-" : `${stats?.returnRate || 0}%`,
      subtitle: "Based on repeat purchases" 
    },
    { 
      icon: <Star size={20} className="text-yellow-500" />, 
      label: "Avg. Rating", 
      value: isLoading ? "-" : `${stats?.avgRating || 0}/5`,
      subtitle: isLoading ? "" : `Based on ${stats?.reviewCount || 0} reviews` 
    },
    { 
      icon: <UserPlus size={20} className="text-purple-500" />, 
      label: "New Customers", 
      value: isLoading ? "-" : stats?.newCustomers.toLocaleString() || "0",
      subtitle: "This month" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsItems.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-50 mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className={`font-bold text-xl ${isLoading ? 'animate-pulse' : ''}`}>
                {stat.value}
              </p>
              <p className="text-gray-500 text-xs">{stat.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
