
import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export const InvoicesList = () => {
  // Sample invoice data
  const invoices = [
    {
      id: "INV-2023-001",
      date: new Date(2023, 7, 1),
      dueDate: new Date(2023, 7, 15),
      customer: "Corporate Event Inc.",
      amount: 1850.00,
      status: "paid"
    },
    {
      id: "INV-2023-002",
      date: new Date(2023, 7, 5),
      dueDate: new Date(2023, 7, 19),
      customer: "Johnson Wedding",
      amount: 3200.00,
      status: "paid"
    },
    {
      id: "INV-2023-003",
      date: new Date(2023, 7, 10),
      dueDate: new Date(2023, 7, 24),
      customer: "Chen Birthday Party",
      amount: 950.00,
      status: "pending"
    },
    {
      id: "INV-2023-004",
      date: new Date(2023, 7, 15),
      dueDate: new Date(2023, 7, 29),
      customer: "Miller Anniversary",
      amount: 1200.00,
      status: "pending"
    },
    {
      id: "INV-2023-005",
      date: new Date(2023, 7, 20),
      dueDate: new Date(2023, 8, 3),
      customer: "Tech Startup Meetup",
      amount: 750.00,
      status: "pending"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold">Recent Invoices</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {invoices.map(invoice => (
          <div key={invoice.id} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium">{invoice.id}</div>
                <div className="text-sm text-gray-500">{invoice.customer}</div>
              </div>
              <Badge variant="outline" className={
                invoice.status === "paid" ? "border-green-500 text-green-700 bg-green-50" :
                invoice.status === "pending" ? "border-yellow-500 text-yellow-700 bg-yellow-50" :
                invoice.status === "overdue" ? "border-red-500 text-red-700 bg-red-50" :
                ""
              }>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
            </div>
            
            <div className="flex justify-between mb-3">
              <div className="text-sm">
                <div className="text-gray-500">Date:</div>
                <div>{format(invoice.date, "MMM d, yyyy")}</div>
              </div>
              <div className="text-sm">
                <div className="text-gray-500">Due Date:</div>
                <div>{format(invoice.dueDate, "MMM d, yyyy")}</div>
              </div>
              <div className="text-sm font-medium">
                <div className="text-gray-500">Amount:</div>
                <div>${invoice.amount.toFixed(2)}</div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" className="w-full">
              <FileText size={14} className="mr-1" />
              View Invoice
            </Button>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-100 text-center">
        <Button className="w-full">
          <Download size={14} className="mr-1" />
          Download All Invoices
        </Button>
      </div>
    </div>
  );
};
