
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PaymentStatusBadgeProps {
  status: string;
}

export const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.toLowerCase()) {
      case "completed":
      case "paid":
        return "bg-green-500/20 text-green-500 border-green-500/50";
      case "processing":
        return "bg-blue-500/20 text-blue-500 border-blue-500/50";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50";
      case "failed":
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
