
import React from "react";
import { Eye, CreditCard } from "lucide-react";

interface Order {
  id: string;
  customer: string;
  table: number | null;
  items: number;
  total: number;
  status: string;
  time: string;
  paymentStatus: string;
  created_at: string;
}

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
}

export const OrderTable = ({ orders, loading }: OrderTableProps) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case "Completed":
        return "bg-green-900 text-green-300";
      case "In-progress":
      case "In Progress":
        return "bg-blue-900 text-blue-300";
      case "Ready for Pickup":
      case "Ready":
        return "bg-yellow-900 text-yellow-300";
      case "Pending":
        return "bg-amber-900 text-amber-300";
      case "Cancelled":
        return "bg-red-900 text-red-300";
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
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
          {orders.length > 0 ? (
            orders.map(order => (
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
            ))
          ) : (
            <tr>
              <td colSpan={8} className="py-8 text-center text-gray-400">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
