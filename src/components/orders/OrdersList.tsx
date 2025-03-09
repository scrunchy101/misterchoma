
import React, { useState } from "react";
import { Search, Plus, Filter, Eye, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  customer: string;
  table: number;
  items: number;
  total: number;
  status: string;
  time: string;
  paymentStatus: string;
}

export const OrdersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample data for orders
  const orders: Order[] = [
    {
      id: "ORD-5421",
      customer: "Table 12",
      table: 12,
      items: 4,
      total: 78.50,
      status: "In Progress",
      time: "10 min ago",
      paymentStatus: "Pending"
    },
    {
      id: "ORD-5420",
      customer: "John Doe",
      table: 8,
      items: 3,
      total: 45.75,
      status: "Completed",
      time: "25 min ago",
      paymentStatus: "Paid"
    },
    {
      id: "ORD-5419",
      customer: "Table 5",
      table: 5,
      items: 6,
      total: 120.00,
      status: "Ready for Pickup",
      time: "15 min ago",
      paymentStatus: "Pending"
    },
    {
      id: "ORD-5418",
      customer: "Mary Smith",
      table: 3,
      items: 2,
      total: 32.25,
      status: "Completed",
      time: "45 min ago",
      paymentStatus: "Paid"
    },
    {
      id: "ORD-5417",
      customer: "Table 10",
      table: 10,
      items: 5,
      total: 95.50,
      status: "In Progress",
      time: "8 min ago",
      paymentStatus: "Pending"
    },
  ];

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed":
        return "bg-green-900 text-green-300";
      case "In Progress":
        return "bg-blue-900 text-blue-300";
      case "Ready for Pickup":
        return "bg-yellow-900 text-yellow-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case "Paid":
        return "bg-green-900 text-green-300";
      case "Pending":
        return "bg-amber-900 text-amber-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow-lg p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Button className="bg-green-600 hover:bg-green-700 text-white">
          <Plus size={16} className="mr-2" />
          New Order
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="text-white border-gray-600 bg-gray-800 hover:bg-gray-700">
          <Filter size={16} className="mr-2" />
          Filter
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-600">
              <th className="pb-3 font-medium">Order ID</th>
              <th className="pb-3 font-medium">Customer</th>
              <th className="pb-3 font-medium">Items</th>
              <th className="pb-3 font-medium">Total</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Payment</th>
              <th className="pb-3 font-medium">Time</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="border-b border-gray-600">
                <td className="py-4 font-medium">{order.id}</td>
                <td className="py-4">
                  <div>
                    <span>{order.customer}</span>
                    {order.table && (
                      <span className="block text-xs text-gray-400">Table #{order.table}</span>
                    )}
                  </div>
                </td>
                <td className="py-4">{order.items} items</td>
                <td className="py-4">${order.total.toFixed(2)}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="py-4 text-gray-400">{order.time}</td>
                <td className="py-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300">
                      <Eye size={18} />
                    </button>
                    {order.paymentStatus === "Pending" && (
                      <button className="text-green-400 hover:text-green-300">
                        <CreditCard size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
