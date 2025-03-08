
import React from "react";
import { cn } from "@/lib/utils";

interface MetricProps {
  name: string;
  value: string;
  change: string;
  color: string;
}

export const MetricsCard = ({ name, value, change, color }: MetricProps) => {
  const borderColor = {
    'bg-blue-500': '#3b82f6',
    'bg-green-500': '#22c55e', 
    'bg-purple-500': '#8b5cf6',
    'bg-yellow-500': '#eab308'
  }[color];

  const isPositive = change.startsWith('+');

  return (
    <div 
      className="bg-white rounded-lg shadow-sm p-4 border-l-4" 
      style={{ borderLeftColor: borderColor }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">{name}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={cn(
          "text-xs px-2 py-1 rounded",
          isPositive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        )}>
          {change}
        </div>
      </div>
    </div>
  );
};
