
import React, { useState } from "react";
import { Eye, CreditCard, FileText, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReceiptViewer } from "@/components/billing/ReceiptViewer";
import { fetchOrderDetails } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  onRefresh?: () => void;
}

export const OrderTable = ({ orders, loading, onRefresh }: OrderTableProps) => {
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptViewer, setShowReceiptViewer] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "completed":
        return "bg-green-900 text-green-300";
      case "in-progress":
      case "in progress":
        return "bg-blue-900 text-blue-300";
      case "ready for pickup":
      case "ready":
        return "bg-yellow-900 text-yellow-300";
      case "pending":
        return "bg-amber-900 text-amber-300";
      case "cancelled":
        return "bg-red-900 text-red-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case "paid":
        return "bg-green-900 text-green-300";
      case "pending":
        return "bg-amber-900 text-amber-300";
      default:
        return "bg-gray-900 text-gray-300";
    }
  };

  const handleViewReceipt = async (orderId: string) => {
    try {
      // Get the full ID from the order
      const fullOrderId = orderId; // Using the ID directly
      
      // Fetch order details from Supabase
      const orderDetails = await fetchOrderDetails(fullOrderId);
      
      if (orderDetails) {
        setReceiptData({
          id: orderId,
          date: new Date(orderDetails.order.created_at),
          customer: orderDetails.order.customer_name || "Walk-in Customer",
          items: orderDetails.items,
          paymentMethod: orderDetails.order.payment_method || "Cash",
          total: orderDetails.order.total_amount
        });
        setShowReceiptViewer(true);
      }
    } catch (error) {
      console.error("Error fetching receipt data:", error);
      toast({
        title: "Error",
        description: "Could not load receipt data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-300 text-sm">
          {orders.length} order{orders.length !== 1 ? 's' : ''} found
        </h3>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh} 
            className="text-gray-300 border-gray-600 hover:bg-gray-700"
          >
            <RefreshCw size={14} className="mr-1" />
            Refresh
          </Button>
        )}
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
            {loading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  </div>
                  <p>Loading orders...</p>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map(order => (
                <tr key={order.id} className="border-b border-gray-600">
                  <td className="py-4 font-medium">{order.id.substring(0, 8)}</td>
                  <td className="py-4">
                    <div>
                      <span>{order.customer}</span>
                      {order.table && (
                        <span className="block text-xs text-gray-400">Table #{order.table}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4">{order.items} items</td>
                  <td className="py-4">TSH {order.total.toLocaleString()}</td>
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-blue-950"
                      >
                        <Eye size={18} />
                      </Button>
                      {order.paymentStatus.toLowerCase() === "pending" && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-950"
                        >
                          <CreditCard size={18} />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-amber-400 hover:text-amber-300 hover:bg-amber-950"
                        onClick={() => handleViewReceipt(order.id)}
                      >
                        <FileText size={18} />
                      </Button>
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

      {receiptData && (
        <ReceiptViewer 
          isOpen={showReceiptViewer}
          onClose={() => setShowReceiptViewer(false)}
          transactionData={receiptData}
        />
      )}
    </>
  );
};
