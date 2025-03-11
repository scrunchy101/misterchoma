
import React from "react";
import { User, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CustomerInfoSectionProps {
  customerName?: string;
  setCustomerName?: (name: string) => void;
  tableNumber: string | null;
  setTableNumber: (table: string | null) => void;
  errors?: {
    customerName?: string;
    tableNumber?: string;
  };
}

export const CustomerInfoSection = ({
  customerName = "",
  setCustomerName = () => {},
  tableNumber,
  setTableNumber,
  errors = {}
}: CustomerInfoSectionProps) => {
  const handleTableNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTableNumber(value || null);
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center">
          <User size={16} className="mr-2 text-gray-400" />
          <label htmlFor="customer" className="text-white">Customer Name (optional)</label>
        </div>
        <div className="space-y-1">
          <Input 
            id="customer"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Walk-in Customer"
            className={cn(
              "bg-gray-800 border-gray-700 text-white placeholder-gray-500",
              errors.customerName && "border-red-500"
            )}
          />
          {errors.customerName && (
            <p className="text-sm text-red-500">{errors.customerName}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <Hash size={16} className="mr-2 text-gray-400" />
          <label htmlFor="table" className="text-white">Table Number (optional)</label>
        </div>
        <div className="space-y-1">
          <Input 
            id="table"
            type="text"
            value={tableNumber === null ? "" : tableNumber}
            onChange={handleTableNumberChange}
            placeholder="Table Number"
            className={cn(
              "bg-gray-800 border-gray-700 text-white placeholder-gray-500",
              errors.tableNumber && "border-red-500"
            )}
          />
          {errors.tableNumber && (
            <p className="text-sm text-red-500">{errors.tableNumber}</p>
          )}
        </div>
      </div>
    </>
  );
};
