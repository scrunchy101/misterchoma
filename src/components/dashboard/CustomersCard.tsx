
import React from "react";
import { Star, User } from "lucide-react";

interface Customer {
  id: number;
  name: string;
  visits: number;
  lastVisit: string;
  spendAvg: string;
  preference: string;
}

interface CustomersCardProps {
  customers: Customer[];
}

export const CustomersCard = ({ customers }: CustomersCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold">Regular Customers</h3>
      </div>
      <div className="p-4">
        {customers.map(customer => (
          <div key={customer.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <User size={12} className="mr-1" />
                    <span>{customer.visits} visits</span>
                    <span className="mx-2">•</span>
                    <span>Last: {customer.lastVisit}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Avg. Spend:</p>
                <p className="font-medium">{customer.spendAvg}</p>
              </div>
              <div className="max-w-[60%]">
                <p className="text-gray-500">Preferences:</p>
                <p className="font-medium truncate">{customer.preference}</p>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm">View All Customers</button>
        </div>
      </div>
    </div>
  );
};
