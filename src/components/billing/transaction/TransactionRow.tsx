
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { TransactionDate } from "./TransactionDate";
import { TransactionCustomer } from "./TransactionCustomer";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { TransactionPaymentMethod } from "./TransactionPaymentMethod";

interface Transaction {
  id: string;
  date: Date;
  customer: string;
  amount: number;
  items: number;
  paymentMethod: string;
  status: string;
}

interface TransactionRowProps {
  transaction: Transaction;
  onViewReceipt: (transactionId: string) => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ 
  transaction, 
  onViewReceipt 
}) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3 font-medium">{transaction.id}</td>
      <td className="px-4 py-3">
        <TransactionDate date={transaction.date} />
      </td>
      <td className="px-4 py-3">
        <TransactionCustomer name={transaction.customer} items={transaction.items} />
      </td>
      <td className="px-4 py-3 font-medium">TZS {transaction.amount.toLocaleString()}</td>
      <td className="px-4 py-3">
        <TransactionStatusBadge status={transaction.status} />
        <TransactionPaymentMethod method={transaction.paymentMethod} />
      </td>
      <td className="px-4 py-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8"
          onClick={() => onViewReceipt(transaction.id)}
        >
          <Download size={14} className="mr-1" />
          Receipt
        </Button>
      </td>
    </tr>
  );
};
