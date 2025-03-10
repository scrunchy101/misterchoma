
import React from "react";
import { Check, Clock, Edit, Trash, Users, X } from "lucide-react";
import { Reservation } from "./types";

interface ReservationRowProps {
  reservation: Reservation;
}

export const ReservationRow = ({ reservation }: ReservationRowProps) => {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-3">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold mr-2">
            {reservation.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{reservation.name}</p>
            <p className="text-gray-500 text-xs">{reservation.phone}</p>
          </div>
        </div>
      </td>
      <td className="py-3">
        <div className="flex items-center">
          <Clock size={14} className="mr-1 text-gray-400" />
          <span>{reservation.time}</span>
        </div>
      </td>
      <td className="py-3">
        <div className="flex items-center">
          <Users size={14} className="mr-1 text-gray-400" />
          <span>{reservation.people} people</span>
        </div>
      </td>
      <td className="py-3">
        {reservation.tableNumber ? (
          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
            Table {reservation.tableNumber}
          </span>
        ) : (
          <span className="text-gray-400">Not assigned</span>
        )}
      </td>
      <td className="py-3">
        <span className={`px-2 py-1 rounded-full text-xs ${
          reservation.status === 'confirmed' 
            ? 'bg-green-100 text-green-800' 
            : reservation.status === 'pending'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {reservation.status}
        </span>
      </td>
      <td className="py-3">
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-100">
            <Edit size={16} className="text-blue-600" />
          </button>
          {reservation.status === 'pending' && (
            <button className="p-1 rounded hover:bg-gray-100">
              <Check size={16} className="text-green-600" />
            </button>
          )}
          {reservation.status !== 'cancelled' && (
            <button className="p-1 rounded hover:bg-gray-100">
              <X size={16} className="text-red-600" />
            </button>
          )}
          <button className="p-1 rounded hover:bg-gray-100">
            <Trash size={16} className="text-gray-500" />
          </button>
        </div>
      </td>
    </tr>
  );
};
