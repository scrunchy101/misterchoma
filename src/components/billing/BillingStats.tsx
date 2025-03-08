
import React from "react";
import { BadgeDollarSign, CreditCard, Receipt, Wallet } from "lucide-react";

export const BillingStats = () => {
  const stats = [
    { 
      icon: <Wallet size={20} className="text-blue-500" />, 
      label: "Monthly Revenue", 
      value: "$24,300",
      subtitle: "+8% from last month" 
    },
    { 
      icon: <Receipt size={20} className="text-green-500" />, 
      label: "Open Invoices", 
      value: "12",
      subtitle: "$3,590 total outstanding" 
    },
    { 
      icon: <CreditCard size={20} className="text-purple-500" />, 
      label: "Avg. Check Size", 
      value: "$86.50",
      subtitle: "+4.2% from last month" 
    },
    { 
      icon: <BadgeDollarSign size={20} className="text-yellow-500" />, 
      label: "Today's Sales", 
      value: "$1,250",
      subtitle: "16 transactions" 
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
