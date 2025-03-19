
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, MoreHorizontal, Phone, Star, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface CustomersListProps {
  searchTerm: string;
  refreshTrigger?: number;
}

export const CustomersList = ({ searchTerm, refreshTrigger = 0 }: CustomersListProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setCustomers(data || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
        toast({
          title: "Error",
          description: "Failed to load customers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [refreshTrigger, toast]);

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.phone && customer.phone.includes(searchTerm))
  );

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-6 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded col-span-2"></div>
                  <div className="h-4 bg-gray-200 rounded col-span-1"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold">Customer List</h3>
        <div className="text-sm text-gray-500">Showing {filteredCustomers.length} of {customers.length} customers</div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Contact Info</th>
              <th className="px-4 py-3 font-medium">Details</th>
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
                        <span>Joined {format(new Date(customer.created_at), "MMM yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="mb-1">{customer.email}</p>
                  {customer.phone && (
                    <div className="flex items-center text-gray-500">
                      <Phone size={12} className="mr-1" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  {customer.address && (
                    <div className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Address:</span> {customer.address}
                    </div>
                  )}
                  {customer.notes && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {customer.notes}
                    </div>
                  )}
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
          {customers.length === 0 ? "No customers added yet." : "No customers found matching your search criteria."}
        </div>
      )}
      
      <div className="p-4 border-t border-gray-100 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>
    </div>
  );
};
