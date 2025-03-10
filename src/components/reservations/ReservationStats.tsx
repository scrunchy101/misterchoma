
import React from "react";
import { format } from "date-fns";
import { Calendar, Clock, Users } from "lucide-react";

interface ReservationStatsProps {
  selectedDate: Date;
}

export const ReservationStats = ({ selectedDate }: ReservationStatsProps) => {
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
      value: "0",
      subtitle: "0 pending, 0 confirmed" 
    },
    { 
      icon: <Clock size={20} className="text-purple-500" />, 
      label: "Peak Hours", 
      value: "N/A",
      subtitle: "0 bookings during peak" 
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
