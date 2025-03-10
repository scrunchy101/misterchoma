
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, List, Clock, TableRestaurant, Bell } from "lucide-react";

export const POSTopBar = () => {
  return (
    <div className="bg-white p-3 border-b border-gray-200 flex items-center justify-between">
      <div className="flex space-x-2">
        <Button className="bg-green-500 hover:bg-green-600">
          <PlusCircle size={16} className="mr-2" />
          New Order
        </Button>
        <Button variant="outline" className="border-gray-200">
          <List size={16} className="mr-2" />
          Orders
        </Button>
        <Button variant="outline" className="border-gray-200">
          <Clock size={16} className="mr-2" />
          Pending
        </Button>
        <Button variant="outline" className="border-gray-200">
          <TableRestaurant size={16} className="mr-2" />
          Tables
        </Button>
      </div>
      <Button variant="outline" className="border-gray-200">
        <Bell size={16} className="mr-2" />
        Notifications
      </Button>
    </div>
  );
};
