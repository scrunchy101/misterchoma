
import React from "react";
import { OrderTypeSelector } from "../order/OrderTypeSelector";
import { CustomerInput } from "../order/CustomerInput";
import { OrderTiming } from "../order/OrderTiming";
import { POSCart } from "../POSCart";

interface CartSectionProps {
  orderType: 'delivery' | 'dine-in' | 'pickup';
  setOrderType: (type: 'delivery' | 'dine-in' | 'pickup') => void;
  customerName: string;
  setCustomerName: (name: string) => void;
}

export const CartSection = ({ 
  orderType, 
  setOrderType, 
  customerName, 
  setCustomerName 
}: CartSectionProps) => {
  return (
    <div className="w-1/3 bg-white p-4 overflow-y-auto border-l border-gray-200 flex flex-col">
      {/* Order Type Selector */}
      <OrderTypeSelector orderType={orderType} setOrderType={setOrderType} />
      
      {/* Customer Input */}
      <CustomerInput customerName={customerName} setCustomerName={setCustomerName} />
      
      {/* Order Timing */}
      <OrderTiming />
      
      {/* Cart Items */}
      <POSCart orderType={orderType} customerName={customerName} />
    </div>
  );
};
