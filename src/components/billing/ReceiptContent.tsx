
import React from "react";
import { format } from "date-fns";

interface ReceiptContentProps {
  transactionData: {
    id: string;
    date: Date;
    customer: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    paymentMethod: string;
    total: number;
  };
}

export const ReceiptContent: React.FC<ReceiptContentProps> = ({ transactionData }) => {
  return (
    <div className="border border-gray-600 rounded-md p-4 font-mono text-sm bg-gray-900">
      <div className="text-center mb-4">
        <div className="font-bold text-lg text-white">Mama's Restaurant</div>
        <div className="text-xs text-gray-300">123 Main Street, Dar es Salaam</div>
        <div className="text-xs text-gray-300">Tel: +255 123 456 789</div>
        <div className="text-xs mt-2 text-gray-200">{format(transactionData.date, "MMM d, yyyy h:mm a")}</div>
        <div className="text-xs text-gray-200">Customer: {transactionData.customer}</div>
      </div>
      
      <div className="border-t border-b border-dashed border-gray-600 py-2 space-y-1">
        {transactionData.items.map((item, i) => (
          <div key={i} className="flex justify-between text-gray-200">
            <span>{item.quantity} x {item.name}</span>
            <span>TZS {item.price.toLocaleString()}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-right font-bold text-white">
        <div>Total: TZS {transactionData.total.toLocaleString()}</div>
        <div className="text-xs font-normal text-gray-200">Payment Method: {transactionData.paymentMethod}</div>
      </div>
      
      <div className="text-center text-xs mt-4 text-gray-300">
        <div>Thank you for dining with us!</div>
        <div>Please come again</div>
      </div>
    </div>
  );
};
