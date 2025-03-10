
import React from "react";

type ReservationStatus = 'all' | 'confirmed' | 'pending' | 'cancelled';

interface ReservationStatusFilterProps {
  statusFilter: ReservationStatus;
  setStatusFilter: (status: ReservationStatus) => void;
}

export const ReservationStatusFilter = ({ 
  statusFilter, 
  setStatusFilter 
}: ReservationStatusFilterProps) => {
  return (
    <div className="flex space-x-2">
      <button 
        onClick={() => setStatusFilter('all')}
        className={`px-3 py-1 rounded-md text-sm ${
          statusFilter === 'all' 
            ? 'bg-blue-600 text-white' 
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        All
      </button>
      <button 
        onClick={() => setStatusFilter('confirmed')}
        className={`px-3 py-1 rounded-md text-sm ${
          statusFilter === 'confirmed' 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        Confirmed
      </button>
      <button 
        onClick={() => setStatusFilter('pending')}
        className={`px-3 py-1 rounded-md text-sm ${
          statusFilter === 'pending' 
            ? 'bg-yellow-600 text-white' 
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        Pending
      </button>
      <button 
        onClick={() => setStatusFilter('cancelled')}
        className={`px-3 py-1 rounded-md text-sm ${
          statusFilter === 'cancelled' 
            ? 'bg-red-600 text-white' 
            : 'bg-gray-100 text-gray-700'
        }`}
      >
        Cancelled
      </button>
    </div>
  );
};
