
import React from "react";
import { User, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerInfoSectionProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
}

export const CustomerInfoSection = ({
  customerName,
  setCustomerName,
  tableNumber,
  setTableNumber
}: CustomerInfoSectionProps) => {
  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center">
          <User size={16} className="mr-2 text-gray-400" />
          <label htmlFor="customer">Customer Name (optional)</label>
        </div>
        <Input 
          id="customer"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Walk-in Customer"
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Hash size={16} className="mr-2 text-gray-400" />
          <label htmlFor="table">Table Number (optional)</label>
        </div>
        <Input 
          id="table"
          type="number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="Table Number"
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
    </>
  );
};
