
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { ReservationDateDisplay } from "./ReservationDateDisplay";

interface ReservationCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const ReservationCalendar: React.FC<ReservationCalendarProps> = ({ 
  selectedDate, 
  onSelectDate 
}) => {
  return (
    <div>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onSelectDate(date)}
        className="rounded-md border"
      />
      <div className="mt-6">
        <ReservationDateDisplay date={selectedDate} />
      </div>
    </div>
  );
};
