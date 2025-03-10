
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

// Define a simpler type just with the fields we need
type OrderRow = {
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
      
      // Use a simple select query with explicit type casting
      const { data, error } = await supabase
        .from('orders')
        .select('id, customer_name, table_number, created_at, status')
        .eq('created_at::date', formattedDate);

      if (error) throw error;

      // Create a new array without relying on complex type inference
      const orderRows = data as any[] || [];
      
      // Map the data with explicit typing to avoid deep instantiation
      const formattedReservations: Reservation[] = [];
      
      for (const order of orderRows) {
        const orderDate = order.created_at ? new Date(order.created_at) : new Date();
        
        formattedReservations.push({
          id: order.id,
          name: order.customer_name ?? 'Guest',
          people: order.table_number ?? 2,
          time: orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: format(orderDate, 'yyyy-MM-dd'),
          status: (order.status as "confirmed" | "pending" | "cancelled") ?? 'pending',
          phone: "(No phone on record)",
          tableNumber: order.table_number ?? undefined
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
