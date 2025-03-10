
import React from "react";

type OrderType = 'delivery' | 'dine-in' | 'pickup';

interface OrderTypeSelectorProps {
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
}

export const OrderTypeSelector = ({ orderType, setOrderType }: OrderTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      <button 
        className={`px-4 py-2 text-center rounded ${orderType === 'delivery' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setOrderType('delivery')}
      >
        Delivery
      </button>
      <button 
        className={`px-4 py-2 text-center rounded ${orderType === 'dine-in' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setOrderType('dine-in')}
      >
        Dine-in
      </button>
      <button 
        className={`px-4 py-2 text-center rounded ${orderType === 'pickup' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        onClick={() => setOrderType('pickup')}
      >
        Pickup
      </button>
    </div>
  );
};
