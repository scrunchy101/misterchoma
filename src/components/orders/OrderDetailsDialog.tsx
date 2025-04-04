
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, AlertCircle, Receipt as ReceiptIcon } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { useToast } from "@/hooks/use-toast";
import { TransactionData } from "@/components/billing/receiptUtils";
import { generateReceiptHtml, printReceipt, downloadReceipt } from "@/components/pos/receipt/receiptUtils";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetailsProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsDialog: React.FC<OrderDetailsProps> = ({ 
  orderId, 
  isOpen, 
  onClose 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && orderId) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch order details
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('*, employees(name)')
        .eq('id', orderId)
        .single();
        
      if (orderError) throw orderError;
      
      if (!order) {
        throw new Error("Order not found");
      }
      
      setOrderDetails(order);
      
      // Fetch order items
      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          unit_price,
          subtotal,
          menu_items(id, name)
        `)
        .eq('order_id', orderId);
        
      if (itemsError) throw itemsError;
      
      // Format order items
      const formattedItems: OrderItem[] = (items || []).map(item => ({
        id: item.menu_items?.id || item.id,
        name: item.menu_items?.name || "Unknown Item",
        quantity: item.quantity,
        price: item.unit_price
      }));
      
      setOrderItems(formattedItems);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch order details");
      
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    if (!orderDetails || !orderItems.length) return;
    
    try {
      const transaction: TransactionData = {
        id: orderDetails.id,
        date: new Date(orderDetails.created_at),
        customer: orderDetails.customer_name || "Guest",
        items: orderItems,
        total: orderDetails.total_amount,
        paymentMethod: orderDetails.payment_method || "Cash",
        employeeName: orderDetails.employees?.name,
      };
      
      printReceipt(transaction);
      
      toast({
        title: "Success",
        description: "Receipt sent to printer",
      });
    } catch (err) {
      console.error("Failed to print receipt:", err);
      
      toast({
        title: "Error",
        description: "Failed to print receipt",
        variant: "destructive",
      });
    }
  };

  const handleDownloadReceipt = () => {
    if (!orderDetails || !orderItems.length) return;
    
    try {
      const transaction: TransactionData = {
        id: orderDetails.id,
        date: new Date(orderDetails.created_at),
        customer: orderDetails.customer_name || "Guest",
        items: orderItems,
        total: orderDetails.total_amount,
        paymentMethod: orderDetails.payment_method || "Cash",
        employeeName: orderDetails.employees?.name,
      };
      
      downloadReceipt(transaction);
      
      toast({
        title: "Success",
        description: "Receipt downloaded successfully",
      });
    } catch (err) {
      console.error("Failed to download receipt:", err);
      
      toast({
        title: "Error",
        description: "Failed to download receipt",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mb-4" />
            <p>{error}</p>
          </div>
        ) : orderDetails ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{orderDetails.id.substring(0, 8)}</p>
              </div>
              <div className="flex space-x-2">
                <OrderStatusBadge status={orderDetails.status} />
                <PaymentStatusBadge status={orderDetails.payment_status} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{orderDetails.customer_name || "Guest"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(orderDetails.created_at).toLocaleDateString()}
                  {" "}
                  {new Date(orderDetails.created_at).toLocaleTimeString()}
                </p>
              </div>
              {orderDetails.table_number && (
                <div>
                  <p className="text-sm text-gray-500">Table</p>
                  <p className="font-medium">{orderDetails.table_number}</p>
                </div>
              )}
              {orderDetails.employees?.name && (
                <div>
                  <p className="text-sm text-gray-500">Employee</p>
                  <p className="font-medium">{orderDetails.employees.name}</p>
                </div>
              )}
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">Items</p>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Qty</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Price</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-400">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {orderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2">{item.name}</td>
                        <td className="px-4 py-2">{item.quantity}</td>
                        <td className="px-4 py-2">TZS {item.price.toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">
                          TZS {(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-800">
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-right font-medium">Total</td>
                      <td className="px-4 py-2 text-right font-medium">
                        TZS {orderDetails.total_amount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="h-10 w-10 text-yellow-500 mb-4" />
            <p>No order details found</p>
          </div>
        )}
        
        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrintReceipt}
              disabled={loading || !orderDetails}
            >
              <ReceiptIcon className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadReceipt}
              disabled={loading || !orderDetails}
            >
              <ReceiptIcon className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>
          <Button variant="default" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
