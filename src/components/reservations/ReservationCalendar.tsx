
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, format, isSameDay } from "date-fns";

interface ReservationCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const ReservationCalendar = ({ selectedDate, setSelectedDate }: ReservationCalendarProps) => {
  // Sample data for reservations
  const reservationsByDate = [
    { date: new Date(), count: 24 },
    { date: addDays(new Date(), 1), count: 18 },
    { date: addDays(new Date(), 2), count: 12 },
    { date: addDays(new Date(), 3), count: 8 },
    { date: addDays(new Date(), 4), count: 15 },
    { date: addDays(new Date(), 5), count: 20 },
    { date: addDays(new Date(), 10), count: 5 },
  ];

  // Sample time slots for the selected date
  const timeSlots = [
    { time: '5:00 PM', available: true, reservations: 2 },
    { time: '5:30 PM', available: true, reservations: 1 },
    { time: '6:00 PM', available: true, reservations: 3 },
    { time: '6:30 PM', available: true, reservations: 2 },
    { time: '7:00 PM', available: false, reservations: 8 },
    { time: '7:30 PM', available: false, reservations: 8 },
    { time: '8:00 PM', available: true, reservations: 4 },
    { time: '8:30 PM', available: true, reservations: 1 },
    { time: '9:00 PM', available: true, reservations: 0 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden md:col-span-1">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold">Reservation Calendar</h3>
          <p className="text-sm text-gray-500">Select a date to view reservations</p>
        </div>
        <div className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className={cn("p-2 pointer-events-auto rounded-md")}
            modifiers={{
              busy: reservationsByDate.map(rb => rb.date)
            }}
            modifiersStyles={{
              busy: { fontWeight: 'bold', backgroundColor: '#EFF6FF', color: '#2563EB' }
            }}
            components={{
              DayContent: ({ date }) => {
                const reservationData = reservationsByDate.find(rb => 
                  isSameDay(rb.date, date)
                );
                return (
                  <div className="flex flex-col items-center justify-center w-full h-full">
                    <span>{date.getDate()}</span>
                    {reservationData && (
                      <span className="text-[10px] text-blue-600">{reservationData.count}</span>
                    )}
                  </div>
                );
              }
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden md:col-span-2">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center">
            <h3 className="font-semibold">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h3>
          </div>
          <div className="flex space-x-1">
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronLeft size={20} className="text-gray-500" />
            </button>
            <button className="p-1 rounded hover:bg-gray-100">
              <ChevronRight size={20} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-3 gap-4">
            {timeSlots.map((slot, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${
                  slot.available 
                    ? 'border-gray-200 hover:border-blue-500 cursor-pointer' 
                    : 'border-gray-200 bg-gray-50 opacity-70'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{slot.time}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    slot.available 
                      ? slot.reservations > 5 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {slot.available 
                      ? slot.reservations > 5 
                        ? 'Busy' 
                        : 'Available' 
                      : 'Full'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {slot.reservations} reservation{slot.reservations !== 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
