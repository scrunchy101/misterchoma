
import React from "react";
import { format } from "date-fns";
import { CartItem } from "@/hooks/usePOSSystem";

interface ReceiptProps {
  transaction: {
    id: string;
    date: Date;
    customer: string;
    items: CartItem[];
    total: number;
    paymentMethod: string;
    employeeName?: string;
  };
}

export const Receipt: React.FC<ReceiptProps> = ({ transaction }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 font-mono text-sm">
      <div className="text-center mb-3">
        <div className="font-bold text-lg">Mister Choma</div>
        <div className="text-xs text-gray-400">Receipt #{transaction.id.substring(0, 8)}</div>
        <div className="text-xs text-gray-400">{format(transaction.date, 'PPP p')}</div>
      </div>
      
      <div className="border-t border-b border-gray-700 py-2 my-2">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Customer:</span>
          <span>{transaction.customer}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Payment Method:</span>
          <span>{transaction.paymentMethod}</span>
        </div>
        {transaction.employeeName && (
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Served by:</span>
            <span>{transaction.employeeName}</span>
          </div>
        )}
      </div>
      
      <div className="border-b border-gray-700 py-2">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-gray-400">
              <th className="text-left">Item</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Price</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {transaction.items.map((item, i) => (
              <tr key={i} className="border-t border-gray-800">
                <td className="py-1">{item.name}</td>
                <td className="text-center">{item.quantity}</td>
                <td className="text-right">{item.price.toLocaleString()}</td>
                <td className="text-right">{(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="py-2 text-right">
        <div className="flex justify-between font-bold">
          <span>TOTAL:</span>
          <span>TZS {transaction.total.toLocaleString()}</span>
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-400 mt-3">
        <div>Thank you for your business!</div>
      </div>
    </div>
  );
};
