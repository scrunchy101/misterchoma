
import React from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

interface ReservationDateDisplayProps {
  selectedDate: Date;
  handleDateChange: (date: Date) => void;
}

export const ReservationDateDisplay = ({ 
  selectedDate, 
  handleDateChange 
}: ReservationDateDisplayProps) => {
  return (
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
  );
};
