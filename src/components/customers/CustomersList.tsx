
import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, MoreHorizontal, Phone, Star, User } from "lucide-react";

interface CustomersListProps {
  searchTerm: string;
}

export const CustomersList = ({ searchTerm }: CustomersListProps) => {
  // Sample customer data
  const customerData = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "(555) 123-4567",
      joinDate: new Date(2022, 5, 15),
      visits: 18,
      lastVisit: new Date(2023, 7, 28),
      avgSpend: "$95",
      preferences: ["Booth seating", "Wine enthusiast", "Seafood"],
      tags: ["VIP", "Wine Club"],
      birthdate: new Date(1988, 3, 12)
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "mchen@example.com",
      phone: "(555) 987-6543",
      joinDate: new Date(2021, 2, 8),
      visits: 42,
      lastVisit: new Date(2023, 8, 2),
      avgSpend: "$120",
      preferences: ["Window table", "Whiskey connoisseur", "Steak medium-rare"],
      tags: ["VIP", "Loyalty Program"],
      birthdate: new Date(1975, 11, 3)
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma.d@example.com",
      phone: "(555) 456-7890",
      joinDate: new Date(2023, 1, 20),
      visits: 5,
      lastVisit: new Date(2023, 7, 15),
      avgSpend: "$65",
      preferences: ["Vegetarian", "Allergic to nuts", "Prefers quiet area"],
      tags: ["New Customer"],
      birthdate: new Date(1992, 8, 28)
    },
    {
      id: 4,
      name: "James Wilson",
      email: "jwilson@example.com",
      phone: "(555) 789-0123",
      joinDate: new Date(2020, 10, 5),
      visits: 32,
      lastVisit: new Date(2023, 8, 1),
      avgSpend: "$110",
      preferences: ["Bar seating", "Beer enthusiast", "Spicy food"],
      tags: ["Loyalty Program"],
      birthdate: new Date(1983, 6, 17)
    },
    {
      id: 5,
      name: "Lisa Rodriguez",
      email: "lrodriguez@example.com",
      phone: "(555) 234-5678",
      joinDate: new Date(2021, 7, 12),
      visits: 28,
      lastVisit: new Date(2023, 8, 5),
      avgSpend: "$85",
      preferences: ["Outdoor seating", "Pescatarian", "Dessert lover"],
      tags: ["VIP", "Birthday This Month"],
      birthdate: new Date(1990, 8, 21)
    }
  ];

  // Filter customers based on search term
  const filteredCustomers = customerData.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold">Customer List</h3>
        <div className="text-sm text-gray-500">Showing {filteredCustomers.length} of {customerData.length} customers</div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact Info</th>
              <th className="px-4 py-3 font-medium">Activity</th>
              <th className="px-4 py-3 font-medium">Preferences</th>
              <th className="px-4 py-3 font-medium">Tags</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        <span>Joined {format(customer.joinDate, "MMM yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="mb-1">{customer.email}</p>
                  <div className="flex items-center text-gray-500">
                    <Phone size={12} className="mr-1" />
                    <span>{customer.phone}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="mb-1 flex items-center">
                    <User size={12} className="mr-1 text-gray-500" />
                    <span>{customer.visits} visits</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    Last: {format(customer.lastVisit, "MMM d, yyyy")}
                  </div>
                  <div className="font-medium">{customer.avgSpend}/visit</div>
                </td>
                <td className="px-4 py-4">
                  <div className="max-w-[200px]">
                    {customer.preferences.map((pref, i) => (
                      <div key={i} className="text-xs mb-1 last:mb-0 truncate">• {pref}</div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {customer.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className={
                        tag === "VIP" ? "border-yellow-500 text-yellow-700 bg-yellow-50" :
                        tag === "Loyalty Program" ? "border-blue-500 text-blue-700 bg-blue-50" :
                        tag === "New Customer" ? "border-green-500 text-green-700 bg-green-50" :
                        tag === "Birthday This Month" ? "border-purple-500 text-purple-700 bg-purple-50" :
                        ""
                      }>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <Edit size={14} />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-2">
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredCustomers.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No customers found matching your search criteria.
        </div>
      )}
      
      <div className="p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredCustomers.length} of {customerData.length} customers
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" disabled>Next</Button>
        </div>
      </div>
    </div>
  );
};
