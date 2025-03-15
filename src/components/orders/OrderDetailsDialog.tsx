
import React, { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Loader2, X, Printer, Clock, Receipt } from "lucide-react";
import { fetchOrderDetails } from "@/integrations/supabase/client";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

interface OrderDetailsDialogProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderDetails {
  order: {
    id: string;
    customer_name: string;
    table_number: number | null;
    status: string;
    payment_status: string;
    total_amount: number;
    created_at: string;
    payment_method: string | null;
  };
  items: OrderItem[];
}

export const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        setLoading(true);
        const details = await fetchOrderDetails(orderId);
        setOrderDetails(details);
      } catch (error) {
        handleError(error, {
          context: "Fetching order details",
          showToast: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && orderId) {
      getOrderDetails();
    }
  }, [orderId, isOpen, handleError]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Order Details</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose} 
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Complete information about this order
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : orderDetails ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Order ID</p>
                <p className="font-medium">{orderDetails.order.id.substring(0, 8)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date & Time</p>
                <p className="font-medium">
                  {format(new Date(orderDetails.order.created_at), "MMM d, yyyy h:mm a")}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Customer</p>
                <p className="font-medium">{orderDetails.order.customer_name || "Guest"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Table</p>
                <p className="font-medium">
                  {orderDetails.order.table_number ? `Table ${orderDetails.order.table_number}` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Status</p>
                <OrderStatusBadge status={orderDetails.order.status} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Payment</p>
                <div className="flex flex-col space-y-1">
                  <PaymentStatusBadge status={orderDetails.order.payment_status} />
                  <span className="text-xs text-gray-400">
                    {orderDetails.order.payment_method || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />
            
            <div>
              <h3 className="font-medium mb-3">Order Items</h3>
              <div className="space-y-3">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">
                        {item.quantity} x TZS {item.price.toLocaleString()}
                      </p>
                    </div>
                    <p className="font-medium">TZS {item.subtotal.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="bg-gray-700" />
            
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>TZS {orderDetails.order.total_amount.toLocaleString()}</span>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button className="flex-1" variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button className="flex-1">
                <Receipt className="mr-2 h-4 w-4" />
                View Receipt
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">Could not load order details.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
