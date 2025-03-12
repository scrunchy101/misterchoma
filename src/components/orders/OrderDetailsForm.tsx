
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface OrderForm {
  customerName: string;
  tableNumber: string;
  status: string;
  paymentStatus: string;
}

interface OrderDetailsFormProps {
  newOrder: OrderForm;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  hasItems: boolean;
  onAddMenuItems: () => void;
}

export const OrderDetailsForm = ({
  newOrder,
  handleInputChange,
  handleSelectChange,
  hasItems,
  onAddMenuItems
}: OrderDetailsFormProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="customerName">Customer Name (optional)</Label>
        <Input
          id="customerName"
          name="customerName"
          value={newOrder.customerName}
          onChange={handleInputChange}
          placeholder="Customer Name"
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="tableNumber">Table Number (optional)</Label>
        <Input
          id="tableNumber"
          name="tableNumber"
          type="number"
          value={newOrder.tableNumber}
          onChange={handleInputChange}
          placeholder="Table Number"
          className="bg-gray-700 border-gray-600 text-white"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Order Status</Label>
        <Select
          value={newOrder.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600 text-white">
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="ready">Ready</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="paymentStatus">Payment Status</Label>
        <Select
          value={newOrder.paymentStatus}
          onValueChange={(value) => handleSelectChange("paymentStatus", value)}
        >
          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
            <SelectValue placeholder="Select payment status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600 text-white">
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {!hasItems && (
        <div className="my-4 p-3 border border-yellow-500 bg-yellow-500/10 text-yellow-300 rounded-md">
          You need to add at least one menu item to create an order. Please go to the Menu Items tab.
        </div>
      )}
      
      <div className="mt-4">
        <Button 
          type="button" 
          onClick={onAddMenuItems}
          variant="outline" 
          className="w-full border-green-500 text-green-400 hover:bg-green-950"
        >
          Add Menu Items →
        </Button>
      </div>
    </div>
  );
};
