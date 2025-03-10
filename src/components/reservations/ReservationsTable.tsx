
import React from "react";
import { ReservationRow } from "./ReservationRow";
import { Reservation } from "./types";

interface ReservationsTableProps {
  reservations: Reservation[];
}

export const ReservationsTable = ({ reservations }: ReservationsTableProps) => {
  if (reservations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reservations found for the selected date and filter.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b">
            <th className="pb-3 font-medium">Guest</th>
            <th className="pb-3 font-medium">Time</th>
            <th className="pb-3 font-medium">Party Size</th>
            <th className="pb-3 font-medium">Table</th>
            <th className="pb-3 font-medium">Status</th>
            <th className="pb-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(reservation => (
            <ReservationRow key={reservation.id} reservation={reservation} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
