
import React from "react";
import { Users, Target, Award, TrendingUp } from "lucide-react";

export const EmployeeStats = () => {
  const stats = [
    {
      title: "Total Employees",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Active Targets",
      value: "16",
      change: "+3",
      trend: "up",
      icon: Target,
      color: "bg-purple-500",
    },
    {
      title: "Target Completion",
      value: "74%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-green-500",
    },
    {
      title: "Top Performers",
      value: "5",
      change: "+1",
      trend: "up",
      icon: Award,
      color: "bg-amber-500",
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
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <span className={`ml-2 text-xs ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'} flex items-center`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
