
import React from "react";
import { Clock, Plus, Users } from "lucide-react";

interface Reservation {
  id: number;
  name: string;
  people: number;
  time: string;
  date: string;
  status: string;
  phone: string;
}

interface ReservationsTableProps {
  reservations: Reservation[];
}

export const ReservationsTable = ({ reservations }: ReservationsTableProps) => {
  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold">Today's Reservations</h3>
        <button className="text-blue-600 text-sm flex items-center hover:text-blue-800">
          <Plus size={16} className="mr-1" />
          Add New
        </button>
      </div>
      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 font-medium">Guest</th>
                <th className="pb-3 font-medium">Time</th>
                <th className="pb-3 font-medium">Party Size</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(reservation => (
                <tr key={reservation.id} className="border-b border-gray-100">
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
                    <div className="text-xs text-gray-500">{reservation.date}</div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <Users size={14} className="mr-1 text-gray-400" />
                      <span>{reservation.people} people</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      reservation.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                    <button className="text-gray-500 hover:text-gray-700">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm">View All Reservations</button>
        </div>
      </div>
    </div>
  );
};
