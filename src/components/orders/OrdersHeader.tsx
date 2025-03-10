
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrdersHeaderProps {
  onNewOrder: () => void;
}

export const OrdersHeader = ({ onNewOrder }: OrdersHeaderProps) => {
  return (
    <div className="flex justify-between mb-6">
      <h2 className="text-xl font-semibold">Orders</h2>
      <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={onNewOrder}>
        <Plus size={16} className="mr-2" />
        New Order
      </Button>
    </div>
  );
};

