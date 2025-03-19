
import React from "react";
import { Users, UserPlus, Repeat, Star } from "lucide-react";

export const CustomerStats = () => {
  const stats = [
    { 
      icon: <Users size={20} className="text-blue-500" />, 
      label: "Total Customers", 
      value: "248",
      subtitle: "12 new this month" 
    },
    { 
      icon: <Repeat size={20} className="text-green-500" />, 
      label: "Return Rate", 
      value: "68%",
      subtitle: "+5% from last month" 
    },
    { 
      icon: <Star size={20} className="text-yellow-500" />, 
      label: "Avg. Rating", 
      value: "4.7/5",
      subtitle: "Based on 156 reviews" 
    },
    { 
      icon: <UserPlus size={20} className="text-purple-500" />, 
      label: "New Customers", 
      value: "36",
      subtitle: "This month" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-50 mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="font-bold text-xl">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
