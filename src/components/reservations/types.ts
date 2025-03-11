
export interface Reservation {
  id: string;
  customerName: string;
  phoneNumber: string;
  date: Date;
  partySize: number;
  tableNumber: number | null;
  status: "confirmed" | "pending" | "cancelled";
  notes: string;
}

// Define reservation status type to avoid circular imports
export type ReservationStatusType = "all" | "confirmed" | "pending" | "cancelled";
