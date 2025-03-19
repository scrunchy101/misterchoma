
import React from "react";
import { Order } from "@/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Eye, Receipt } from "lucide-react";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";

interface OrderRowProps {
  order: Order;
  onViewDetails: (orderId: string) => void;
}

export const OrderRow: React.FC<OrderRowProps> = ({ 
  order,
  onViewDetails
}) => {
  return (
    <TableRow className="hover:bg-gray-800">
      <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
      <TableCell>
        {order.customer}
        {order.table && <span className="text-xs text-gray-400 block">Table {order.table}</span>}
      </TableCell>
      <TableCell>{order.time}</TableCell>
      <TableCell>{order.items}</TableCell>
      <TableCell className="font-medium">TZS {order.total.toLocaleString()}</TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell>
        <PaymentStatusBadge status={order.paymentStatus} />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onViewDetails(order.id)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Details
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
