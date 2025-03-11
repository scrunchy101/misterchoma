
import React from "react";
import { TransactionRow } from "./TransactionRow";
import { Transaction } from "@/hooks/useTransactions";

interface TransactionTableProps {
  transactions: Transaction[];
  onViewReceipt: (transactionId: string) => void;
  onViewDetails?: (transactionId: string) => void;
  onProcessPayment?: (transactionId: string) => void;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ 
  transactions, 
  onViewReceipt,
  onViewDetails,
  onProcessPayment
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left bg-gray-50">
            <th className="px-4 py-3 font-medium">Transaction ID</th>
            <th className="px-4 py-3 font-medium">Date & Time</th>
            <th className="px-4 py-3 font-medium">Customer</th>
            <th className="px-4 py-3 font-medium">Amount</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <TransactionRow 
              key={transaction.id} 
              transaction={transaction} 
              onViewReceipt={onViewReceipt}
              onViewDetails={onViewDetails}
              onProcessPayment={onProcessPayment}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
