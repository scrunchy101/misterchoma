
import React from "react";
import { Plus } from "lucide-react";
import { ReservationStatusFilter } from "./ReservationStatusFilter";
import { ReservationStatusType } from "./types";

interface ReservationListHeaderProps {
  statusFilter: ReservationStatusType;
  setStatusFilter: (status: ReservationStatusType) => void;
  onAddReservation: () => void;
  onStatusFilterChange?: (status: string) => void;
  currentStatusFilter?: string | null;
}

export const ReservationListHeader = ({ 
  statusFilter, 
  setStatusFilter,
  onAddReservation,
  onStatusFilterChange,
  currentStatusFilter
}: ReservationListHeaderProps) => {
  // Use the function from props if available, otherwise fall back to the original
  const handleStatusChange = (status: ReservationStatusType) => {
    setStatusFilter(status);
    if (onStatusFilterChange) {
      onStatusFilterChange(status);
    }
  };

  return (
    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
      <ReservationStatusFilter 
        statusFilter={statusFilter} 
        setStatusFilter={handleStatusChange} 
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
