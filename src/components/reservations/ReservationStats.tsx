
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ReservationStatsProps {
  selectedDate: Date;
}

export const ReservationStats = ({ selectedDate }: ReservationStatsProps) => {
  const [totalReservations, setTotalReservations] = useState(0);
  const [pendingReservations, setPendingReservations] = useState(0);
  const [confirmedReservations, setConfirmedReservations] = useState(0);
  const [peakHour, setPeakHour] = useState("N/A");
  const [peakCount, setPeakCount] = useState(0);

  useEffect(() => {
    fetchReservationStats();
  }, [selectedDate]);

  const fetchReservationStats = async () => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      // Get all reservations for the selected date
      const { data: reservations, error } = await supabase
        .from('orders')
        .select('created_at, status')
        .eq('created_at::date', formattedDate);

      if (error) throw error;

      if (reservations && reservations.length > 0) {
        // Count total, pending, and confirmed reservations
        setTotalReservations(reservations.length);
        setPendingReservations(reservations.filter(r => r.status === 'pending').length);
        setConfirmedReservations(reservations.filter(r => r.status === 'confirmed').length);

        // Calculate peak hour
        const hourCounts: Record<string, number> = {};
        
        reservations.forEach(reservation => {
          if (reservation.created_at) {
            const hour = new Date(reservation.created_at).getHours();
            const hourStr = `${hour}:00`;
            hourCounts[hourStr] = (hourCounts[hourStr] || 0) + 1;
          }
        });

        // Find the peak hour
        let maxHour = "N/A";
        let maxCount = 0;
        
        for (const [hour, count] of Object.entries(hourCounts)) {
          if (count > maxCount) {
            maxHour = hour;
            maxCount = count;
          }
        }

        setPeakHour(maxHour);
        setPeakCount(maxCount);
      } else {
        // Reset stats if no reservations found
        setTotalReservations(0);
        setPendingReservations(0);
        setConfirmedReservations(0);
        setPeakHour("N/A");
        setPeakCount(0);
      }
    } catch (error) {
      console.error("Error fetching reservation stats:", error);
      // Reset stats on error
      setTotalReservations(0);
      setPendingReservations(0);
      setConfirmedReservations(0);
      setPeakHour("N/A");
      setPeakCount(0);
    }
  };

  const stats = [
    { 
      icon: <Calendar size={20} className="text-blue-500" />, 
      label: "Date", 
      value: format(selectedDate, "MMMM d, yyyy"),
      subtitle: "Selected booking date" 
    },
    { 
      icon: <Users size={20} className="text-green-500" />, 
      label: "Reservations", 
      value: totalReservations.toString(),
      subtitle: `${pendingReservations} pending, ${confirmedReservations} confirmed` 
    },
    { 
      icon: <Clock size={20} className="text-purple-500" />, 
      label: "Peak Hours", 
      value: peakHour,
      subtitle: `${peakCount} bookings during peak` 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gray-50 mr-4">
              {stat.icon}
            </div>
            <div>
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="font-bold text-xl">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.subtitle}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
