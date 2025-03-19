
import React, { useState } from "react";
import { ReservationListHeader } from "./ReservationListHeader";
import { ReservationsTable } from "./ReservationsTable";
import { AddReservationDialog } from "./AddReservationDialog";
import { Reservation, ReservationStatusType } from "./types";
import { format } from "date-fns";

// Sample reservation data with updated types
const sampleReservations: Reservation[] = [
  {
    id: "1",
    customerName: "John Smith",
    phoneNumber: "+255 123 456 789",
    date: new Date(2023, 9, 15, 19, 0),
    partySize: 4,
    tableNumber: 7,
    status: "confirmed",
    notes: "Anniversary dinner"
  },
  {
    id: "2",
    customerName: "Maria Garcia",
    phoneNumber: "+255 987 654 321",
    date: new Date(2023, 9, 15, 20, 30),
    partySize: 2,
    tableNumber: 3,
    status: "confirmed",
    notes: "Window seat requested"
  },
  {
    id: "3",
    customerName: "David Wong",
    phoneNumber: "+255 555 123 456",
    date: new Date(2023, 9, 16, 18, 0),
    partySize: 6,
    tableNumber: 10,
    status: "pending",
    notes: "Birthday celebration"
  },
  {
    id: "4",
    customerName: "Sophia Johnson",
    phoneNumber: "+255 444 789 123",
    date: new Date(2023, 9, 16, 19, 15),
    partySize: 3,
    tableNumber: 5,
    status: "confirmed",
    notes: ""
  },
  {
    id: "5",
    customerName: "James Williams",
    phoneNumber: "+255 777 888 999",
    date: new Date(2023, 9, 17, 20, 0),
    partySize: 2,
    tableNumber: 2,
    status: "cancelled",
    notes: "Cancelled due to illness"
  }
];

export const ReservationsList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<ReservationStatusType>("all");
  
  // In a real app, this would be fetched from an API
  const reservations = sampleReservations;
  
  // Apply status filter
  const filteredReservations = statusFilter !== "all"
    ? reservations.filter(res => res.status === statusFilter)
    : reservations;
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <ReservationListHeader 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddReservation={() => setIsOpen(true)}
      />
      
      <ReservationsTable reservations={filteredReservations} />
      
      <AddReservationDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSuccess={() => {
          console.log("Reservation added successfully");
          // Here we would refetch reservations
        }}
        onAddReservation={(data) => {
          console.log("Add reservation:", data);
          setIsOpen(false);
          // Here we would add the reservation to the database
        }}
      />
    </div>
  );
};
