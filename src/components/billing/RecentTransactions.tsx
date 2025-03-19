
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CreditCard, Download, Search, Users } from "lucide-react";

export const RecentTransactions = () => {
  // Sample transaction data
  const transactions = [
    {
      id: "TX-2023-08-001",
      date: new Date(2023, 7, 25, 19, 30),
      customer: "James Wilson",
      amount: 142.50,
      items: 6,
      paymentMethod: "Credit Card",
      status: "completed"
    },
    {
      id: "TX-2023-08-002",
      date: new Date(2023, 7, 25, 20, 15),
      customer: "Sarah Johnson",
      amount: 86.75,
      items: 3,
      paymentMethod: "Credit Card",
      status: "completed"
    },
    {
      id: "TX-2023-08-003",
      date: new Date(2023, 7, 25, 21, 0),
      customer: "Michael Chen",
      amount: 235.00,
      items: 8,
      paymentMethod: "Credit Card",
      status: "completed"
    },
    {
      id: "TX-2023-08-004",
      date: new Date(2023, 7, 26, 18, 45),
      customer: "Lisa Rodriguez",
      amount: 92.25,
      items: 4,
      paymentMethod: "Credit Card",
      status: "completed"
    },
    {
      id: "TX-2023-08-005",
      date: new Date(2023, 7, 26, 19, 30),
      customer: "Robert Kim",
      amount: 176.80,
      items: 7,
      paymentMethod: "Credit Card",
      status: "completed"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold">Recent Transactions</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search transactions..."
            className="pl-9 pr-4 py-2 text-sm border rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-4 py-3 font-medium">Transaction ID</th>
              <th className="px-4 py-3 font-medium">Date & Time</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{transaction.id}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1 text-gray-400" />
                    <span>{format(transaction.date, "MMM d, yyyy")}</span>
                  </div>
                  <div className="text-xs text-gray-500">{format(transaction.date, "h:mm a")}</div>
                </td>
                <td className="px-4 py-3">
                  <div>{transaction.customer}</div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Users size={12} className="mr-1" />
                    <span>{transaction.items} items</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">${transaction.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={
                    transaction.status === "completed" ? "border-green-500 text-green-700 bg-green-50" :
                    transaction.status === "pending" ? "border-yellow-500 text-yellow-700 bg-yellow-50" :
                    transaction.status === "refunded" ? "border-red-500 text-red-700 bg-red-50" :
                    ""
                  }>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <CreditCard size={12} className="mr-1" />
                    <span>{transaction.paymentMethod}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Button variant="outline" size="sm" className="h-8">
                    <Download size={14} className="mr-1" />
                    Receipt
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing 5 of 42 transactions
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </div>
  );
};
