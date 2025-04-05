
import React, { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit, MoreHorizontal, Phone, Star, User, DollarSign, ShoppingBag } from "lucide-react";
import { useCustomers, Customer } from "@/hooks/useCustomers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";

interface CustomersListProps {
  searchTerm: string;
  refreshTrigger?: number;
}

export const CustomersList = ({ searchTerm, refreshTrigger = 0 }: CustomersListProps) => {
  const { data: customers = [], isLoading, isError } = useCustomers(searchTerm);
  const { toast } = useToast();
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleDelete = async (customer: Customer) => {
    toast({
      title: "Not implemented",
      description: `Delete functionality for ${customer.name} would go here`,
    });
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortField === "order_count") {
      const countA = a.order_count || 0;
      const countB = b.order_count || 0;
      return sortDirection === "asc" ? countA - countB : countB - countA;
    } else if (sortField === "total_spent") {
      const spentA = a.total_spent || 0;
      const spentB = b.total_spent || 0;
      return sortDirection === "asc" ? spentA - spentB : spentB - spentA;
    } else { // created_at
      return sortDirection === "asc" 
        ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() 
        : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  if (isLoading) {
    return (
      <Card className="p-8 shadow-md">
        <div className="flex justify-center">
          <div className="animate-pulse flex space-x-4 w-full">
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
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="p-8 shadow-md">
        <div className="text-center text-red-500">
          <p className="font-semibold">Error loading customers</p>
          <p className="text-sm mt-1">Please try refreshing the page</p>
        </div>
      </Card>
    );
  }

  // Filter customers based on search term
  const filteredCustomers = sortedCustomers;

  return (
    <Card className="shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <h3 className="font-semibold text-gray-800">Customer List</h3>
        <div className="text-sm text-gray-500">Showing {filteredCustomers.length} of {customers.length} customers</div>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead 
                className="cursor-pointer hover:bg-gray-100" 
                onClick={() => handleSort("name")}
              >
                Customer
                {sortField === "name" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("order_count")}
              >
                Orders
                {sortField === "order_count" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("total_spent")}
              >
                Total Spent
                {sortField === "total_spent" && (
                  <span className="ml-1">
                    {sortDirection === "asc" ? "↑" : "↓"}
                  </span>
                )}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map(customer => (
              <TableRow key={customer.id} className="border-b hover:bg-gray-50 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold mr-3">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar size={12} className="mr-1" />
                        <span>Joined {format(new Date(customer.created_at), "MMM yyyy")}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <p className="mb-1 text-blue-600 hover:underline cursor-pointer">{customer.email}</p>
                  {customer.phone && (
                    <div className="flex items-center text-gray-500">
                      <Phone size={12} className="mr-1" />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <ShoppingBag size={16} className="mr-2 text-green-500" />
                    <span className="font-medium">{customer.order_count || 0}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-1 text-green-600" />
                    <span className="font-medium">${customer.total_spent ? customer.total_spent.toLocaleString() : 0}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="h-8 px-3 border border-gray-200 hover:bg-gray-100 hover:text-gray-800">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 px-2 border border-gray-200 hover:bg-gray-100">
                          <MoreHorizontal size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" /> 
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                          <ShoppingBag className="mr-2 h-4 w-4" /> 
                          Order History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 cursor-pointer" 
                          onClick={() => handleDelete(customer)}
                        >
                          Delete Customer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {filteredCustomers.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          {customers.length === 0 ? "No customers added yet." : "No customers found matching your search criteria."}
        </div>
      )}
      
      <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>
    </Card>
  );
};
