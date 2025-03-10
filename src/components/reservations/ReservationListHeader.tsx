
import React from "react";
import { Plus } from "lucide-react";
import { ReservationStatusFilter } from "./ReservationStatusFilter";

interface ReservationListHeaderProps {
  statusFilter: "all" | "confirmed" | "pending" | "cancelled";
  setStatusFilter: (status: "all" | "confirmed" | "pending" | "cancelled") => void;
}

export const ReservationListHeader = ({ 
  statusFilter, 
  setStatusFilter 
}: ReservationListHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
      <ReservationStatusFilter 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
      <button className="text-blue-600 text-sm flex items-center hover:text-blue-800">
        <Plus size={16} className="mr-1" />
        Add New Reservation
      </button>
    </div>
  );
};
