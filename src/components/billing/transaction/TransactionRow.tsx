
import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, CreditCard } from "lucide-react";
import { TransactionDate } from "./TransactionDate";
import { TransactionCustomer } from "./TransactionCustomer";
import { TransactionStatusBadge } from "./TransactionStatusBadge";
import { TransactionPaymentMethod } from "./TransactionPaymentMethod";
import { Transaction } from "@/hooks/useTransactions";

interface TransactionRowProps {
  transaction: Transaction;
  onViewReceipt: (transactionId: string) => void;
  onViewDetails?: (transactionId: string) => void;
  onProcessPayment?: (transactionId: string) => void;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({ 
  transaction, 
  onViewReceipt,
  onViewDetails,
  onProcessPayment
}) => {
  const isPending = transaction.status.toLowerCase() === "pending";
  
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
        <div className="flex gap-2">
          {onViewDetails && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
              onClick={() => onViewDetails(transaction.id)}
            >
              <Eye size={14} className="mr-1" />
              Details
            </Button>
          )}
          
          {onProcessPayment && isPending && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-green-600 hover:text-green-800 hover:bg-green-50"
              onClick={() => onProcessPayment(transaction.id)}
            >
              <CreditCard size={14} className="mr-1" />
              Pay
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8"
            onClick={() => onViewReceipt(transaction.id)}
          >
            <Download size={14} className="mr-1" />
            Receipt
          </Button>
        </div>
      </td>
    </tr>
  );
};
