
import React from "react";
import { format } from "date-fns";
import { Receipt, Calendar, Clock, User, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { CartItem } from "@/components/pos/types";

interface ReceiptPreviewProps {
  orderId: string;
  customerName: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  date: Date;
}

export const ReceiptPreview = ({ 
  orderId, 
  customerName, 
  items, 
  total, 
  paymentMethod,
  date 
}: ReceiptPreviewProps) => {
  const formattedDate = format(date, "MMM d, yyyy");
  const formattedTime = format(date, "h:mm a");
  
  const formatCurrency = (amount: number): string => {
    return `TZS ${amount.toLocaleString()}`;
  };

  return (
    <Card className="bg-white p-5 border-gray-200 shadow-md max-w-md mx-auto">
      <div className="flex justify-center mb-4">
        <Receipt size={32} className="text-green-500" />
      </div>
      
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Mister Choma</h2>
        <p className="text-sm text-gray-500">123 Main Street, Dar es Salaam</p>
        <p className="text-sm text-gray-500">Tel: +255 123 456 789</p>
      </div>
      
      <div className="flex justify-between items-center mb-4 text-sm text-gray-600 border-b border-dashed border-gray-300 pb-4">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span>{formattedTime}</span>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="flex items-center text-gray-600 mb-2">
          <User size={14} className="mr-2" />
          <span className="font-medium">Customer:</span>
          <span className="ml-2">{customerName || "Guest"}</span>
        </p>
        <p className="flex items-center text-gray-600">
          <ShoppingCart size={14} className="mr-2" />
          <span className="font-medium">Order:</span>
          <span className="ml-2 font-mono">#{orderId.substring(0, 8).toUpperCase()}</span>
        </p>
      </div>
      
      <div className="border-t border-b border-gray-200 py-3 mb-4">
        <h3 className="font-medium text-gray-700 mb-2">Order Items</h3>
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <div>
                <span className="text-gray-800">{item.quantity}x </span>
                <span className="text-gray-600">{item.name}</span>
              </div>
              <span className="text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Subtotal:</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between font-bold text-gray-800">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-3 text-sm text-gray-600">
        <p className="mb-1"><span className="font-medium">Payment Method:</span> {paymentMethod}</p>
        <p className="font-medium mt-4 text-center text-gray-500">Thank you for dining with us!</p>
      </div>
    </Card>
  );
};
