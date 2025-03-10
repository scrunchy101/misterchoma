
export interface Reservation {
  id: string;
  name: string;
  people: number;
  time: string;
  date: string;
  status: "confirmed" | "pending" | "cancelled";
  phone: string;
  email?: string;
  notes?: string;
  tableNumber?: number;
}
