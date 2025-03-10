
import React from "react";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface TransactionDateProps {
  date: Date;
}

export const TransactionDate: React.FC<TransactionDateProps> = ({ date }) => {
  return (
    <>
      <div className="flex items-center">
        <Clock size={14} className="mr-1 text-gray-400" />
        <span>{format(date, "MMM d, yyyy")}</span>
      </div>
      <div className="text-xs text-gray-500">{format(date, "h:mm a")}</div>
    </>
  );
};
