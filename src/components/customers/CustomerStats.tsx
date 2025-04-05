
import React from "react";
import { Users, UserPlus, Repeat, Star, ArrowUp, ArrowDown } from "lucide-react";
import { useCustomerStats } from "@/hooks/useCustomers";
import { Card } from "@/components/ui/card";

export const CustomerStats = () => {
  const { data: stats, isLoading } = useCustomerStats();
  
  const statsItems = [
    { 
      icon: <Users size={20} className="text-blue-500" />, 
      label: "Total Customers", 
      value: isLoading ? "-" : stats?.totalCustomers.toLocaleString() || "0",
      subtitle: isLoading ? "" : `${stats?.newCustomers || 0} new this month`,
      change: 12, // Example percentage change - would come from API in real implementation
      color: "blue"
    },
    { 
      icon: <Repeat size={20} className="text-green-500" />, 
      label: "Return Rate", 
      value: isLoading ? "-" : `${stats?.returnRate || 0}%`,
      subtitle: "Based on repeat purchases",
      change: -2.5, // Example negative change
      color: "green"
    },
    { 
      icon: <Star size={20} className="text-yellow-500" />, 
      label: "Avg. Rating", 
      value: isLoading ? "-" : `${stats?.avgRating || 0}/5`,
      subtitle: isLoading ? "" : `Based on ${stats?.reviewCount || 0} reviews`,
      change: 0.3, // Example small positive change
      color: "yellow"
    },
    { 
      icon: <UserPlus size={20} className="text-purple-500" />, 
      label: "New Customers", 
      value: isLoading ? "-" : stats?.newCustomers.toLocaleString() || "0",
      subtitle: "This month",
      change: 8.7, // Example percentage change
      color: "purple"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsItems.map((stat, index) => (
        <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-5 relative overflow-hidden">
            {/* Colorful accent in the top right corner */}
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 bg-${stat.color}-500`}></div>
            
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100 mr-4`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.label}</p>
                <p className={`font-bold text-2xl ${isLoading ? 'animate-pulse' : ''}`}>
                  {stat.value}
                </p>
                <div className="flex items-center mt-1">
                  <p className="text-gray-500 text-xs mr-2">{stat.subtitle}</p>
                  {stat.change !== undefined && !isLoading && (
                    <div className={`flex items-center text-xs font-semibold ${
                      stat.change > 0 ? 'text-green-500' : stat.change < 0 ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {stat.change > 0 ? (
                        <ArrowUp size={12} className="mr-0.5" />
                      ) : stat.change < 0 ? (
                        <ArrowDown size={12} className="mr-0.5" />
                      ) : null}
                      {Math.abs(stat.change)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
