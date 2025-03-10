import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ReservationListHeader } from "./ReservationListHeader";
import { ReservationDateDisplay } from "./ReservationDateDisplay";
import { ReservationsTable } from "./ReservationsTable";
import { Reservation } from "./types";

interface ReservationsListProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

// Define a basic type for the database response
interface OrderRecord {
  id: string;
  customer_name: string | null;
  table_number: number | null;
  created_at: string | null;
  status: string | null;
}

export const ReservationsList = ({ selectedDate, setSelectedDate }: ReservationsListProps) => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "confirmed" | "pending" | "cancelled">('all');
  const { toast } = useToast();
  
  useEffect(() => {
    fetchReservations();
  }, [selectedDate]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Using a more basic approach to avoid type issues
      const response = await supabase
        .from('orders')
        .select('id, customer_name, table_number, created_at, status')
        .eq('created_at::date', formattedDate);

      if (response.error) throw response.error;
      
      const formattedReservations: Reservation[] = [];
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        // Process each item manually without relying on complex types
        response.data.forEach((item: any) => {
          const orderDate = item.created_at ? new Date(item.created_at) : new Date();
          
          formattedReservations.push({
            id: item.id,
            name: item.customer_name ?? 'Guest',
            people: item.table_number ?? 2,
            time: orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: format(orderDate, 'yyyy-MM-dd'),
            status: (item.status as "confirmed" | "pending" | "cancelled") ?? 'pending',
            phone: "(No phone on record)",
            tableNumber: item.table_number ?? undefined
          });
        });
      }
      
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
  
  const filteredReservations = statusFilter === 'all' 
    ? reservations 
    : reservations.filter(res => res.status === statusFilter);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <ReservationListHeader 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
      />
      
      <ReservationDateDisplay 
        selectedDate={selectedDate} 
        handleDateChange={handleDateChange}
      />

      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading reservations...</p>
          </div>
        ) : (
          <ReservationsTable reservations={filteredReservations} />
        )}
      </div>
    </div>
  );
};
