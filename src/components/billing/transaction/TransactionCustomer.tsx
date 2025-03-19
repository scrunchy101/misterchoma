
import React from "react";
import { Users } from "lucide-react";

interface TransactionCustomerProps {
  name: string;
  items: number;
}

export const TransactionCustomer: React.FC<TransactionCustomerProps> = ({ name, items }) => {
  return (
    <>
      <div>{name}</div>
      <div className="flex items-center text-xs text-gray-500">
        <Users size={12} className="mr-1" />
        <span>{items} items</span>
      </div>
    </>
  );
};
