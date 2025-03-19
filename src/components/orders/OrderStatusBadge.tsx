
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: string;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "in progress":
      case "inprogress":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "ready":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "cancelled":
        return "bg-red-500/20 text-red-500 border-red-500/50";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/50";
    }
  };

  return (
    <Badge variant="outline" className={cn("font-medium", getStatusStyles())}>
      {status}
    </Badge>
  );
};
