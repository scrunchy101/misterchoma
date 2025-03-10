
import React from "react";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users, Utensils } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ReservationStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["reservationStats"],
    queryFn: async () => {
      // Note: This is a placeholder. The 'reservations' table does not exist yet
      // and should be created before this component can be used properly.
      // For now, returning mock data to avoid TypeScript errors
      
      // Instead of:
      // const { data, error } = await supabase.from("reservations").select("*");
      
      return {
        totalReservations: 42,
        upcomingReservations: 12,
        averagePartySize: 4,
      };
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Reservations",
      value: data?.totalReservations || 0,
      icon: <CalendarDays className="h-4 w-4" />,
      color: "bg-blue-500"
    },
    {
      title: "Upcoming Reservations",
      value: data?.upcomingReservations || 0,
      icon: <Users className="h-4 w-4" />,
      color: "bg-green-500"
    },
    {
      title: "Average Party Size",
      value: data?.averagePartySize || 0,
      icon: <Utensils className="h-4 w-4" />,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
            <Badge className={`${stat.color} text-white`}>
              {stat.icon}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
