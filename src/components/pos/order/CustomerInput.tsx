
import React from "react";

interface CustomerInputProps {
  customerName: string;
  setCustomerName: (name: string) => void;
}

export const CustomerInput = ({ customerName, setCustomerName }: CustomerInputProps) => {
  return (
    <div className="flex mb-4">
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Walk-in Customer"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border border-gray-300 rounded-l py-2 px-3"
        />
        {customerName && (
          <button 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setCustomerName('')}
          >
            ×
          </button>
        )}
      </div>
      <button className="bg-green-500 text-white px-4 rounded-r border border-green-500 flex items-center justify-center">
        +&nbsp;Customer
      </button>
    </div>
  );
};
