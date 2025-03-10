
import React from "react";
import { Clock, Plus, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface Reservation {
  id: string;
  name: string;
  people: number;
  time: string;
  date: string;
  status: string;
  phone: string;
}

interface ReservationsTableProps {
  reservations: Reservation[];
  onCancelReservation?: () => void;
}

export const ReservationsTable = ({ reservations, onCancelReservation }: ReservationsTableProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCancelReservation = async (id: string) => {
    try {
      // Update the order status to 'cancelled' in the database
      const { error } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
      
      // Show success toast
      toast({
        title: "Reservation cancelled",
        description: "The reservation has been successfully cancelled.",
      });
      
      // Call the callback to refresh the dashboard data
      if (onCancelReservation) {
        onCancelReservation();
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast({
        title: "Error",
        description: "Failed to cancel reservation. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleViewAllReservations = () => {
    // Navigate to the reservations page
    navigate('/orders');
  };

  const handleAddNewReservation = () => {
    // Navigate to the reservations page with a query parameter to open the add dialog
    navigate('/orders?action=add');
  };

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold">Today's Reservations</h3>
        <button 
          className="text-blue-600 text-sm flex items-center hover:text-blue-800"
          onClick={handleAddNewReservation}
        >
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
              {reservations.length > 0 ? (
                reservations.map(reservation => (
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
                          : reservation.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                      {reservation.status !== 'cancelled' ? (
                        <button 
                          onClick={() => handleCancelReservation(reservation.id)}
                          className="text-gray-500 hover:text-red-700">
                          Cancel
                        </button>
                      ) : (
                        <span className="text-gray-400">Cancelled</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No reservations found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-center">
          <button 
            className="text-blue-600 hover:text-blue-800 text-sm"
            onClick={handleViewAllReservations}
          >
            View All Reservations
          </button>
        </div>
      </div>
    </div>
  );
};
