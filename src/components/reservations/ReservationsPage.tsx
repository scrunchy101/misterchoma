
import React, { useState } from "react";
import { ReservationStats } from "./ReservationStats";
import { ReservationsList } from "./ReservationsList";
import { ReservationCalendar } from "./ReservationCalendar";
import { format } from "date-fns";

export const ReservationsPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold tracking-tight mb-6">Reservations</h2>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <ReservationStats />
            </div>
            <ReservationsList />
          </div>
        </div>
        <div className="md:w-1/3 bg-white rounded-lg shadow p-4">
          <h3 className="font-medium mb-4">Reservation Calendar</h3>
          <p className="text-sm text-gray-500 mb-6">
            {format(selectedDate, "MMMM yyyy")}
          </p>
          <ReservationCalendar 
            onSelectDate={setSelectedDate} 
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
};
