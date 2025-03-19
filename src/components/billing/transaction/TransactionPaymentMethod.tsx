
import React from "react";
import { CreditCard } from "lucide-react";

interface TransactionPaymentMethodProps {
  method: string;
}

export const TransactionPaymentMethod: React.FC<TransactionPaymentMethodProps> = ({ method }) => {
  return (
    <div className="flex items-center text-xs text-gray-500 mt-1">
      <CreditCard size={12} className="mr-1" />
      <span>{method}</span>
    </div>
  );
};
