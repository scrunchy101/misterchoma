
import React, { useState, useEffect } from "react";
import { OrderTable } from "@/components/orders/OrderTable";
import { OrderSearchBar } from "@/components/orders/OrderSearchBar";
import { NewOrderDialog } from "@/components/orders/NewOrderDialog";
import { OrdersHeader } from "./OrdersHeader";
import { useOrders, OrderForm, OrderItem } from "@/hooks/useOrders";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useAsyncHandler } from "@/utils/asyncErrorHandler";

export const OrdersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
  const [newOrder, setNewOrder] = useState<OrderForm>({
    customerName: "",
    tableNumber: "",
    status: "pending",
    paymentStatus: "pending"
  });
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  
  const { orders, loading, createOrder } = useOrders();
  const { handleError } = useErrorHandler();
  const { execute: executeAddOrder, loading: addingOrder } = useAsyncHandler<boolean>();

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenNewOrderDialog = () => {
    setNewOrder({
      customerName: "",
      tableNumber: "",
      status: "pending",
      paymentStatus: "pending"
    });
    setSelectedItems([]);
    setShowNewOrderDialog(true);
  };

  const handleAddOrder = async () => {
    try {
      // Use the async handler to wrap our async operation
      const success = await executeAddOrder(
        () => createOrder(newOrder, selectedItems),
        { context: "Creating order", showToast: true }
      );
      
      if (success) {
        setShowNewOrderDialog(false);
      }
    } catch (error) {
      // This is handled by executeAddOrder, but you could add additional handling here
      console.error("Error in handleAddOrder:", error);
    }
  };

  return (
    <ErrorBoundary>
      <div className="bg-gray-700 rounded-lg shadow-lg p-6">
        <OrdersHeader onNewOrder={handleOpenNewOrderDialog} />

        <OrderSearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
        />

        <OrderTable 
          orders={filteredOrders} 
          loading={loading}
        />

        <NewOrderDialog 
          open={showNewOrderDialog} 
          onOpenChange={setShowNewOrderDialog}
          onAddOrder={handleAddOrder}
          isSubmitting={addingOrder}
        />
      </div>
    </ErrorBoundary>
  );
};
