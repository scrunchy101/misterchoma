
import React, { useState } from "react";
import { OrdersTable } from "./OrdersTable";
import { useOrders } from "@/hooks/useOrders";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface OrdersListProps {
  statusFilter: string;
  searchQuery: string;
}

export const OrdersList: React.FC<OrdersListProps> = ({ 
  statusFilter,
  searchQuery
}) => {
  const { orders, loading, fetchOrders } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Apply filters
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (statusFilter !== "all" && order.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }
    
    // Search filter
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !order.customer.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleRefresh = () => {
    fetchOrders();
  };

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseOrderDetails = () => {
    setSelectedOrderId(null);
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between px-6">
        <CardTitle>All Orders</CardTitle>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center p-12 text-gray-400">
            <p>No orders found matching your filters.</p>
          </div>
        ) : (
          <>
            <OrdersTable 
              orders={currentOrders} 
              onViewDetails={handleViewOrderDetails}
            />
            
            {totalPages > 1 && (
              <div className="py-4">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          isActive={currentPage === page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      {selectedOrderId && (
        <OrderDetailsDialog 
          orderId={selectedOrderId} 
          isOpen={!!selectedOrderId} 
          onClose={handleCloseOrderDetails}
        />
      )}
    </Card>
  );
};
