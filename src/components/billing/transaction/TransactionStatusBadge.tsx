
import React from "react";
import { Badge } from "@/components/ui/badge";

interface TransactionStatusBadgeProps {
  status: string;
}

export const TransactionStatusBadge: React.FC<TransactionStatusBadgeProps> = ({ status }) => {
  return (
    <Badge variant="outline" className={
      status === "completed" ? "border-green-500 text-green-700 bg-green-50" :
      status === "pending" ? "border-yellow-500 text-yellow-700 bg-yellow-50" :
      status === "refunded" ? "border-red-500 text-red-700 bg-red-50" :
      ""
    }>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};
