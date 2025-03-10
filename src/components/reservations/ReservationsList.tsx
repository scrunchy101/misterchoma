
import React, { useState, useEffect } from "react";
import { Calendar, Check, Clock, Edit, Plus, Trash, Users, X } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Reservation types
interface Reservation {
  id: string;
  name: string;
  people: number;
  time: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  phone: string;
  email?: string;
  notes?: string;
  tableNumber?: number;
}

interface ReservationsListProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const ReservationsList = ({ selectedDate, setSelectedDate }: ReservationsListProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  
  useEffect(() => {
    fetchReservations();
  }, [selectedDate]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      // Format the selected date for the query
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Fetch orders for the selected date
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('created_at::date', formattedDate);

      if (error) throw error;
      
      // Transform orders into reservation format
      const formattedReservations: Reservation[] = (data || []).map(order => ({
        id: order.id,
        name: order.customer_name || 'Guest',
        people: order.table_number || 2,
        time: new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: format(new Date(order.created_at), 'yyyy-MM-dd'),
        status: (order.status || 'pending') as "confirmed" | "pending" | "cancelled",
        phone: "(No phone on record)",
        tableNumber: order.table_number
      }));
      
      setReservations(formattedReservations);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast({
        title: "Error",
        description: "Failed to load reservations data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Simple direct filtering to fix excessive type instantiation
  const filteredReservations = statusFilter === 'all' 
    ? reservations 
    : reservations.filter(reservation => reservation.status === statusFilter);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
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
        <button className="text-blue-600 text-sm flex items-center hover:text-blue-800">
          <Plus size={16} className="mr-1" />
          Add New Reservation
        </button>
      </div>

      <div className="flex border-b border-gray-100 p-4 items-center justify-between bg-gray-50">
        <div className="flex items-center">
          <Calendar size={18} className="text-blue-500 mr-2" />
          <span className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleDateChange(new Date())}
            className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md"
          >
            Today
          </button>
          <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md">
            <Calendar size={14} className="inline mr-1" />
            Select Date
          </button>
        </div>
      </div>

      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading reservations...</p>
          </div>
        ) : (
          <>
            {filteredReservations.length > 0 ? (
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
                    {filteredReservations.map(reservation => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reservations found for the selected date and filter.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
