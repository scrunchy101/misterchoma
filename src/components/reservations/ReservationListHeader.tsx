
import React from "react";
import { Plus } from "lucide-react";
import { ReservationStatusFilter } from "./ReservationStatusFilter";
import { ReservationStatusType } from "./types";

interface ReservationListHeaderProps {
  statusFilter: ReservationStatusType;
  setStatusFilter: (status: ReservationStatusType) => void;
  onAddReservation: () => void;
}

export const ReservationListHeader = ({ 
  statusFilter, 
  setStatusFilter,
  onAddReservation
}: ReservationListHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
      <ReservationStatusFilter 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
      <button 
        className="text-blue-600 text-sm flex items-center hover:text-blue-800"
        onClick={onAddReservation}
      >
        <Plus size={16} className="mr-1" />
        Add New Reservation
      </button>
    </div>
  );
};
